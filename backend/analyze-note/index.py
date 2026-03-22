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
    year = datetime.now(timezone.utc).year
    return f"""Ты — ассистент менеджера CRM школы актёрского и ораторского мастерства.
Менеджер написал заметку о клиенте. Твоя задача — распознать намерение и вернуть JSON.

Текущая дата: {today}, год {year}.

СТАТУСЫ ВОРОНКИ (используй только эти значения):
- "new" — новый необработанный лид
- "thinking" — клиент думает, сомневается, попросил время
- "trial" — договорились о пробном занятии
- "enrolled" — клиент записался, оплатил, подтвердил участие
- "called_target" — целевой клиент, интерес есть, но не записался
- "irrelevant" — нецелевой, не интересно, не та аудитория

ПРАВИЛА ОПРЕДЕЛЕНИЯ action:
- Есть конкретная дата/время/срок для звонка/напоминания → action: "create_task"
- Ясно что статус клиента изменился → action: "change_status"  
- И то и другое → action: "both"
- Просто информация, нет явных действий → action: "none"

ПРИМЕРЫ:
- "попросил перезвонить 16 ноября" → create_task, deadline: "{year}-11-16T10:00:00"
- "записался на курс" → change_status, status: "enrolled"
- "думает, перезвонит через неделю" → change_status, status: "thinking"
- "договорились на пробное в пятницу" → both, status: "trial" + task с датой пятницы
- "не берёт трубку" → action: "none"
- "нецелевой, не то" → change_status, status: "irrelevant"

Заметка менеджера: "{note}"

Верни ТОЛЬКО валидный JSON, без markdown, без пояснений:
{{
  "action": "none|create_task|change_status|both",
  "task": {{"text": "краткое название задачи", "deadline": "ISO 8601 дата"}},
  "status": "статус из списка выше",
  "summary": "одно предложение — что ты понял из заметки"
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
        print(f"[analyze-note] Gemini raw: {raw}")
        clean = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)
        print(f"[analyze-note] result: {result}")
        return {"statusCode": 200, "headers": headers, "body": json.dumps(result)}
    except Exception as e:
        return {"statusCode": 200, "headers": headers,
                "body": json.dumps({"action": "none", "summary": f"Ошибка: {e}"})}
