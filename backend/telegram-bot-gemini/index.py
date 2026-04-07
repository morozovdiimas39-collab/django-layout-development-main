"""
Telegram-бот для автоматической переписки с клиентами через Gemini 2.5 Flash.
Только диалог: входящее сообщение → ответ от Gemini → отправка в чат.
Деплой в Yandex Cloud Functions, webhook на этот handler.
"""
import json
import os
import random
import time
import threading
from typing import Optional

import requests

# Модель для чата (Google AI)
GEMINI_MODEL = "gemini-2.5-flash"

# Ораторский курс. «Вы». Пробное 14 марта. Отрабатывать возражения, убеждать записаться. Адрес — красиво, как добраться.
SYSTEM_INSTRUCTION = """Ты — бот школы Казбека Меретукова. Курс ораторского «Я говорю, меня слышат». Обращение только на «вы». Всё в этом чате.

ЗАПИСЬ НА ПРОБНОЕ — ЗАПРАШИВАТЬ ТЕЛЕФОН:
Если человек согласился записаться («да», «давай», «запишите», «ок», «хорошо», «давайте» и т.п.) — сразу запросите номер телефона для записи. Напиши что-то вроде: «Отлично! Для записи нужен ваш номер телефона — напишите, пожалуйста, и мы зафиксируем вас на пробное 14 марта.» Без приветствия («Приветствуем», «Здравствуйте») в этом сообщении — только просьба указать телефон.

ОТРАБОТКА ВОЗРАЖЕНИЙ — ОБЯЗАТЕЛЬНО:
Если человек пишет «не хочу», «не интересно», «подумаю», «не сейчас», «спасибо, не надо» — не прощайся и не заканчивай диалог. Мягко отрабатывай: напомни, что пробное бесплатно и ни к чему не обязывает; спроси, что смущает; предложи записать «на всякий случай». Убеждай записаться, не сдавайся после первого отказа.

ПРАВИЛО НА ВОПРОС — ОТВЕЧАТЬ ИМЕННО НА НЕГО:
«Где?» — ответ про адрес и как добраться (см. АДРЕС ниже). «Когда?» — 14 марта. «Сколько?» — не называй цену, «подробности на пробном». Запрещено в ответ писать «Здравствуйте», «Мы приглашаем…» вместо ответа. Без приветствия в каждом сообщении (только по /start).

ЗАПРЕТ:
Не отсылать на сайт, не говорить «менеджер подскажет» вместо ответа. Никогда не приветствовать повторно: ни в одном сообщении после первого не писать «Приветствуем», «Здравствуйте», «Привет» и т.п. — отвечать сразу по делу. Никогда не писать, что ты бот («Это бот», «Я бот», «мы бот» и т.п.) — отвечай как представитель школы, без упоминания бота.

СТИЛЬ:
Тёплый язык, смайлики (2–5): 🎤 ✨ 💬 🌟 👋 🎯 💪 🔥. Коротко. «Вы».

ФАКТЫ:
Курс «Я говорю, меня слышат», педагог Ольга Штерц (Щепкинское, ГИТИС, Бродвей). Программа: Станиславский, дыхание и голос, 6 модулей. Пробное — 14 марта, бесплатно.

АДРЕС (отвечать красиво, с «как добраться»):
Занятия проходят в Москве, ул. Каланчевская, 17, стр. 1. Район удобный: в шаговой доступности три вокзала — Казанский, Ленинградский, Ярославский, станция метро «Каланчевская». Как добраться: от м. «Красные Ворота» пешком около 8 минут; от м. «Каланчевская» — примерно 4 минуты; от м. «Комсомольская» — около 7 минут. Здание в центре, легко найти.

В конце: есть ещё вопросы или записать на пробное?"""


