import json
import urllib.request
from typing import Dict, Any

BOT_TOKEN = "8238321643:AAEV7kBinohHb-RSLah7VSBJ2XSsXTQUpW4"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение Chat ID из последних обновлений Telegram бота
    Args: event - dict с httpMethod; context - объект с request_id
    Returns: HTTP response с списком чатов
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
        # Временно удаляем webhook для получения обновлений
        delete_url = f'https://api.telegram.org/bot{BOT_TOKEN}/deleteWebhook?drop_pending_updates=false'
        with urllib.request.urlopen(delete_url) as response:
            delete_result = json.loads(response.read().decode('utf-8'))
        
        # Получаем обновления
        url = f'https://api.telegram.org/bot{BOT_TOKEN}/getUpdates'
        with urllib.request.urlopen(url) as response:
            result = json.loads(response.read().decode('utf-8'))
        
        # Восстанавливаем webhook
        webhook_url = 'https://functions.yandexcloud.net/d4eb3ckc7i9h81v7gcre'
        set_webhook_url = f'https://api.telegram.org/bot{BOT_TOKEN}/setWebhook'
        webhook_data = json.dumps({'url': webhook_url}).encode('utf-8')
        webhook_req = urllib.request.Request(
            set_webhook_url,
            data=webhook_data,
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(webhook_req) as response:
            webhook_restore = json.loads(response.read().decode('utf-8'))
        
        chats = []
        if result.get('ok') and result.get('result'):
            for update in result['result']:
                chat_info = None
                
                if 'message' in update:
                    chat = update['message']['chat']
                    chat_info = {
                        'chat_id': chat['id'],
                        'type': chat['type'],
                        'title': chat.get('title', chat.get('first_name', 'Unknown')),
                        'username': chat.get('username', ''),
                        'update_id': update['update_id']
                    }
                elif 'my_chat_member' in update:
                    chat = update['my_chat_member']['chat']
                    chat_info = {
                        'chat_id': chat['id'],
                        'type': chat['type'],
                        'title': chat.get('title', chat.get('first_name', 'Unknown')),
                        'username': chat.get('username', ''),
                        'update_id': update['update_id'],
                        'status': update['my_chat_member']['new_chat_member']['status']
                    }
                
                if chat_info and not any(c['chat_id'] == chat_info['chat_id'] for c in chats):
                    chats.append(chat_info)
        
        chats.sort(key=lambda x: x.get('update_id', 0), reverse=True)
        
        html = '''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Telegram Chat IDs</title>
            <style>
                body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
                h1 { color: #0088cc; }
                .chat { 
                    background: #f5f5f5; 
                    padding: 15px; 
                    margin: 10px 0; 
                    border-radius: 8px;
                    border-left: 4px solid #0088cc;
                }
                .chat-id { 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #0088cc;
                    font-family: monospace;
                }
                .type { 
                    display: inline-block;
                    padding: 4px 8px;
                    background: #0088cc;
                    color: white;
                    border-radius: 4px;
                    font-size: 12px;
                    margin-left: 10px;
                }
                .group { background: #2ea043; }
                .private { background: #0088cc; }
                .title { font-size: 18px; margin-top: 5px; }
                .hint { color: #666; font-size: 14px; margin-top: 10px; }
                button { 
                    padding: 8px 15px; 
                    background: #0088cc; 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer;
                    margin-top: 10px;
                }
                button:hover { background: #006699; }
            </style>
        </head>
        <body>
            <h1>🤖 Telegram Chat IDs</h1>
        '''
        
        if chats:
            for chat in chats:
                type_class = 'group' if chat['type'] in ['group', 'supergroup'] else 'private'
                type_emoji = '👥' if chat['type'] in ['group', 'supergroup'] else '👤'
                
                html += f'''
                <div class="chat">
                    <div>
                        {type_emoji} <span class="chat-id">{chat['chat_id']}</span>
                        <span class="type {type_class}">{chat['type']}</span>
                    </div>
                    <div class="title">{chat['title']}</div>
                    {f'<div class="hint">@{chat["username"]}</div>' if chat.get('username') else ''}
                    <button onclick="navigator.clipboard.writeText('{chat['chat_id']}')">
                        📋 Скопировать ID
                    </button>
                </div>
                '''
        else:
            html += '<p>❌ Чатов не найдено. Напишите боту в Telegram или добавьте его в группу.</p>'
        
        html += '''
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                <strong>💡 Как использовать:</strong>
                <ol>
                    <li>Найдите ID вашей группы выше</li>
                    <li>Скопируйте его</li>
                    <li>Вставьте в поле TELEGRAM_ADMIN_CHAT_ID</li>
                </ol>
            </div>
        </body>
        </html>
        '''
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': html,
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e),
                'raw_result': result if 'result' in locals() else None
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }