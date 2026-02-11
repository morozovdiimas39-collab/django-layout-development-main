import json
import urllib.request
import os
from typing import Dict, Any

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN_NEW') or os.environ.get('TELEGRAM_BOT_TOKEN')
WEBHOOK_URL = "https://functions.poehali.dev/ee18a8c5-48c7-4ecd-bf90-d69fbfc2d751"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Настройка webhook для Telegram бота
    Args: event - dict с httpMethod; context - объект с request_id
    Returns: HTTP response dict с результатом настройки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        print("Setting webhook...")
        url = f'https://api.telegram.org/bot{BOT_TOKEN}/setWebhook'
        data = json.dumps({
            'url': WEBHOOK_URL,
            'drop_pending_updates': True
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            set_result = json.loads(response.read().decode('utf-8'))
        
        print("Checking webhook info...")
        url = f'https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo'
        with urllib.request.urlopen(url) as response:
            info_result = json.loads(response.read().decode('utf-8'))
        
        result = {
            'success': True,
            'set_webhook': set_result,
            'webhook_info': info_result,
            'message': 'Webhook успешно настроен! Напишите боту /start в Telegram'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False, indent=2),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }