import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка целей в Яндекс.Метрику через Server-Side API
    Args: event - dict с httpMethod, body (goal_name, client_id, lead_id, params)
    Returns: JSON с результатом отправки
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
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
    
    body_str = event.get('body', '{}')
    data = json.loads(body_str)
    
    goal = data.get('goal', 'trial')
    client_id = data.get('client_id', '')
    lead_id = data.get('lead_id')
    params = data.get('params', {})
    
    counter_id = '104854671'
    
    result = {
        'success': False,
        'goal': goal,
        'client_id': client_id,
        'methods_tried': []
    }
    
    if client_id:
        url = f'https://mc.yandex.ru/watch/{counter_id}/1'
        
        query_params = {
            'page-url': f'https://actor-school.ru/goals/{goal}',
            'page-ref': 'https://actor-school.ru',
            'browser-info': f'ar:1:pv:1:ps:1:en:utf-8',
            'site-info': json.dumps({
                'goal': goal,
                'lead_id': lead_id,
                **params
            })
        }
        
        if client_id.startswith('telegram_'):
            query_params['browser-info'] += f':uid:{client_id}'
        else:
            query_params['browser-info'] += f':i:{client_id}'
        
        full_url = url + '?' + urllib.parse.urlencode(query_params)
        
        try:
            req = urllib.request.Request(full_url)
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
            
            with urllib.request.urlopen(req, timeout=5) as response:
                result['success'] = True
                result['methods_tried'].append({
                    'method': 'server_side_api',
                    'status': response.status,
                    'url': full_url
                })
        except Exception as e:
            result['methods_tried'].append({
                'method': 'server_side_api',
                'error': str(e)
            })
    else:
        result['error'] = 'client_id not provided'
    
    measurement_protocol_url = f'https://mc.yandex.ru/watch/{counter_id}'
    payload = {
        'wmode': '7',
        'wv-type': '0',
        'page-url': f'https://actor-school.ru/goals/{goal}',
        'charset': 'utf-8',
        'ut': 'noindex',
        'browser-info': 'ar:1:pv:1:ps:1:s:1920x1080x24:sk:1',
        'site-info': json.dumps({
            'goal': goal,
            'lead_id': lead_id,
            'source': params.get('source', 'telegram'),
            **params
        })
    }
    
    try:
        req_data = urllib.parse.urlencode(payload).encode('utf-8')
        req = urllib.request.Request(measurement_protocol_url, data=req_data)
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        req.add_header('User-Agent', 'Mozilla/5.0 (compatible; MetrikaBot/1.0)')
        
        with urllib.request.urlopen(req, timeout=5) as response:
            result['success'] = True
            result['methods_tried'].append({
                'method': 'measurement_protocol',
                'status': response.status
            })
    except Exception as e:
        result['methods_tried'].append({
            'method': 'measurement_protocol',
            'error': str(e)
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False),
        'isBase64Encoded': False
    }
