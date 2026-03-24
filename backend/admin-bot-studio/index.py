"""
Облачная функция: чат с Gemini для конструктора ботов в админке.
POST JSON: { "messages": [{"role":"user"|"model","content":"..."}], "system_instruction": "..." }
"""
import json
import os
import re
from typing import Dict, Any, List

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
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": "GEMINI_API_KEY не задан", "reply": ""}),
        }

    try:
        body = json.loads(event.get("body") or "{}")
        messages: List[Dict[str, str]] = body.get("messages") or []
        system_instruction = (body.get("system_instruction") or "").strip()
    except Exception:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "bad json", "reply": ""})}

    if not messages:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "messages required", "reply": ""})}

    contents = []
    for m in messages[-20:]:
        role = m.get("role", "user")
        text = (m.get("content") or "").strip()
        if not text:
            continue
        gemini_role = "model" if role in ("model", "assistant") else "user"
        contents.append({"role": gemini_role, "parts": [{"text": text}]})

    if not contents:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "no text", "reply": ""})}

    # Gemini ожидает, что первое сообщение — от user
    if contents[0]["role"] != "user":
        contents.insert(0, {"role": "user", "parts": [{"text": "Начало сессии конструктора чат-ботов."}]})

    payload: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 4096},
    }
    if system_instruction:
        payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

    try:
        proxies = _get_proxies()
        resp = requests.post(
            f"{GEMINI_URL}?key={gemini_key}",
            json=payload,
            proxies=proxies,
            timeout=60,
        )
        data = resp.json()
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"reply": reply})}
    except Exception as e:
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"reply": "", "error": str(e)}),
        }
