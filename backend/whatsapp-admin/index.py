import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Admin API for WhatsApp campaigns management
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with campaigns data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        params = event.get('queryStringParameters', {}) or {}
        resource = params.get('resource', 'queue')
        
        if method == 'GET':
            if resource == 'queue':
                status_filter = params.get('status')
                
                query = """
                    SELECT 
                        wq.*,
                        l.phone as lead_phone,
                        l.course,
                        l.name as lead_name
                    FROM whatsapp_queue wq
                    LEFT JOIN leads l ON wq.lead_id = l.id
                """
                
                if status_filter:
                    query += f" WHERE wq.status = '{status_filter}'"
                
                query += " ORDER BY wq.scheduled_at DESC LIMIT 100"
                
                cur.execute(query)
                queue = cur.fetchall()
                result = [dict(row) for row in queue]
                
            elif resource == 'templates':
                cur.execute("SELECT * FROM whatsapp_templates ORDER BY delay_days ASC")
                templates = cur.fetchall()
                result = [dict(row) for row in templates]
                
            elif resource == 'stats':
                cur.execute("""
                    SELECT 
                        status,
                        COUNT(*) as count
                    FROM whatsapp_queue
                    GROUP BY status
                """)
                stats = cur.fetchall()
                
                cur.execute("""
                    SELECT COUNT(*) as active_campaigns
                    FROM leads
                    WHERE whatsapp_campaign_active = TRUE
                """)
                active = cur.fetchone()
                
                result = {
                    'stats': [dict(row) for row in stats],
                    'active_campaigns': active['active_campaigns'] if active else 0
                }
            
            else:
                result = {'error': 'Unknown resource'}
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if resource == 'templates':
                name = body_data.get('name')
                title = body_data.get('title')
                content = body_data.get('content')
                delay_days = body_data.get('delay_days')
                course = body_data.get('course')
                file_url = body_data.get('file_url')
                file_type = body_data.get('file_type')
                file_name = body_data.get('file_name')
                
                cur.execute(
                    """INSERT INTO whatsapp_templates 
                       (name, title, content, delay_days, course, active, file_url, file_type, file_name)
                       VALUES (%s, %s, %s, %s, %s, TRUE, %s, %s, %s)
                       RETURNING *""",
                    (name, title, content, delay_days, course, file_url, file_type, file_name)
                )
                template = cur.fetchone()
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(template), default=str),
                    'isBase64Encoded': False
                }
            
            elif resource == 'send_now':
                queue_id = body_data.get('queue_id')
                
                if not queue_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'queue_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "UPDATE whatsapp_queue SET scheduled_at = CURRENT_TIMESTAMP, status = 'pending' WHERE id = %s RETURNING *",
                    (queue_id,)
                )
                updated = cur.fetchone()
                conn.commit()
                
                cur.close()
                conn.close()
                
                sender_url = 'https://functions.yandexcloud.net/d4ekf1kqhsodfoojvu00'
                try:
                    req = urllib.request.Request(sender_url, method='GET')
                    with urllib.request.urlopen(req, timeout=5) as response:
                        send_result = json.loads(response.read().decode('utf-8'))
                        print(f"Send triggered: {send_result}")
                except Exception as e:
                    print(f"Failed to trigger sender: {e}")
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(updated) if updated else {}, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            if resource == 'templates':
                template_id = body_data.get('id')
                updates = []
                values = []
                
                for field in ['title', 'content', 'delay_days', 'course', 'active', 'file_url', 'file_type', 'file_name']:
                    if field in body_data:
                        updates.append(f"{field} = %s")
                        values.append(body_data[field])
                
                if not updates:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No fields to update'}),
                        'isBase64Encoded': False
                    }
                
                values.append(template_id)
                query = f"UPDATE whatsapp_templates SET {', '.join(updates)} WHERE id = %s RETURNING *"
                
                cur.execute(query, values)
                template = cur.fetchone()
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(template) if template else {}, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            if resource == 'queue':
                queue_id = params.get('id')
                phone = params.get('phone')
                
                if phone:
                    cur.execute("DELETE FROM whatsapp_queue WHERE phone = %s", (phone,))
                    deleted_count = cur.rowcount
                    conn.commit()
                    
                    cur.close()
                    conn.close()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True, 'deleted': deleted_count}),
                        'isBase64Encoded': False
                    }
                
                if not queue_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'id or phone is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("DELETE FROM whatsapp_queue WHERE id = %s", (queue_id,))
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif resource == 'templates':
                template_id = params.get('id')
                
                if not template_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'id is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("DELETE FROM whatsapp_templates WHERE id = %s", (template_id,))
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }