import json
import os
import urllib.parse
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request

BOT_TOKEN = "8238321643:AAEV7kBinohHb-RSLah7VSBJ2XSsXTQUpW4"
ADMIN_CHAT_ID = os.environ.get('TELEGRAM_ADMIN_CHAT_ID', '')

# reCAPTCHA v3: минимальный score (0.0–1.0), ниже — считаем ботом
RECAPTCHA_MIN_SCORE = 0.3


def _verify_recaptcha(token: str, secret: str) -> bool:
    """Проверка токена reCAPTCHA v3 у Google. Возвращает True если успех и score >= RECAPTCHA_MIN_SCORE."""
    if not token or not secret:
        return False
    try:
        data = urllib.parse.urlencode({'secret': secret, 'response': token}).encode()
        req = urllib.request.Request(
            'https://www.google.com/recaptcha/api/siteverify',
            data=data,
            method='POST',
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
        if not result.get('success'):
            return False
        return float(result.get('score', 0)) >= RECAPTCHA_MIN_SCORE
    except Exception:
        return False


def _parse_body(event: Dict[str, Any]) -> Dict[str, Any]:
    body = event.get('body') or '{}'
    if isinstance(body, dict):
        return body
    if event.get('isBase64Encoded') and isinstance(body, str):
        import base64
        try:
            body = base64.b64decode(body).decode('utf-8')
        except Exception:
            pass
    try:
        return json.loads(body) if body else {}
    except json.JSONDecodeError:
        return {}


def get_seats_remaining(course: str) -> dict:
    '''Подсчет оставшихся мест на основе даты пробного занятия'''
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if course == 'acting':
            cur.execute("SELECT trial_date FROM content WHERE id = 1")
            max_seats = 12
        elif course == 'oratory':
            cur.execute("SELECT oratory_trial_date as trial_date FROM content WHERE id = 1")
            max_seats = 10
        else:
            return None
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if not result or not result.get('trial_date'):
            return None
        
        trial_date = result['trial_date']
        if isinstance(trial_date, str):
            trial_date = datetime.fromisoformat(trial_date.replace('Z', '+00:00'))
        
        now = datetime.now()
        total_days = 30
        min_seats = 2
        days_until_trial = max(0, (trial_date - now).days)
        
        if days_until_trial <= 0:
            seats = min_seats
        else:
            progress = max(0, min(1, 1 - (days_until_trial / total_days)))
            seats = max(min_seats, round(max_seats - (progress * (max_seats - min_seats))))
        
        if seats <= 3:
            emoji = '🔥'
        elif seats <= 5:
            emoji = '⚠️'
        else:
            emoji = '✅'
        
        return {'seats': seats, 'emoji': emoji}
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage leads from contact forms
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with leads data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute("SELECT * FROM leads ORDER BY created_at DESC")
            leads = cur.fetchall()
            result = [dict(row) for row in leads]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'POST':
            body_data = _parse_body(event)
            recaptcha_secret = os.environ.get('RECAPTCHA_SECRET_KEY', '')
            recaptcha_token = (body_data.get('recaptcha_token') or '').strip()
            # Проверяем капчу только если токен передан (форма с сайта). Заявки без токена (Telegram-бот и т.п.) пропускаем.
            if recaptcha_secret and recaptcha_token:
                if not _verify_recaptcha(recaptcha_token, recaptcha_secret):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Проверка не пройдена. Обновите страницу и попробуйте снова.'})
                    }

            name = body_data.get('name')
            phone = body_data.get('phone')
            source = body_data.get('source', 'website')
            course = body_data.get('course')
            
            utm = body_data.get('utm', {})
            utm_source = utm.get('utm_source')
            utm_medium = utm.get('utm_medium')
            utm_campaign = utm.get('utm_campaign')
            utm_content = utm.get('utm_content')
            utm_term = utm.get('utm_term')
            yclid = utm.get('yclid')
            gclid = utm.get('gclid')
            ym_client_id = body_data.get('ym_client_id')
            
            if not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Phone is required'})
                }
            
            cur.execute(
                """INSERT INTO leads (name, phone, source, course, status, 
                   utm_source, utm_medium, utm_campaign, utm_content, utm_term, 
                   yclid, gclid, ym_client_id) 
                   VALUES (%s, %s, %s, %s, 'new', %s, %s, %s, %s, %s, %s, %s, %s) 
                   RETURNING *""",
                (name, phone, source, course, utm_source, utm_medium, utm_campaign, 
                 utm_content, utm_term, yclid, gclid, ym_client_id)
            )
            lead = cur.fetchone()
            conn.commit()
            
            if ADMIN_CHAT_ID:
                try:
                    message_id = send_telegram_notification(dict(lead))
                    if message_id:
                        cur.execute(
                            "UPDATE leads SET message_id = %s WHERE id = %s",
                            (message_id, lead['id'])
                        )
                        conn.commit()
                except Exception as e:
                    print(f"Failed to send telegram notification: {e}")
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(lead), default=str)
            }
        
        elif method == 'PUT':
            body_data = _parse_body(event)
            lead_id = body_data.get('id')
            status = body_data.get('status')
            
            if not lead_id or not status:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID and status are required'})
                }
            
            cur.execute("SELECT * FROM leads WHERE id = %s", (lead_id,))
            old_lead = cur.fetchone()
            old_status = old_lead['status'] if old_lead else None
            
            cur.execute(
                "UPDATE leads SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
                (status, lead_id)
            )
            lead = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            if lead:
                if ADMIN_CHAT_ID and lead.get('message_id'):
                    try:
                        update_telegram_message(dict(lead))
                    except Exception as e:
                        print(f"Failed to update telegram message: {e}")
                
                if old_status != status:
                    # client_id: с сайта — ym_client_id; только из Telegram — виртуальный telegram_{id}
                    client_id = lead.get('ym_client_id') or f"telegram_{lead['id']}"
                    goal_map = {
                        'called_target': 'called_target',
                        'trial_scheduled': 'trial_scheduled',
                        'trial_completed': 'trial_completed',
                        'enrolled': 'enrolled',
                        'paid': 'payment_completed'
                    }
                    
                    if status in goal_map:
                        def _send_metrika():
                            try:
                                send_metrika_goal(
                                    goal=goal_map[status],
                                    client_id=client_id,
                                    lead_id=lead['id'],
                                    params={
                                        'status': status,
                                        'source': lead.get('source', 'unknown'),
                                        'course': lead.get('course', 'unknown'),
                                        'phone': lead.get('phone', '')
                                    }
                                )
                                print(f"Metrika goal sent: {goal_map[status]} for lead {lead['id']}")
                            except Exception as e:
                                print(f"Failed to send metrika goal: {e}")
                        import threading
                        threading.Thread(target=_send_metrika, daemon=True).start()

                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(lead), default=str)
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Lead not found'})
                }
        
        cur.close()
        conn.close()
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def send_telegram_notification(lead: dict):
    '''Отправка уведомления в Telegram о новой заявке'''
    from datetime import datetime
    
    created_at = lead.get('created_at')
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
    
    months_ru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    
    formatted_date = f"{created_at.day} {months_ru[created_at.month - 1]} {created_at.year} года в {created_at.strftime('%H:%M')}"
    
    course_emoji = '🎭' if lead.get('course') == 'acting' else '🎤' if lead.get('course') == 'oratory' else '❓'
    course_name = 'Актёрское мастерство' if lead.get('course') == 'acting' else 'Ораторское искусство' if lead.get('course') == 'oratory' else 'Не указан'
    
    name_line = f"👤 <b>Имя:</b> {lead.get('name')}\n" if lead.get('name') else ""
    
    seats_info = get_seats_remaining(lead.get('course'))
    seats_line = f"\n🪑 <b>Осталось мест:</b> {seats_info['seats']} {seats_info['emoji']}" if seats_info else ""
    
    message = (
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"🔔 <b>НОВАЯ ЗАЯВКА</b>\n"
        f"━━━━━━━━━━━━━━━━━━━\n\n"
        f"{name_line}"
        f"📞 <b>Телефон:</b> <code>{lead.get('phone')}</code>\n"
        f"{course_emoji} <b>Курс:</b> {course_name}\n"
        f"📅 <b>Дата:</b> {formatted_date}{seats_line}\n\n"
        f"━━━━━━━━━━━━━━━━━━━"
    )
    
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    data = json.dumps({
        'chat_id': ADMIN_CHAT_ID,
        'text': message,
        'parse_mode': 'HTML',
        'reply_markup': {
            'inline_keyboard': [[
                {'text': '📞 Дозвонились, целевой', 'callback_data': f'status_{lead.get("id")}_called_target'},
                {'text': '✅ Записался на пробное', 'callback_data': f'status_{lead.get("id")}_trial'}
            ], [
                {'text': '🤔 Думает', 'callback_data': f'status_{lead.get("id")}_thinking'},
                {'text': '❌ Нецелевой', 'callback_data': f'status_{lead.get("id")}_irrelevant'}
            ]]
        }
    }).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        return result.get('result', {}).get('message_id')

