"""
Файл конверсий для «Загрузка конверсий по ссылке» (Яндекс.Директ).
Спецификация по колонкам: docs/DIRECT_CONVERSIONS_CSV_SPEC.md
Справка: https://yandex.ru/support/direct/statistics/conversions.html
"""
import hashlib
import json
import os
import re
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import csv
from io import StringIO

# Окно атрибуции: конверсии старше 113 дней Директ отклонит (ошибка «create_date_time is older than 113 days»)
MAX_DAYS_AGE = 113

# Ценность конверсии по статусу (руб.). Директ: неотрицательное число, макс. 9223372036854
CONVERSION_REVENUE = {
    'trial_scheduled': 500,
    'trial_completed': 1000,
    'enrolled': 5000,
    'paid': 15000,
}
MAX_REVENUE = 9223372036854

# В файле для Директа order_status — только 4 значения: IN_PROGRESS, PAID, CANCELLED, SPAM (как в интерфейсе)
STATUS_TO_ORDER_STATUS = {
    'trial_scheduled': 'IN_PROGRESS',
    'trial_completed': 'IN_PROGRESS',
    'enrolled': 'IN_PROGRESS',
    'paid': 'PAID',
}


def _normalize_phone(phone: str) -> str:
    """Телефон по справке: числовая строка, код страны, без пробелов и доп. символов. Пример: 79995551111."""
    if not phone:
        return ''
    digits = re.sub(r'\D', '', str(phone))
    if len(digits) == 10 and digits.startswith('9'):
        digits = '7' + digits
    elif len(digits) == 11 and digits.startswith('8'):
        digits = '7' + digits[1:]
    # Не передаём слишком короткие номера — Директ вернёт Invalid 'phones' identifier
    if len(digits) < 10:
        return ''
    return digits


def _phone_md5(normalized_phone: str) -> str:
    """MD5 от нормализованного телефона. Справка: 79995551111 → f09f2c3d48f31e2a802944ade2e5aec5."""
    if not normalized_phone:
        return ''
    return hashlib.md5(normalized_phone.encode('utf-8')).hexdigest().lower()


def _valid_client_id(raw: str) -> str:
    """ClientID по справке: полное положительное число. Иначе — пустая строка (не передаём)."""
    if not raw:
        return ''
    s = str(raw).strip()
    if s.lower().startswith('telegram_'):
        return ''
    if s.isdigit() and int(s) > 0:
        return s
    return ''


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    GET: отдаёт CSV в формате «Загрузка конверсий по ссылке» (Директ + Метрика).
    Колонки: create_date_time;id;client_uniq_id;client_ids;emails;phones;emails_md5;phones_md5;order_status;revenue;cost
    order_status = идентификаторы целей Метрики: trial_scheduled, trial_completed, enrolled, paid.
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

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SET search_path TO public, t_p90119217_django_layout_develo")
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
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

    output = StringIO()
    writer = csv.writer(output, delimiter=';', quoting=csv.QUOTE_MINIMAL)

    # Порядок колонок по справке Директа. Спецификация: docs/DIRECT_CONVERSIONS_CSV_SPEC.md
    writer.writerow([
        'create_date_time',  # обязательно, dd.MM.yyyy HH:mm:ss
        'id',                # необяз., идентификатор заказа в CRM
        'client_uniq_id',    # необяз., идентификатор клиента в CRM
        'client_ids',        # ClientID Метрики (если с сайта)
        'emails',
        'phones',            # только цифры, код страны, без пробелов
        'emails_md5',
        'phones_md5',
        'order_status',      # только IN_PROGRESS, PAID, CANCELLED, SPAM
        'revenue',           # десятичная дробь, точка
        'cost',
    ])

    now = datetime.now()
    cutoff = now - timedelta(days=MAX_DAYS_AGE)

    for lead in leads:
        dt = lead.get('updated_at') or lead.get('created_at')
        if isinstance(dt, str):
            try:
                dt = datetime.fromisoformat(dt.replace('Z', '+00:00'))
            except Exception:
                dt = now
        if dt.tzinfo:
            dt = dt.astimezone().replace(tzinfo=None)
        if dt > now:
            dt = now
        if dt < cutoff:
            continue
        create_date_time = dt.strftime('%d.%m.%Y %H:%M:%S')

        lead_id = lead.get('id') or ''
        client_uniq_id = f"lead_{lead_id}"
        client_ids = _valid_client_id(lead.get('ym_client_id') or '')
        emails = ''
        phones = _normalize_phone(lead.get('phone') or '')
        emails_md5 = ''
        phones_md5 = _phone_md5(phones)

        if not client_ids and not phones:
            continue

        order_status = STATUS_TO_ORDER_STATUS.get(lead['status'], 'IN_PROGRESS')
        revenue_val = CONVERSION_REVENUE.get(lead['status'], 0)
        if revenue_val < 0 or revenue_val > MAX_REVENUE:
            revenue_val = 0
        revenue = f'{float(revenue_val):.1f}' if revenue_val else ''
        cost = ''

        writer.writerow([
            create_date_time,
            lead_id,
            client_uniq_id,
            client_ids,
            emails,
            phones,
            emails_md5,
            phones_md5,
            order_status,
            revenue,
            cost,
        ])

    csv_content = output.getvalue()
    output.close()

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="direct_conversions.csv"',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, max-age=0',
        },
        'body': csv_content
    }
