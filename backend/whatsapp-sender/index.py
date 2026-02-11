import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import urllib.request

GREEN_API_URL = os.environ.get('GREEN_API_URL', 'https://1105.api.green-api.com')
GREEN_API_INSTANCE = os.environ.get('GREEN_API_INSTANCE', '1105359047')
GREEN_API_TOKEN = os.environ.get('GREEN_API_TOKEN', '3dbfcbea2a8d478db531df9f4ca22d2a59a65d7f32e74a5288')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send WhatsApp messages via Green API and process queue
    Args: event with httpMethod, body
    Returns: HTTP response with sending status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        return process_queue()
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        phone = body_data.get('phone')
        message = body_data.get('message')
        
        if not phone or not message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Phone and message are required'}),
                'isBase64Encoded': False
            }
        
        result = send_whatsapp_message(phone, message)
        
        return {
            'statusCode': 200 if result.get('success') else 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def send_whatsapp_message(phone: str, message: str, file_url: str = None, file_name: str = None) -> dict:
    '''Отправка WhatsApp сообщения через Green API с опциональным файлом'''
    
    if not phone.startswith('7'):
        phone = '7' + phone.lstrip('+').lstrip('8')
    
    chatId = f"{phone}@c.us"
    
    if file_url:
        url = f"{GREEN_API_URL}/waInstance{GREEN_API_INSTANCE}/sendFileByUrl/{GREEN_API_TOKEN}"
        payload = {
            'chatId': chatId,
            'urlFile': file_url,
            'fileName': file_name or 'file',
            'caption': message
        }
    else:
        url = f"{GREEN_API_URL}/waInstance{GREEN_API_INSTANCE}/sendMessage/{GREEN_API_TOKEN}"
        payload = {
            'chatId': chatId,
            'message': message
        }
    
    try:
        data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            return {
                'success': True,
                'data': result,
                'phone': phone,
                'message': message,
                'file_url': file_url
            }
    
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            'success': False,
            'error': str(e),
            'phone': phone
        }

def process_queue() -> dict:
    '''Обработка очереди WhatsApp сообщений (вызывается по крону или вручную)'''
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        now = datetime.now()
        
        cur.execute(
            """SELECT * FROM whatsapp_queue 
               WHERE status = 'pending' 
               AND scheduled_at <= %s 
               ORDER BY scheduled_at ASC 
               LIMIT 10""",
            (now,)
        )
        
        messages = cur.fetchall()
        
        sent_count = 0
        failed_count = 0
        results = []
        
        for msg in messages:
            file_url = msg.get('file_url')
            file_name = msg.get('file_name')
            result = send_whatsapp_message(msg['phone'], msg['message_text'], file_url, file_name)
            
            if result.get('success'):
                cur.execute(
                    """UPDATE whatsapp_queue 
                       SET status = 'sent', 
                           sent_at = CURRENT_TIMESTAMP,
                           green_api_response = %s,
                           updated_at = CURRENT_TIMESTAMP
                       WHERE id = %s""",
                    (json.dumps(result.get('data', {})), msg['id'])
                )
                
                cur.execute(
                    "UPDATE leads SET last_whatsapp_sent_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (msg['lead_id'],)
                )
                
                sent_count += 1
            else:
                cur.execute(
                    """UPDATE whatsapp_queue 
                       SET status = 'failed',
                           error_message = %s,
                           updated_at = CURRENT_TIMESTAMP
                       WHERE id = %s""",
                    (result.get('error', 'Unknown error'), msg['id'])
                )
                failed_count += 1
            
            results.append({
                'id': msg['id'],
                'phone': msg['phone'],
                'template': msg['message_template'],
                'success': result.get('success')
            })
            
            conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'processed': len(messages),
                'sent': sent_count,
                'failed': failed_count,
                'results': results
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"Error processing queue: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }