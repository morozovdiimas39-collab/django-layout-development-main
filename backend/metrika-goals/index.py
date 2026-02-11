import json
import os
from typing import Dict, Any
import urllib.request

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Track Yandex Metrika goals from backend
    Args: event with httpMethod, body
    Returns: HTTP response
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        goal = body_data.get('goal')
        client_id = body_data.get('client_id')
        
        if not goal:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Goal is required'}),
                'isBase64Encoded': False
            }
        
        user_id_js = f"_ym_uid: '{client_id}'," if client_id else ""
        
        html_content = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <script type="text/javascript">
                (function(m,e,t,r,i,k,a){{
                    m[i]=m[i]||function(){{(m[i].a=m[i].a||[]).push(arguments)}};
                    m[i].l=1*new Date();
                    for (var j = 0; j < document.scripts.length; j++) {{if (document.scripts[j].src === r) {{ return; }}}}
                    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                }})(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

                ym(104854671, 'init', {{
                    {user_id_js}
                    ssr: true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    ecommerce:"dataLayer"
                }});
                
                ym(104854671, 'reachGoal', '{goal}');
            </script>
        </head>
        <body>
            <p>Цель "{goal}" отправлена в Яндекс.Метрику</p>
        </body>
        </html>
        '''
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': html_content,
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }