import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage course modules
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with modules data
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
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            course_type = params.get('course_type') if params else None
            
            if course_type:
                cur.execute(
                    "SELECT * FROM course_modules WHERE course_type = %s ORDER BY order_num",
                    (course_type,)
                )
            else:
                cur.execute("SELECT * FROM course_modules ORDER BY course_type, order_num")
            
            modules = cur.fetchall()
            result = [dict(row) for row in modules]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """
                INSERT INTO course_modules 
                (course_type, title, description, result, image_url, order_num)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    body_data.get('course_type'),
                    body_data.get('title'),
                    body_data.get('description'),
                    body_data.get('result'),
                    body_data.get('image_url'),
                    body_data.get('order_num', 0)
                )
            )
            module = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(module), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            module_id = body_data.get('id')
            
            cur.execute(
                """
                UPDATE course_modules 
                SET title = %s, description = %s, result = %s, 
                    image_url = %s, order_num = %s
                WHERE id = %s
                RETURNING *
                """,
                (
                    body_data.get('title'),
                    body_data.get('description'),
                    body_data.get('result'),
                    body_data.get('image_url'),
                    body_data.get('order_num'),
                    module_id
                )
            )
            module = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            if module:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(module), default=str)
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Module not found'})
                }
        
        cur.close()
        conn.close()
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
