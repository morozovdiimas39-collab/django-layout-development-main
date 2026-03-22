"""
Облачная функция: AI-анализ заметки менеджера CRM.
Принимает текст заметки → возвращает JSON с предложением создать задачу или сменить статус.
"""
import json
import os
from datetime import datetime, timezone
from typing import Dict, Any

import re
import requests

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


def _get_proxies() -> dict | None:
    raw = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or ""
    proxy_url = raw.strip().strip('"').strip("'")
    if not proxy_url:
        return None
    if "://" not in proxy_url:
        proxy_url = "https://" + proxy_url.lstrip("/")
    if not re.match(r"^https?://\S+", proxy_url):
        return None
    return {"https": proxy_url, "http": proxy_url}

STATUSES = {
    "new": "Новый",
    "thinking": "Думает",
    "trial": "На пробное",
    "enrolled": "Записался",
    "called_target": "Целевой",
    "irrelevant": "Нецелевой",
}


def make_prompt(note: str, today: str) -> str:
    return f"""Ты — ассистент менеджера CRM. Проанализируй заметку и верни JSON.

Статусы воронки:
- "new" — новый лид
- "thinking" — думает / не решил
- "trial" — договорились на пробное занятие
- "enrolled" — записался / оплатил курс
- "called_target" — целевой, но пока не записался
- "irrelevant" — нецелевой

Правила:
1. Если упоминается дата/время для звонка, встречи, напоминания — action: "create_task", заполни task.deadline в ISO 8601 (год {datetime.now(timezone.utc).year} если не указан, время 10:00 если не указано).
2. Если ясно что клиент записался / оплатил / подтвердил участие — action: "change_status", status: "enrolled".
3. Если клиент согласился на пробное — action: "change_status", status: "trial".
4. Если клиент думает / перезвонит сам / взял паузу — action: "change_status", status: "thinking".
5. Если оба условия — action: "both", заполни и task, и status.
6. Иначе — action: "none".

Текущая дата: {today}.

Заметка: "{note}"

Верни ТОЛЬКО валидный JSON без markdown:
{{
  "action": "...",
  "task": {{"text": "...", "deadline": "..."}},
  "status": "...",
  "summary": "..."
}}"""


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        return {"statusCode": 500, "headers": headers,
                "body": json.dumps({"action": "none", "summary": "GEMINI_API_KEY не задан"})}

    try:
        body = json.loads(event.get("body") or "{}")
        note = (body.get("note") or "").strip()
    except Exception:
        return {"statusCode": 400, "headers": headers,
                "body": json.dumps({"action": "none"})}

    if not note:
        return {"statusCode": 200, "headers": headers,
                "body": json.dumps({"action": "none"})}

    today = datetime.now(timezone.utc).strftime("%-d %B %Y")
    prompt = make_prompt(note, today)

    try:
        proxies = _get_proxies()
        resp = requests.post(
            f"{GEMINI_URL}?key={gemini_key}",
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2, "maxOutputTokens": 512},
            },
            proxies=proxies,
            timeout=15,
        )
        raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        clean = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)
        return {"statusCode": 200, "headers": headers, "body": json.dumps(result)}
    except Exception as e:
        return {"statusCode": 200, "headers": headers,
                "body": json.dumps({"action": "none", "summary": f"Ошибка: {e}"})}