def _call_gemini(
    user_text: str,
    api_key: str,
    proxy_url: Optional[str] = None,
    history: Optional[list] = None,
) -> str:
    """Запрос к Gemini 2.5 Flash: один ответ на текст пользователя (с опциональной историей)."""
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
        f"?key={api_key}"
    )
    contents = []
    if history:
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg.get("text", "")}]})
    contents.append({"role": "user", "parts": [{"text": user_text}]})

    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "generationConfig": {
            "maxOutputTokens": 1024,
            "temperature": 0.7,
        },
    }
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    try:
        r = requests.post(url, json=payload, proxies=proxies, timeout=30)
        if r.status_code != 200:
            print(f"Gemini API error: status={r.status_code}, body={r.text[:500]}")
            return "Сейчас не могу ответить. Оставьте заявку на сайте — мы перезвоним."
        data = r.json()
        candidates = data.get("candidates") or []
        if not candidates:
            print(f"Gemini no candidates. Response: {json.dumps(data)[:500]}")
            return "Сейчас не могу ответить. Оставьте заявку на сайте."
        parts = candidates[0].get("content", {}).get("parts") or []
        if not parts:
            print(f"Gemini no parts in candidate: {candidates[0]}")
            return "Сейчас не могу ответить. Оставьте заявку на сайте."
        return (parts[0].get("text") or "").strip()
    except requests.exceptions.ProxyError as e:
        print(f"Gemini proxy error: {e}")
        return "Сейчас не могу ответить. Оставьте заявку на сайте — мы перезвоним."
    except requests.exceptions.Timeout as e:
        print(f"Gemini timeout: {e}")
        return "Сейчас не могу ответить. Оставьте заявку на сайте — мы перезвоним."
    except Exception as e:
        print(f"Gemini error: {e}")
        import traceback
        traceback.print_exc()
        return "Сейчас не могу ответить. Оставьте заявку на сайте — мы перезвоним."


def _send_typing(
    token: str,
    chat_id: int,
    proxy_url: Optional[str] = None,
) -> None:
    """Показывает у пользователя «печатает…». Действует ~5 сек, потом нужно отправить снова."""
    url = f"https://api.telegram.org/bot{token}/sendChatAction"
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    try:
        requests.post(
            url,
            json={"chat_id": chat_id, "action": "typing"},
            proxies=proxies,
            timeout=5,
        )
    except Exception:
        pass


def _send_telegram(
    token: str,
    chat_id: int,
    text: str,
    proxy_url: Optional[str] = None,
) -> None:
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    requests.post(
        url,
        json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
        proxies=proxies,
        timeout=10,
    )


def _send_telegram_photo(
    token: str,
    chat_id: int,
    photo: str,
    caption: str,
    proxy_url: Optional[str] = None,
) -> None:
    """Отправка фото с подписью. photo — URL или file_id."""
    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    payload = {"chat_id": chat_id, "caption": caption, "parse_mode": "HTML"}
    if photo.startswith(("http://", "https://")):
        payload["photo"] = photo
    else:
        payload["photo"] = photo  # file_id
    try:
        requests.post(url, json=payload, proxies=proxies, timeout=15)
    except Exception as e:
        print(f"sendPhoto error: {e}")


def _send_telegram_video(
    token: str,
    chat_id: int,
    video: str,
    caption: str,
    proxy_url: Optional[str] = None,
) -> None:
    """Отправка видео с подписью. video — URL или file_id."""
    url = f"https://api.telegram.org/bot{token}/sendVideo"
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    payload = {"chat_id": chat_id, "caption": caption, "parse_mode": "HTML"}
    if video.startswith(("http://", "https://")):
        payload["video"] = video
    else:
        payload["video"] = video  # file_id
    try:
        requests.post(url, json=payload, proxies=proxies, timeout=30)
    except Exception as e:
        print(f"sendVideo error: {e}")


def _user_label(message: dict) -> str:
    """Короткая подпись пользователя для лога в админ-чат."""
    from_user = message.get("from") or {}
    first = (from_user.get("first_name") or "").strip()
    last = (from_user.get("last_name") or "").strip()
    username = from_user.get("username")
    uid = from_user.get("id", message.get("chat", {}).get("id"))
    name = f"{first} {last}".strip() or username or f"id{uid}"
    if username:
        name = f"{name} (@{username})" if name != username else f"@{username}"
    return name


def _forward_to_admin(
    token: str,
    admin_chat_id: str,
    chat_id: int,
    user_label: str,
    user_text: str,
    bot_reply: str,
    proxy_url: Optional[str] = None,
) -> None:
    """Дублирует переписку в админ-чат: кто написал, что написал, что ответил бот."""
    if not admin_chat_id or not admin_chat_id.strip():
        return
    line = (
        f"👤 <b>{user_label}</b> (chat_id {chat_id}):\n"
        f"{user_text or '(не текст)'}\n\n"
        f"🤖 <b>Бот:</b>\n{bot_reply}"
    )
    _send_telegram(token, int(admin_chat_id.strip()), line, proxy_url)


