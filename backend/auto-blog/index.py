"""
Облачная функция: автопубликация статей в блог 5 раз в день.
Вызывается по cron. Генерирует статью и картинку через Gemini, добавляет в blog_posts.
Картинки сохраняются в Object Storage.
"""
import json
import os
import re
import random
import base64
from typing import Dict, Any

import psycopg2
import requests
import boto3

GEMINI_TEXT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
GEMINI_IMAGE_MODELS = [
    "gemini-2.5-flash-image",
]

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


def format_html_content(html: str) -> str:
    """Форматирует HTML контент с правильными отступами и пробелами."""
    if not html:
        return html
    
    # Добавляем пробелы между блочными элементами для правильного отображения
    html = re.sub(r'(</p>)(<p)', r'\1\n\n\2', html)
    html = re.sub(r'(</h2>)(<p)', r'\1\n\n\2', html)
    html = re.sub(r'(</h2>)(<h2>)', r'\1\n\n\2', html)
    html = re.sub(r'(</ul>)(<p)', r'\1\n\n\2', html)
    html = re.sub(r'(</ol>)(<p)', r'\1\n\n\2', html)
    html = re.sub(r'(</li>)(<li>)', r'\1\n\2', html)
    
    # Убираем только множественные пробелы внутри текста, но сохраняем структуру
    html = re.sub(r' +', ' ', html)
    html = html.strip()
    
    return html


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
    import random
    article_type = random.choice(["article", "exercise"])
    
    if article_type == "exercise":
        prompt = f"""Напиши подробное упражнение для блога школы актёрского и ораторского мастерства Казбека Меретукова.
Тема: {topic}

Требования:
- Напиши ПОЛНОЕ и ПОДРОБНОЕ описание упражнения (минимум 500-800 слов)
- Используй HTML теги для структуры: <h2> для заголовков разделов, <p> для параграфов, <ol><li> для пошаговых инструкций, <ul><li> для списков и примеров
- Обязательно включи: цель упражнения, подробную подготовку, детальную задачу, описание препятствий, процесс адаптации, обратную связь, советы и примеры заданий
- Каждый раздел должен быть подробно расписан

Верни ТОЛЬКО валидный JSON без markdown, без пояснений:
{{
  "title": "Название упражнения (до 80 символов)",
  "excerpt": "Краткое описание упражнения 1-2 предложения (до 200 символов)",
  "content": "ПОЛНОЕ описание упражнения в HTML. Используй <h2>Цель упражнения</h2>, <h2>Подготовка</h2>, <h2>Задача</h2>, <h2>Препятствие</h2>, <h2>Адаптация</h2>, <h2>Обратная связь</h2>, <h2>Советы</h2>, <h2>Примеры заданий</h2>. Каждый раздел должен быть подробным с параграфами <p> и списками <ul><li> или <ol><li>."
}}"""
    else:
        prompt = f"""Напиши подробную статью для блога школы актёрского и ораторского мастерства Казбека Меретукова.
Тема: {topic}

Требования:
- Напиши ПОЛНУЮ и ПОДРОБНУЮ статью (минимум 800-1200 слов)
- Используй HTML теги для структуры: <h2> для заголовков разделов, <p> для параграфов, <ul><li> и <ol><li> для списков
- Статья должна быть информативной, полезной и хорошо структурированной
- Каждый раздел должен быть подробно расписан с примерами

Верни ТОЛЬКО валидный JSON без markdown, без пояснений:
{{
  "title": "Заголовок статьи (до 80 символов)",
  "excerpt": "Краткое описание 1-2 предложения для превью (до 200 символов)",
  "content": "ПОЛНЫЙ текст статьи в HTML. Используй <h2> для заголовков разделов, <p> для параграфов (каждый параграф в отдельном теге <p>), <ul><li> для маркированных списков, <ol><li> для нумерованных списков. Между параграфами должны быть пробелы. Статья должна быть подробной и информативной."
}}"""
    proxies = _get_proxies()
    resp = requests.post(
        f"{GEMINI_TEXT_URL}?key={gemini_key}",
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.8, "maxOutputTokens": 8192},
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