def update_telegram_message(lead: dict):
    '''Обновление сообщения в Telegram при смене статуса в админке'''
    from datetime import datetime
    
    created_at = lead.get('created_at')
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
    
    months_ru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    
    formatted_date = f"{created_at.day} {months_ru[created_at.month - 1]} {created_at.year} года в {created_at.strftime('%H:%M')}"
    
    course_emoji = '🎭' if lead.get('course') == 'acting' else '🎤' if lead.get('course') == 'oratory' else '❓'
    course_name = 'Актёрское мастерство' if lead.get('course') == 'acting' else 'Ораторское искусство' if lead.get('course') == 'oratory' else 'Не указан'
    
    status = lead.get('status', 'new')
    status_names = {
        'new': 'Новая заявка',
        'called_target': 'Дозвонились, целевой',
        'trial': 'Записался на пробное',
        'trial_scheduled': 'Записался на пробное',
        'trial_completed': 'Прошёл пробное',
        'enrolled': 'Записался на обучение',
        'paid': 'Оплатил',
        'thinking': 'Думает',
        'irrelevant': 'Нецелевой'
    }
    
    status_emojis = {
        'new': '🔔',
        'called_target': '📞',
        'trial': '✅',
        'trial_scheduled': '✅',
        'trial_completed': '✅',
        'enrolled': '🎓',
        'paid': '💰',
        'thinking': '🤔',
        'irrelevant': '❌'
    }
    
    name_line = f"👤 <b>Имя:</b> {lead.get('name')}\n" if lead.get('name') else ""
    
    message = (
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"{status_emojis.get(status, '🔔')} <b>{status_names.get(status, 'ЗАЯВКА').upper()}</b>\n"
        f"━━━━━━━━━━━━━━━━━━━\n\n"
        f"{name_line}"
        f"📞 <b>Телефон:</b> <code>{lead.get('phone')}</code>\n"
        f"{course_emoji} <b>Курс:</b> {course_name}\n"
        f"📅 <b>Дата:</b> {formatted_date}\n\n"
        f"━━━━━━━━━━━━━━━━━━━"
    )
    
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/editMessageText'
    data = json.dumps({
        'chat_id': ADMIN_CHAT_ID,
        'message_id': lead.get('message_id'),
        'text': message,
        'parse_mode': 'HTML'
    }).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def send_metrika_goal(goal: str, client_id: str, lead_id: int, params: dict = None):
    '''Отправка офлайн-конверсии в Яндекс.Метрику по официальному API (CSV upload).'''
    metrika_conversion_url = 'https://functions.yandexcloud.net/d4e1l3lvret5b8ora95c'
    params = params or {}
    payload = {
        'goal': goal,
        'client_id': client_id,
        'lead_id': lead_id,
        'phone': params.get('phone', ''),
        'course': params.get('course', ''),
        **params
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        metrika_conversion_url,
        data=data,
        method='POST',
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode('utf-8'))