"""
Облачная функция: тексты Telegram-ботов — что отправить пользователю после /start.

Переменные: DATABASE_URL
Заголовок X-Auth-Token обязателен для всех методов.

GET    — список записей (name + start_message + order)
POST   — создать: { name?, start_message?, order_num? }
PUT    — обновить: { id, name?, start_message?, order_num? }
DELETE — ?id= или body { id }
"""
import json
import os
from typing import Any, Dict, Optional

import psycopg2
from psycopg2.extras import RealDictCursor


def _parse_body(event: Dict[str, Any]) -> Dict[str, Any]:
    body = event.get("body") or "{}"
    if isinstance(body, dict):
        return body
    if event.get("isBase64Encoded") and isinstance(body, str):
        import base64

        try:
            body = base64.b64decode(body).decode("utf-8")
        except Exception:
            pass
    try:
        return json.loads(body) if body else {}
    except json.JSONDecodeError:
        return {}


def _auth_token(event: Dict[str, Any]) -> Optional[str]:
    headers = event.get("headers") or {}
    if not isinstance(headers, dict):
        return None
    t = headers.get("X-Auth-Token") or headers.get("x-auth-token")
    if t:
        return str(t)
    for k, v in headers.items():
        if k and str(k).lower() == "x-auth-token" and v:
            return str(v)
    return None


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = (event.get("httpMethod") or "GET").upper()
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
        "Access-Control-Max-Age": "86400",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    token = _auth_token(event)
    if not token:
        return {
            "statusCode": 401,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Authorization required"}),
        }

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SET search_path TO public, t_p90119217_django_layout_develo")

        json_headers = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}

        if method == "GET":
            cur.execute("SELECT * FROM chat_bots ORDER BY order_num, id")
            rows = [dict(r) for r in cur.fetchall()]
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": json_headers, "body": json.dumps(rows, default=str)}

        if method == "POST":
            body = _parse_body(event)
            name = (body.get("name") or "Бот").strip() or "Бот"
            start_message = body.get("start_message") or ""
            order_num = body.get("order_num")
            if order_num is None:
                cur.execute("SELECT COALESCE(MAX(order_num), -1) + 1 AS n FROM chat_bots")
                order_num = cur.fetchone()["n"]
            cur.execute(
                """
                INSERT INTO chat_bots (name, start_message, order_num)
                VALUES (%s, %s, %s)
                RETURNING *
                """,
                (name, start_message, int(order_num)),
            )
            row = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 201, "headers": json_headers, "body": json.dumps(dict(row), default=str)}

        if method == "PUT":
            body = _parse_body(event)
            raw_id = body.get("id")
            if raw_id is None:
                cur.close()
                conn.close()
                return {
                    "statusCode": 400,
                    "headers": json_headers,
                    "body": json.dumps({"error": "id is required"}),
                }
            try:
                item_id = int(raw_id)
            except (TypeError, ValueError):
                cur.close()
                conn.close()
                return {
                    "statusCode": 400,
                    "headers": json_headers,
                    "body": json.dumps({"error": "id must be a number"}),
                }
            cur.execute(
                """
                UPDATE chat_bots SET
                    name = %s,
                    start_message = %s,
                    order_num = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
                """,
                (
                    (body.get("name") or "Бот").strip() or "Бот",
                    body.get("start_message") or "",
                    int(body.get("order_num") or 0),
                    item_id,
                ),
            )
            row = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            if not row:
                return {"statusCode": 404, "headers": json_headers, "body": json.dumps({"error": "Not found"})}
            return {"statusCode": 200, "headers": json_headers, "body": json.dumps(dict(row), default=str)}

        if method == "DELETE":
            params = event.get("queryStringParameters") or {}
            body = _parse_body(event)
            raw_id = body.get("id") or (params.get("id") if isinstance(params, dict) else None)
            if raw_id is None:
                cur.close()
                conn.close()
                return {
                    "statusCode": 400,
                    "headers": json_headers,
                    "body": json.dumps({"error": "id is required"}),
                }
            try:
                item_id = int(raw_id)
            except (TypeError, ValueError):
                cur.close()
                conn.close()
                return {
                    "statusCode": 400,
                    "headers": json_headers,
                    "body": json.dumps({"error": "id must be a number"}),
                }
            cur.execute("DELETE FROM chat_bots WHERE id = %s RETURNING id", (item_id,))
            deleted = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            if not deleted:
                return {"statusCode": 404, "headers": json_headers, "body": json.dumps({"error": "Not found"})}
            return {"statusCode": 200, "headers": json_headers, "body": json.dumps({"success": True, "id": item_id})}

        cur.close()
        conn.close()
        return {"statusCode": 405, "headers": json_headers, "body": json.dumps({"error": "Method not allowed"})}

    except Exception as e:
        try:
            if "cur" in locals() and cur:
                cur.close()
        except Exception:
            pass
        try:
            if "conn" in locals() and conn:
                conn.close()
        except Exception:
            pass
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)}),
        }
