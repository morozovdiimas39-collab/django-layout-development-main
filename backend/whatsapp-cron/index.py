'''
Business: Cron job that automatically sends pending WhatsApp messages when scheduled_at time arrives
Args: event - cloud function trigger event, context - execution context
Returns: HTTP response with number of messages sent
'''

import json
import os
from datetime import datetime
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'body': ''
        }
    
    # Connect to database
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Get pending messages that should be sent now
        cursor.execute("""
            SELECT id, phone, message_text, lead_id
            FROM whatsapp_queue
            WHERE status = 'pending'
            AND scheduled_at <= NOW()
            ORDER BY scheduled_at ASC
            LIMIT 50
        """)
        
        messages = cursor.fetchall()
        sent_count = 0
        failed_count = 0
        
        # Get Green API credentials
        green_api_url = os.environ.get('GREEN_API_URL')
        green_api_instance = os.environ.get('GREEN_API_INSTANCE')
        green_api_token = os.environ.get('GREEN_API_TOKEN')
        
        if not green_api_url or not green_api_instance or not green_api_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Green API credentials not configured'})
            }
        
        # Send each message
        for msg in messages:
            try:
                # Send via Green API
                url = f"{green_api_url}/waInstance{green_api_instance}/sendMessage/{green_api_token}"
                data = {
                    'chatId': f"{msg['phone']}@c.us",
                    'message': msg['message_text']
                }
                
                response = requests.post(url, json=data, timeout=10)
                
                if response.status_code == 200:
                    # Update status to sent
                    cursor.execute("""
                        UPDATE whatsapp_queue
                        SET status = 'sent', sent_at = NOW()
                        WHERE id = %s
                    """, (msg['id'],))
                    sent_count += 1
                else:
                    # Update status to failed
                    error_msg = response.text[:500]
                    cursor.execute("""
                        UPDATE whatsapp_queue
                        SET status = 'failed', error_message = %s
                        WHERE id = %s
                    """, (error_msg, msg['id']))
                    failed_count += 1
                    
            except Exception as send_error:
                # Update status to failed
                cursor.execute("""
                    UPDATE whatsapp_queue
                    SET status = 'failed', error_message = %s
                    WHERE id = %s
                """, (str(send_error)[:500], msg['id']))
                failed_count += 1
        
        conn.commit()
        
        result = {
            'success': True,
            'total_processed': len(messages),
            'sent': sent_count,
            'failed': failed_count,
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result)
        }
        
    finally:
        cursor.close()
        conn.close()