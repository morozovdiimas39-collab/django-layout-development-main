import json
import os
import requests

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