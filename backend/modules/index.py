import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor


def _parse_body(event: Dict[str, Any]) -> Dict[str, Any]:
    body = event.get('body') or '{}'
    if isinstance(body, dict):
        return body
    if event.get('isBase64Encoded') and isinstance(body, str):
        import base64
        try:
            body = base64.b64decode(body).decode('utf-8')
        except Exception:
            pass
    try:
        return json.loads(body) if body else {}
    except json.JSONDecodeError:
        return {}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage course modules
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with modules data
    '''
    method: str = (event.get('httpMethod') or 'GET').upper()
    
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
        cur.execute("SET search_path TO public")

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            course_type = params.get('course_type')
            
            if course_type:
                cur.execute(
                    "SELECT * FROM public.course_modules WHERE course_type = %s ORDER BY order_num",
                    (course_type,)
                )
            else:
                cur.execute("SELECT * FROM public.course_modules ORDER BY course_type, order_num")
            
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
            body_data = _parse_body(event)
            
            cur.execute(
                """
                INSERT INTO public.course_modules 
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
            body_data = _parse_body(event)
            module_id = body_data.get('id')
            
            cur.execute(
                """
                UPDATE public.course_modules 
                SET course_type = %s, title = %s, description = %s, result = %s, 
                    image_url = %s, order_num = %s
                WHERE id = %s
                RETURNING *
                """,
                (
                    body_data.get('course_type'),
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
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            body_data = _parse_body(event)
            raw_id = body_data.get('id') or params.get('id')
            if not raw_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id required'})
                }
            try:
                module_id = int(raw_id)
            except (TypeError, ValueError):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id must be a number'})
                }
            cur.execute("DELETE FROM public.course_modules WHERE id = %s RETURNING id", (module_id,))
            deleted = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            if deleted:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'deleted': True, 'id': module_id})
                }
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
