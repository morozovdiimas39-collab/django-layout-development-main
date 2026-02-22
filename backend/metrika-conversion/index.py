"""
Офлайн-конверсии в Яндекс.Метрику по официальному API.
Документация: https://yandex.ru/support/metrica/data/offline-conversion-data
Формат: CSV (ClientId или UserId, Target, DateTime, Price, Currency), загрузка multipart/form-data.
"""
import csv
import io
import json
import os
import time
import requests
from typing import Dict, Any

COUNTER_ID = '104854671'
# Цель по умолчанию для ручной отправки из админки (должна существовать в Метрике)
DEFAULT_GOAL = 'TARGET_CLIENT'


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Принимает: goal (ид цели), client_id, [phone, course, datetime].
    Строит CSV и загружает через официальный API офлайн-конверсий.
    '''
    method: str = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    token = os.environ.get('YANDEX_METRIKA_TOKEN')
    if not token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'YANDEX_METRIKA_TOKEN not configured'})
        }

    body_data = json.loads(event.get('body', '{}'))
    client_id = body_data.get('client_id')
    goal = body_data.get('goal') or DEFAULT_GOAL
    phone = body_data.get('phone', '')
    course = body_data.get('course', '')
    dt = body_data.get('datetime')

    if not client_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'client_id is required'})
        }

    # DateTime в Unix timestamp (секунды). Метрика ждёт секунды в часовом поясе счётчика.
    if dt:
        try:
            from datetime import datetime
            if isinstance(dt, (int, float)):
                date_time = int(dt)
            else:
                date_time = int(datetime.fromisoformat(dt.replace('Z', '+00:00')).timestamp())
        except Exception:
            date_time = int(time.time())
    else:
        date_time = int(time.time())

    # CSV: минимум один идентификатор (ClientId или UserId), Target, DateTime, Price, Currency
    # telegram_* — наш UserID (посетитель без счётчика), иначе — ClientID Метрики с сайта
    is_telegram = str(client_id).strip().lower().startswith('telegram_')
    if is_telegram:
        header = ['UserId', 'Target', 'DateTime', 'Price', 'Currency']
        row = [str(client_id), goal, date_time, 1, 'RUB']
    else:
        header = ['ClientId', 'Target', 'DateTime', 'Price', 'Currency']
        row = [str(client_id), goal, date_time, 1, 'RUB']

    buf = io.StringIO(newline='')
    writer = csv.writer(buf)
    writer.writerow(header)
    writer.writerow(row)
    csv_str = buf.getvalue()
    csv_bytes = csv_str.encode('utf-8')

    url = f'https://api-metrika.yandex.net/management/v1/counter/{COUNTER_ID}/offline_conversions/upload'
    comment = f'Target client conversion - {course}' if course else 'Offline conversion'
    params = {'comment': comment[:255]}

    try:
        response = requests.post(
            url,
            headers={'Authorization': f'OAuth {token}'},
            params=params,
            files={'file': ('conversions.csv', csv_bytes, 'text/csv; charset=utf-8')},
            timeout=30
        )
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Request failed', 'details': str(e)})
        }

    if response.status_code == 200:
        result = response.json()
        uploading = result.get('uploading', {})
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'upload_id': uploading.get('id'),
                'goal': goal,
                'phone': phone,
                'course': course,
                'client_id': client_id,
                'linked_quantity': uploading.get('linked_quantity'),
                'status': uploading.get('status')
            })
        }
    return {
        'statusCode': response.status_code,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'error': 'Metrika API error',
            'details': response.text,
            'status_code': response.status_code
        })
    }
