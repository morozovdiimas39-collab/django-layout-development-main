import json
import os
from typing import Optional
import requests

# Маппинг callback_data кнопок -> статус в БД (leads). trial_scheduled/enrolled попадают в Метрику и CSV.
CALLBACK_TO_STATUS = {
    'trial': 'trial_scheduled',
    'enrolled': 'enrolled',
    'thinking': 'thinking',
    'irrelevant': 'irrelevant',
}


def _handle_callback_query(callback_query: dict, telegram_token: str, proxy_url: Optional[str]) -> dict:
    """Обработка нажатия кнопки под заявкой: PUT в leads, answer_callback_query."""
    callback_id = callback_query.get('id')
    data = callback_query.get('data', '')
    chat_id = callback_query.get('message', {}).get('chat', {}).get('id')
    message_id = callback_query.get('message', {}).get('message_id')

    print(f"Callback: data={data}, chat_id={chat_id}")

    # Позвонил клиенту — только уведомление, статус не меняем (или можно добавить статус "called")
    if data.startswith('called_'):
        _answer_callback(telegram_token, callback_id, "Отмечено: позвонил", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok'}), 'isBase64Encoded': False}

    if not data.startswith('status_'):
        _answer_callback(telegram_token, callback_id, "Неизвестная кнопка", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok'}), 'isBase64Encoded': False}

    parts = data.split('_')
    if len(parts) != 3:
        _answer_callback(telegram_token, callback_id, "Ошибка формата", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok'}), 'isBase64Encoded': False}

    _, lead_id_str, action = parts
    try:
        lead_id = int(lead_id_str)
    except ValueError:
        _answer_callback(telegram_token, callback_id, "Неверный ID заявки", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok'}), 'isBase64Encoded': False}

    status = CALLBACK_TO_STATUS.get(action)
    if not status:
        _answer_callback(telegram_token, callback_id, f"Неизвестный статус: {action}", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok'}), 'isBase64Encoded': False}

    leads_url = os.environ.get('LEADS_API_URL', 'https://functions.yandexcloud.net/d4edr6jj85mv48hoo4e1')
    put_body = json.dumps({'id': lead_id, 'status': status})
    try:
        r = requests.put(
            leads_url,
            data=put_body,
            headers={'Content-Type': 'application/json'},
            timeout=15
        )
        if r.status_code != 200:
            print(f"Leads PUT failed: {r.status_code} {r.text}")
            _answer_callback(telegram_token, callback_id, f"Ошибка обновления: {r.status_code}", proxy_url)
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok', 'error': r.text}), 'isBase64Encoded': False}
    except Exception as e:
        print(f"Leads PUT error: {e}")
        _answer_callback(telegram_token, callback_id, "Ошибка связи с сервером", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok', 'error': str(e)}), 'isBase64Encoded': False}

    _answer_callback(telegram_token, callback_id, "Статус обновлён", proxy_url)
    return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok', 'lead_id': lead_id, 'status': status}), 'isBase64Encoded': False}


def _answer_callback(telegram_token: str, callback_id: str, text: str, proxy_url: Optional[str]) -> None:
    proxies = {'http': proxy_url, 'https': proxy_url} if proxy_url else None
    url = f'https://api.telegram.org/bot{telegram_token}/answerCallbackQuery'
    requests.post(url, json={'callback_query_id': callback_id, 'text': text[:200]}, proxies=proxies, timeout=5)


def handler(event: dict, context) -> dict:
    '''Telegram бот с интеграцией Gemini 2.5 Flash через прокси'''
    
    print(f"Received event: {json.dumps(event)}")
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN_NEW') or os.environ.get('TELEGRAM_BOT_TOKEN')
    gemini_api_key = os.environ.get('GEMINI_API_KEY')
    proxy_url = os.environ.get('TELEGRAM_PROXY_URL')
    
    if not telegram_token or not gemini_api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing credentials'}),
            'isBase64Encoded': False
        }
    
    proxies = None
    if proxy_url:
        proxies = {
            'http': proxy_url,
            'https': proxy_url
        }
        print(f"Using proxy: {proxy_url}")
    
    try:
        body_str = event.get('body', '{}')
        print(f"Body: {body_str}")
        update = json.loads(body_str)
        print(f"Update parsed: {json.dumps(update)}")

        # Нажатие кнопки под сообщением о заявке: обновляем статус в leads и уходим в Метрику/CSV
        if 'callback_query' in update:
            return _handle_callback_query(update['callback_query'], telegram_token, proxy_url)

        if 'message' not in update:
            print("No message in update")
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }

        message = update['message']
        chat_id = message['chat']['id']
        text = message.get('text', '')
        print(f"Chat ID: {chat_id}, Text: {text}")
        
        if not text:
            print("No text in message")
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }
        
        print(f"Calling Gemini API with text: {text}")
        gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}'
        
        gemini_payload = {
            'contents': [{
                'parts': [{
                    'text': text
                }]
            }]
        }
        
        gemini_response = requests.post(
            gemini_url,
            json=gemini_payload,
            proxies=proxies,
            timeout=30
        )
        
        print(f"Gemini status: {gemini_response.status_code}")
        print(f"Gemini response: {gemini_response.text}")
        
        if gemini_response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Gemini API error', 'details': gemini_response.text}),
                'isBase64Encoded': False
            }
        
        gemini_data = gemini_response.json()
        reply_text = gemini_data['candidates'][0]['content']['parts'][0]['text']
        print(f"Gemini reply: {reply_text}")
        
        telegram_api_url = f'https://api.telegram.org/bot{telegram_token}/sendMessage'
        
        payload = {
            'chat_id': chat_id,
            'text': reply_text,
            'parse_mode': 'Markdown'
        }
        
        telegram_response = requests.post(
            telegram_api_url,
            json=payload,
            proxies=proxies,
            timeout=30
        )
        
        if telegram_response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to send message', 'details': telegram_response.text}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'ok', 'reply': reply_text}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }