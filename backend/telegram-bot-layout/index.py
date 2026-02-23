import json
import os
from typing import Optional
import requests

# Маппинг callback_data кнопок -> статус в БД (leads). В Директ: called_target→IN_PROGRESS, trial_scheduled→PAID, thinking→CANCELLED, irrelevant→SPAM.
CALLBACK_TO_STATUS = {
    'called_target': 'called_target',
    'trial': 'trial_scheduled',
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

    if not data.startswith('status_'):
        _answer_callback(telegram_token, callback_id, "Неизвестная кнопка", proxy_url)
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok'}), 'isBase64Encoded': False}

    parts = data.split('_', 2)
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
    '''Telegram бот (layout) с интеграцией Gemini 2.5 Flash через прокси'''

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
    gemini_api_key = os.environ.get('GEMINI_API_KEY')  # необязательно — только для ответов на текстовые сообщения
    proxy_url = os.environ.get('TELEGRAM_PROXY_URL')

    if not telegram_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing TELEGRAM_BOT_TOKEN'}),
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
        body = event.get('body') or '{}'
        if isinstance(body, dict):
            update = body
        else:
            raw = body if isinstance(body, str) else str(body)
            try:
                update = json.loads(raw)
            except json.JSONDecodeError:
                if event.get('isBase64Encoded'):
                    try:
                        import base64
                        update = json.loads(base64.b64decode(raw).decode('utf-8'))
                    except Exception:
                        update = {}
                else:
                    update = {}
        if not isinstance(update, dict):
            update = {}

        # Нажатие кнопки — сразу в обработчик, чтобы ответить Telegram вовремя
        if update.get('callback_query'):
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

        telegram_api_url = f'https://api.telegram.org/bot{telegram_token}/sendMessage'

        if gemini_api_key:
            print(f"Calling Gemini API with text: {text}")
            gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}'
            gemini_payload = {'contents': [{'parts': [{'text': text}]}]}
            try:
                gemini_response = requests.post(gemini_url, json=gemini_payload, proxies=proxies, timeout=30)
                if gemini_response.status_code == 200:
                    reply_text = gemini_response.json()['candidates'][0]['content']['parts'][0]['text']
                else:
                    reply_text = "Сейчас не могу ответить. Оставьте заявку на сайте."
            except Exception as e:
                print(f"Gemini error: {e}")
                reply_text = "Сейчас не могу ответить. Оставьте заявку на сайте."
        else:
            reply_text = "Оставьте заявку на сайте — мы перезвоним."

        requests.post(
            telegram_api_url,
            json={'chat_id': chat_id, 'text': reply_text, 'parse_mode': 'Markdown'},
            proxies=proxies,
            timeout=10
        )

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'ok'}),
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
