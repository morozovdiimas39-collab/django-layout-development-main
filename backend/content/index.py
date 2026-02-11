import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage editable site content
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with content data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters', {})
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            key = params.get('key') if params else None
            page = params.get('page') if params else None
            
            if key:
                escaped_key = key.replace("'", "''")
                cur.execute(f"SELECT * FROM editable_content WHERE content_key = '{escaped_key}'")
                content = cur.fetchone()
                result = dict(content) if content else None
            elif page:
                escaped_page = page.replace("'", "''")
                cur.execute(f"SELECT * FROM editable_content WHERE page = '{escaped_page}' ORDER BY content_key")
                content = cur.fetchall()
                result = [dict(row) for row in content]
            else:
                cur.execute("SELECT id, key, value, updated_at FROM site_content ORDER BY key")
                content = cur.fetchall()
                result = [dict(row) for row in content]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            content_key = body_data.get('key')
            content_value = body_data.get('value')
            
            if not content_key or content_value is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'key and value are required'}),
                    'isBase64Encoded': False
                }
            
            escaped_key = content_key.replace("'", "''")
            escaped_value = str(content_value).replace("'", "''") if content_value else ''
            
            cur.execute(
                f"""
                INSERT INTO site_content (key, value, updated_at)
                VALUES ('{escaped_key}', '{escaped_value}', CURRENT_TIMESTAMP)
                ON CONFLICT (key)
                DO UPDATE SET 
                    value = EXCLUDED.value, 
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
                """
            )
            updated = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated), default=str),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        
    except Exception as e:
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