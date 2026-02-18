"""
Облачная функция: автопубликация статей в блог 5 раз в день.
Вызывается по cron. Генерирует статью через Gemini и добавляет в blog_posts.
"""
import json
import os
import re
import random
from typing import Dict, Any

import psycopg2
import requests

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

TOPICS = [
    "актёрское мастерство для начинающих",
    "ораторское искусство и публичные выступления",
    "как победить страх сцены",
    "работа с камерой для актёров",
    "импровизация в жизни и на сцене",
    "сценическая речь и голос",
    "создание персонажа в актёрском мастерстве",
    "методы Станиславского в современном театре",
    "подготовка к кастингу",
    "уверенность в публичных выступлениях",
    "эмоции и работа с ними в актёрском мастерстве",
    "ораторское искусство для бизнеса",
]


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:200] or "post"


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


def generate_article(gemini_key: str, topic: str) -> dict:
    prompt = f"""Напиши статью для блога школы актёрского и ораторского мастерства Казбека Меретукова.
Тема: {topic}

Верни ТОЛЬКО валидный JSON без markdown, без пояснений:
{{
  "title": "Заголовок статьи (до 80 символов)",
  "excerpt": "Краткое описание 1-2 предложения для превью (до 200 символов)",
  "content": "Основной текст статьи в HTML: параграфы в <p>, заголовки в <h2>, списки в <ul><li>"
}}"""
    proxies = _get_proxies()
    resp = requests.post(
        f"{GEMINI_URL}?key={gemini_key}",
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.8, "maxOutputTokens": 4096},
        },
        proxies=proxies,
        timeout=60,
    )
    if resp.status_code != 200:
        raise Exception(f"Gemini API error: {resp.status_code} {resp.text[:300]}")

    data = resp.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise Exception("Gemini returned no candidates")

    text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    text = text.strip().removeprefix("```json").removeprefix("```").rstrip("```").strip()
    return json.loads(text)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    print("[auto-blog] start")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    db_url = os.environ.get("DATABASE_URL")
    site_url = os.environ.get("SITE_URL", "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai")

    if not gemini_key or not db_url:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "GEMINI_API_KEY and DATABASE_URL required"}),
        }

    topic = random.choice(TOPICS)
    print(f"[auto-blog] calling Gemini, topic={topic[:30]}...")
    try:
        article = generate_article(gemini_key, topic)
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }

    title = article.get("title", "Статья")[:255]
    excerpt = (article.get("excerpt") or "")[:500]
    content = article.get("content", "")
    slug = slugify(title)
    image_url = f"{site_url}/images/b34e4f5d-452d-44bb-bedb-a00378237a0c.jpg"

    print("[auto-blog] inserting into DB")
    post_id = None
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        schema = (os.environ.get("DB_SCHEMA") or "public").strip()
        if not schema or not re.match(r"^[a-zA-Z0-9_]+$", schema):
            schema = "public"
        tbl = f'"{schema}".blog_posts'
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS {tbl} (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                image_url VARCHAR(500),
                published BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        for attempt in range(5):
            try_slug = f"{slug}-{attempt}" if attempt else slug
            try:
                cur.execute(
                    f"""INSERT INTO {tbl} (title, slug, content, excerpt, image_url, published)
                       VALUES (%s, %s, %s, %s, %s, true) RETURNING id""",
                    (title, try_slug, content, excerpt, image_url),
                )
                row = cur.fetchone()
                conn.commit()
                if row:
                    post_id = row[0]
                    slug = try_slug
                    break
            except psycopg2.IntegrityError as ie:
                conn.rollback()
                if "unique" in str(ie).lower() or "duplicate" in str(ie).lower():
                    continue
                raise
        else:
            raise Exception("Could not insert (duplicate slug?)")
        cur.close()
        conn.close()
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"DB: {e}"}),
        }

    print(f"[auto-blog] done id={post_id}")
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"ok": True, "id": post_id, "title": title, "slug": slug}),
    }
