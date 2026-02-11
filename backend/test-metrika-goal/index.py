import json
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Тестовая отправка цели в Яндекс.Метрику
    Args: event - dict с httpMethod, body (goal_name)
    Returns: JSON с результатом отправки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        goal_name = 'целевой_верь_мне'
    else:
        body_str = event.get('body', '{}')
        data = json.loads(body_str) if body_str else {}
        goal_name = data.get('goal', 'целевой_верь_мне')
    
    counter_id = '104854671'
    client_id = 'test_verification_12345'
    
    url = f'https://mc.yandex.ru/watch/{counter_id}/1'
    
    query_params = {
        'page-url': f'https://actor-school.ru/test/{goal_name}',
        'page-ref': 'https://actor-school.ru',
        'browser-info': f'ar:1:pv:1:ps:1:en:utf-8:i:{client_id}',
        'site-info': json.dumps({
            'goal': goal_name,
            'test': True,
            'verification': 'manual_test'
        })
    }
    
    full_url = url + '?' + urllib.parse.urlencode(query_params)
    
    try:
        req = urllib.request.Request(full_url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        with urllib.request.urlopen(req, timeout=5) as response:
            result = {
                'success': True,
                'goal': goal_name,
                'counter_id': counter_id,
                'status': response.status,
                'message': f'Цель "{goal_name}" успешно отправлена в Метрику',
                'client_id': client_id
            }
    except Exception as e:
        result = {
            'success': False,
            'error': str(e),
            'goal': goal_name
        }
    
    measurement_protocol_url = f'https://mc.yandex.ru/watch/{counter_id}'
    payload = {
        'wmode': '7',
        'wv-type': '0',
        'page-url': f'https://actor-school.ru/test/{goal_name}',
        'charset': 'utf-8',
        'ut': 'noindex',
        'browser-info': 'ar:1:pv:1:ps:1:s:1920x1080x24:sk:1',
        'site-info': json.dumps({
            'goal': goal_name,
            'test': True,
            'verification': 'manual_test'
        })
    }
    
    try:
        req_data = urllib.parse.urlencode(payload).encode('utf-8')
        req = urllib.request.Request(measurement_protocol_url, data=req_data)
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        req.add_header('User-Agent', 'Mozilla/5.0 (compatible; MetrikaBot/1.0)')
        
        with urllib.request.urlopen(req, timeout=5) as response:
            result['measurement_protocol'] = True
    except Exception as e:
        result['measurement_protocol_error'] = str(e)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False),
        'isBase64Encoded': False
    }
