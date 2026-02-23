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
    Business: Manage editable site content
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with content data
    '''
    method: str = (event.get('httpMethod') or 'GET').upper()
    print(f"[content] {method}")
    
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
        params = event.get('queryStringParameters') or {}
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SET search_path TO public")

        if method == 'GET':
            key = params.get('key')
            page = params.get('page')
            
            if key:
                escaped_key = key.replace("'", "''")
                cur.execute(f"SELECT * FROM public.editable_content WHERE content_key = '{escaped_key}'")
                content = cur.fetchone()
                result = dict(content) if content else None
            elif page:
                escaped_page = page.replace("'", "''")
                cur.execute(f"SELECT * FROM public.editable_content WHERE page = '{escaped_page}' ORDER BY content_key")
                content = cur.fetchall()
                result = [dict(row) for row in content]
            else:
                cur.execute("SELECT id, key, value, updated_at FROM public.site_content ORDER BY key")
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
            body_data = _parse_body(event)
            content_key = body_data.get('key')
            content_value = body_data.get('value')
            
            if not content_key or content_value is None:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'key and value are required'}),
                    'isBase64Encoded': False
                }
            
            value_str = str(content_value) if content_value else ''
            cur.execute(
                """
                INSERT INTO public.site_content (key, value, updated_at)
                VALUES (%s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (key)
                DO UPDATE SET
                    value = EXCLUDED.value,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
                """,
                (content_key, value_str)
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
        import traceback
        err_msg = str(e)
        print(f"[content] ERROR: {err_msg}")
        print(f"[content] TRACEBACK: {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': err_msg}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }