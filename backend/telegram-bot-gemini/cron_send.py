"""
Вызов по таймеру (cron): бот отправляет одно сообщение в заданный чат/канал.
В Yandex Cloud создайте триггер по расписанию (cron), который вызывает эту функцию.
Переменные окружения: TELEGRAM_BOT_TOKEN_GEMINI (или TELEGRAM_BOT_TOKEN), TELEGRAM_CRON_CHAT_ID, TELEGRAM_CRON_MESSAGE (текст), опционально TELEGRAM_PROXY_URL.
"""
import os
import json
import requests
from typing import Any, Dict


def _send(token: str, chat_id: str, text: str, proxy_url: str = None) -> None:
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
    requests.post(
        url,
        json={"chat_id": chat_id.strip(), "text": text, "parse_mode": "HTML"},
        proxies=proxies,
        timeout=15,
    )


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    token = os.environ.get("TELEGRAM_BOT_TOKEN_GEMINI") or os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CRON_CHAT_ID", "").strip()
    message = os.environ.get("TELEGRAM_CRON_MESSAGE", "Напоминание от бота 👋")
    proxy_url = os.environ.get("TELEGRAM_PROXY_URL")

    if not token or not chat_id:
        return {
            "statusCode": 200,
            "body": json.dumps({"ok": False, "error": "TELEGRAM_BOT_TOKEN and TELEGRAM_CRON_CHAT_ID required"}),
        }
    try:
        _send(token, chat_id, message, proxy_url)
        return {"statusCode": 200, "body": json.dumps({"ok": True})}
    except Exception as e:
        return {"statusCode": 200, "body": json.dumps({"ok": False, "error": str(e)})}
