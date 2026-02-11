import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send offline conversion to Yandex Metrika with ClientID
    Args: event with httpMethod, body (lead_id, client_id, phone, course)
    Returns: HTTP response with conversion result
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
    phone = body_data.get('phone', '')
    course = body_data.get('course', '')
    
    if not client_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'client_id is required'})
        }
    
    counter_id = '104854671'
    
    conversion_data = {
        'uploading': {
            'client_id_type': 'CLIENT_ID',
            'comment': f'Target client conversion - {course}'
        },
        'conversions': [
            {
                'ClientId': str(client_id),
                'Target': 'TARGET_CLIENT',
                'DateTime': body_data.get('datetime'),
                'Price': 1,
                'Currency': 'RUB'
            }
        ]
    }
    
    url = f'https://api-metrika.yandex.net/management/v1/counter/{counter_id}/offline_conversions/upload'
    headers = {
        'Authorization': f'OAuth {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, headers=headers, json=conversion_data)
    
    if response.status_code == 200:
        result = response.json()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'upload_id': result.get('uploading', {}).get('id'),
                'phone': phone,
                'course': course,
                'client_id': client_id
            })
        }
    else:
        return {
            'statusCode': response.status_code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Metrika API error',
                'details': response.text,
                'status_code': response.status_code
            })
        }
