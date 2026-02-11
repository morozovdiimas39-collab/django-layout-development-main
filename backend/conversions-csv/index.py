import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import csv
from io import StringIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate CSV with conversions for Yandex.Direct offline conversions
    Args: event with httpMethod
    Returns: CSV file with conversions in Yandex.Direct format
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
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT 
            id,
            name,
            phone,
            course,
            status,
            ym_client_id,
            created_at,
            updated_at
        FROM leads 
        WHERE status IN ('trial_scheduled', 'trial_completed', 'enrolled', 'paid')
        ORDER BY updated_at DESC
    """)
    
    leads = cur.fetchall()
    cur.close()
    conn.close()
    
    output = StringIO()
    writer = csv.writer(output)
    
    writer.writerow([
        'ClientId',
        'Target',
        'DateTime',
        'Price',
        'Currency'
    ])
    
    conversion_prices = {
        'trial_scheduled': 500,
        'trial_completed': 1000,
        'enrolled': 5000,
        'paid': 15000
    }
    
    for lead in leads:
        client_id = lead.get('ym_client_id') or f"telegram_{lead['id']}"
        target = lead['status']
        
        dt = lead.get('updated_at') or lead.get('created_at')
        if isinstance(dt, str):
            dt = datetime.fromisoformat(dt.replace('Z', '+00:00'))
        datetime_str = dt.strftime('%Y-%m-%d %H:%M:%S')
        
        price = conversion_prices.get(target, 0)
        currency = 'RUB'
        
        writer.writerow([
            client_id,
            target,
            datetime_str,
            price,
            currency
        ])
    
    csv_content = output.getvalue()
    output.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="yandex_direct_conversions.csv"',
            'Access-Control-Allow-Origin': '*'
        },
        'body': csv_content
    }