def _send_metrika_conversion(
    conversion_url: str,
    client_id: str,
    goal: str = "TELEGRAM_LEAD",
    course: str = "oratory",
    proxy_url: Optional[str] = None,
) -> None:
    """Отправка конверсии в Метрику (офлайн). client_id для Telegram: telegram_<chat_id>."""
    if not conversion_url or not conversion_url.strip():
        return
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    try:
        payload = {
            "client_id": client_id,
            "goal": goal,
            "course": course,
            "phone": "",
        }
        requests.post(
            conversion_url.strip(),
            json=payload,
            headers={"Content-Type": "application/json"},
            proxies=proxies,
            timeout=15,
        )
    except Exception as e:
        print(f"Metrika conversion send error: {e}")


def _parse_body(event: dict) -> dict:
    body = event.get("body") or "{}"
    if isinstance(body, dict):
        return body
    raw = body if isinstance(body, str) else str(body)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        if event.get("isBase64Encoded"):
            try:
                import base64
                return json.loads(base64.b64decode(raw).decode("utf-8"))
            except Exception:
                return {}
        return {}


def handler(event: dict, context) -> dict:
    """
    Webhook Telegram: POST с update. Обрабатываем только message с text.
    Переменные окружения: TELEGRAM_BOT_TOKEN (или TELEGRAM_BOT_TOKEN_GEMINI), GEMINI_API_KEY, опционально TELEGRAM_PROXY_URL.
    """
    method = event.get("httpMethod", "POST")

    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
            "isBase64Encoded": False,
        }

    if method != "POST":
        return {
            "statusCode": 405,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Method not allowed"}),
            "isBase64Encoded": False,
        }

    token = os.environ.get("TELEGRAM_BOT_TOKEN_GEMINI") or os.environ.get("TELEGRAM_BOT_TOKEN")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    proxy_url = os.environ.get("TELEGRAM_PROXY_URL")
    gemini_proxy_url = os.environ.get("GEMINI_PROXY_URL") or proxy_url
    admin_chat_id = os.environ.get("TELEGRAM_GEMINI_ADMIN_CHAT_ID") or os.environ.get("TELEGRAM_ADMIN_CHAT_ID") or ""
    metrika_conversion_url = os.environ.get("METRIKA_CONVERSION_URL") or ""
    metrika_goal_telegram = os.environ.get("METRIKA_GOAL_TELEGRAM") or "TELEGRAM_LEAD"
    start_photo = os.environ.get("TELEGRAM_START_PHOTO_URL") or os.environ.get("TELEGRAM_START_PHOTO_FILE_ID") or ""
    start_video = os.environ.get("TELEGRAM_START_VIDEO_URL") or os.environ.get("TELEGRAM_START_VIDEO_FILE_ID") or ""

    # Если подключено: берём текст ответа после /start из облачной функции `chat-bots`
    # (админка "Боты" редактирует таблицу chat_bots).
    chat_bots_api_url = os.environ.get("CHAT_BOTS_API_URL") or ""
    chat_bots_api_token = os.environ.get("CHAT_BOTS_API_TOKEN") or ""
    chat_bot_active_id_raw = os.environ.get("CHAT_BOT_ACTIVE_ID") or ""

    if not token:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN_GEMINI"}),
            "isBase64Encoded": False,
        }

    if not gemini_key:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Missing GEMINI_API_KEY"}),
            "isBase64Encoded": False,
        }

    try:
        update = _parse_body(event)
        if not isinstance(update, dict):
            update = {}

        message = update.get("message")
        if not message:
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"status": "ok"}),
                "isBase64Encoded": False,
            }

        chat_id = message["chat"]["id"]
        text = (message.get("text") or "").strip()

        start_reply_default = (
            "Здравствуйте! 👋 Рады видеть вас!\n\n"
            "Курс ораторского «Я говорю, меня слышат» — это про то, чтобы вас действительно слышали: сильный голос, уверенность перед любой аудиторией, победа над страхом выступлений. Это выгодно и для карьеры, и для жизни — презентации, переговоры, просто уверенная речь. ✨\n\n"
            "На пробном занятии вы познакомитесь с педагогом и методикой, попробуете упражнения на голос и дыхание, почувствуете атмосферу. Бесплатно и ни к чему не обязывает. 🎤\n\n"
            "Есть вопросы? Или записать вас на пробное? 💬"
        )

        start_reply = start_reply_default

        def _fetch_chat_bots() -> list:
            """
            Получить список ботов из облачной функции `chat-bots`.
            Если функция не подключена/не настроена — вернёт пустой список.
            """
            if not chat_bots_api_url or not chat_bots_api_token:
                return []
            try:
                r = requests.get(
                    chat_bots_api_url,
                    headers={"X-Auth-Token": chat_bots_api_token},
                    timeout=10,
                )
                if r.status_code != 200:
                    return []
                data = r.json()
                return data if isinstance(data, list) else []
            except Exception as e:
                print(f"[chat-bots] fetch failed: {e}")
                return []

        def _get_start_message_from_chat_bots() -> Optional[str]:
            bots = _fetch_chat_bots()
            if not bots:
                return None

            chosen = None
            if chat_bot_active_id_raw:
                try:
                    active_id = int(chat_bot_active_id_raw)
                    for b in bots:
                        try:
                            if int(b.get("id")) == active_id:
                                chosen = b
                                break
                        except Exception:
                            continue
                except ValueError:
                    chosen = None

            # Если конкретный бот не найден — используем первый (функция уже сортирует по order_num, id).
            if chosen is None:
                chosen = bots[0]

            if not isinstance(chosen, dict):
                return None
            return chosen.get("start_message") or chosen.get("system_prompt") or None

        # /start — сразу отправляем ответ (текст или фото/видео с подписью)
        if text == "/start":
            maybe_start_message = _get_start_message_from_chat_bots()
            if maybe_start_message:
                start_reply = maybe_start_message

            if start_photo:
                _send_telegram_photo(token, chat_id, start_photo.strip(), start_reply, proxy_url)
            elif start_video:
                _send_telegram_video(token, chat_id, start_video.strip(), start_reply, proxy_url)
            else:
                _send_telegram(token, chat_id, start_reply, proxy_url)
            _forward_to_admin(
                token, admin_chat_id, chat_id, _user_label(message), text, start_reply, proxy_url
            )
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"status": "ok"}),
                "isBase64Encoded": False,
            }

        if not text:
            no_text_reply = "Напишите текстом — отвечу на вопросы о курсах и записи."
            _send_telegram(token, chat_id, no_text_reply, proxy_url)
            _forward_to_admin(
                token, admin_chat_id, chat_id, _user_label(message), "(не текст)", no_text_reply, proxy_url
            )
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"status": "ok"}),
                "isBase64Encoded": False,
            }

        # Показываем «печатает» и держим статус пока ждём ответ от Gemini
        _send_typing(token, chat_id, proxy_url)
        reply_result = [None]  # list чтобы closure мог записать

        def _run_gemini():
            reply_result[0] = _call_gemini(text, gemini_key, gemini_proxy_url, history=None)

        th = threading.Thread(target=_run_gemini)
        th.start()
        while th.is_alive():
            time.sleep(4)
            if th.is_alive():
                _send_typing(token, chat_id, proxy_url)
        reply = reply_result[0] or "Сейчас не могу ответить. Напишите, пожалуйста, ещё раз."

        # Небольшая задержка перед отправкой (реалистично «набирает»)
        time.sleep(random.uniform(0.5, 1.5))
        _send_telegram(token, chat_id, reply, proxy_url)
        _forward_to_admin(
            token, admin_chat_id, chat_id, _user_label(message), text, reply, proxy_url
        )

        # Метрика: при намерении записаться отправляем офлайн-конверсию (client_id = telegram_<chat_id>)
        intent_words = ("хочу", "записаться", "запиши", "перезвони", "оставь заявку", "записать", "пробное")
        if metrika_conversion_url and any(w in text.lower() for w in intent_words):
            _send_metrika_conversion(
                metrika_conversion_url,
                f"telegram_{chat_id}",
                goal=metrika_goal_telegram,
                course="oratory",
                proxy_url=proxy_url,
            )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"status": "ok"}),
            "isBase64Encoded": False,
        }

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)}),
            "isBase64Encoded": False,
        }