def generate_article_image(gemini_key: str, topic: str, title: str) -> tuple[bytes, str] | None:
    """Генерация картинки через Gemini. Пробует несколько моделей."""
    print("[auto-blog] image gen start")
    import random
    styles = [
        "реалистичное фото",
        "художественная иллюстрация",
        "минималистичный дизайн",
        "драматичное освещение",
        "абстрактная композиция",
        "театральная сцена",
        "портрет актёра",
        "современная фотография"
    ]
    scenes = [
        "театральная сцена с занавесом",
        "актёр перед камерой",
        "оратор на сцене",
        "репетиция в студии",
        "театральные маски",
        "микрофон и сцена",
        "актёрское мастерство в действии",
        "публичное выступление"
    ]
    style = random.choice(styles)
    scene = random.choice(scenes)
    prompt = f"Изображение без текста. Обложка для статьи блога. Тема: {topic}. Заголовок: {title}. {style}, {scene}. Разнообразная композиция, уникальный ракурс. Горизонтальный формат. Высокое качество. Разные цвета и настроение."
    proxies = _get_proxies()
    for model_id in GEMINI_IMAGE_MODELS:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent"
            resp = requests.post(
                f"{url}?key={gemini_key}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.9,
                        "maxOutputTokens": 8192,
                        "responseModalities": ["TEXT", "IMAGE"],
                    },
                },
                proxies=proxies,
                timeout=120,
            )
            if resp.status_code != 200:
                print(f"[auto-blog] {model_id}: {resp.status_code}")
                continue
            data = resp.json()
            candidates = data.get("candidates") or []
            if not candidates:
                continue
            parts = candidates[0].get("content", {}).get("parts") or []
            if not parts:
                print(f"[auto-blog] {model_id}: empty parts")
                continue
            for part in parts:
                raw = part.get("inlineData") or part.get("inline_data")
                if raw:
                    mime = raw.get("mimeType") or raw.get("mime_type", "image/png")
                    b64 = raw.get("data", "")
                    if b64:
                        return base64.b64decode(b64), mime
            print(f"[auto-blog] {model_id}: no inlineData in {len(parts)} parts")
        except Exception as e:
            print(f"[auto-blog] {model_id}: {e}")
    print("[auto-blog] image gen: all models failed")
    return None


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

    title = (article.get("title") or "Статья").strip()[:255] or "Статья"
    excerpt = (article.get("excerpt") or "")[:500]
    raw_content = (article.get("content") or "").strip() or "<p>Содержание статьи.</p>"
    content = format_html_content(raw_content)
    slug = slugify(title)

    image_url = ""
    try:
        for attempt in range(3):
            img_result = generate_article_image(gemini_key, topic, title)
            if img_result:
                print(f"[auto-blog] image generated (attempt {attempt + 1})")
                raw_bytes, mime_type = img_result
                
                # Определяем расширение файла по MIME типу
                ext = "png"
                if "jpeg" in mime_type or "jpg" in mime_type:
                    ext = "jpg"
                elif "webp" in mime_type:
                    ext = "webp"
                
                # Сохраняем картинку в Object Storage
                bucket_name = os.environ.get("YC_BUCKET", "").strip()
                if not bucket_name:
                    bucket_name = os.environ.get("BUCKET_NAME", "").strip()
                
                image_filename = f"images/blog-{slug}-{attempt}.{ext}"
                
                if bucket_name:
                    try:
                        # Пробуем получить credentials из переменных окружения или метаданных
                        access_key = os.environ.get('YC_ACCESS_KEY_ID', '')
                        secret_key = os.environ.get('YC_SECRET_ACCESS_KEY', '')
                        
                        # Если credentials не заданы, пробуем получить из метаданных Yandex Cloud
                        if not access_key or not secret_key:
                            try:
                                import urllib.request
                                metadata_url = 'http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token'
                                req = urllib.request.Request(metadata_url, headers={'Metadata-Flavor': 'Google'})
                                with urllib.request.urlopen(req, timeout=2) as resp:
                                    token_data = json.loads(resp.read().decode())
                                    # Используем токен для доступа к Object Storage
                                    access_key = token_data.get('access_key_id', '')
                                    secret_key = token_data.get('secret_access_key', '')
                            except:
                                pass
                        
                        if access_key and secret_key:
                            s3_client = boto3.client(
                                's3',
                                endpoint_url='https://storage.yandexcloud.net',
                                aws_access_key_id=access_key,
                                aws_secret_access_key=secret_key
                            )
                            
                            s3_client.put_object(
                                Bucket=bucket_name,
                                Key=image_filename,
                                Body=raw_bytes,
                                ContentType=mime_type
                            )
                            
                            # Формируем публичный URL для Object Storage
                            image_url = f"https://storage.yandexcloud.net/{bucket_name}/{image_filename}"
                            print(f"[auto-blog] image saved to Object Storage: {image_url}")
                            break
                    except Exception as e:
                        print(f"[auto-blog] Object Storage save error: {e}")
                
                # Если Object Storage не настроен, используем статический URL
                if not image_url:
                    image_url = f"{site_url.rstrip('/')}/{image_filename}"
                    print(f"[auto-blog] using static URL: {image_url} (Object Storage not configured, file needs manual upload)")
                    break
            print(f"[auto-blog] image attempt {attempt + 1}/3 failed")
    except Exception as e:
        print(f"[auto-blog] image generation error: {e}, continuing without image")
        image_url = ""
    
    if not image_url:
        print("[auto-blog] image generation failed, continuing without image")
        image_url = ""  # Продолжаем без картинки

    print("[auto-blog] inserting into DB")
    post_id = None
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SET search_path TO public, t_p90119217_django_layout_develo")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                image_url TEXT,
                published BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        try:
            cur.execute("ALTER TABLE blog_posts ALTER COLUMN image_url TYPE TEXT")
            conn.commit()
        except Exception:
            conn.rollback()
        for attempt in range(5):
            try_slug = f"{slug}-{attempt}" if attempt else slug
            try:
                cur.execute(
                    """INSERT INTO blog_posts (title, slug, content, excerpt, image_url, published)
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

    # Автоматически обновляем sitemap после создания статьи
    try:
        sitemap_url = os.environ.get("SITEMAP_URL", "https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3")
        proxies = _get_proxies()
        requests.get(sitemap_url, proxies=proxies, timeout=10)
        print(f"[auto-blog] Sitemap updated automatically")
    except Exception as e:
        print(f"[auto-blog] Error updating sitemap: {e}")

    print(f"[auto-blog] done id={post_id}")
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"ok": True, "id": post_id, "title": title, "slug": slug}),
    }
