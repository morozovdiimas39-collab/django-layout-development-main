"""
Облачная функция для применения миграций из GitHub.
Загружает SQL-файлы из morozovdiimas39-collab/django-layout-development-main
и выполняет их в порядке V0001 -> V0025.
"""
import json
import os
import re
import urllib.request
import urllib.error
from urllib.parse import urlparse
from typing import Dict, Any, List

import pg8000

REPO = "morozovdiimas39-collab/django-layout-development-main"
BRANCH = "main"
BASE_URL = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/db_migrations"

MIGRATIONS = [
    "V0001__create_acting_school_tables.sql",
    "V0002__add_school_admin.sql",
    "V0003__add_team_phone_contacts.sql",
    "V0004__add_test_reviews_and_blog_posts.sql",
    "V0005__add_course_and_message_id.sql",
    "V0006__add_name_to_leads.sql",
    "V0007__update_kazbek_info.sql",
    "V0008__add_gallery_photos.sql",
    "V0009__add_utm_and_client_id_to_leads.sql",
    "V0010__add_call_status_and_whatsapp_queue.sql",
    "V0011__add_seo_faq_questions.sql",
    "V0012__add_seo_blog_posts.sql",
    "V0013__add_five_gallery_photos.sql",
    "V0014__add_file_fields_to_whatsapp_templates.sql",
    "V0015__add_social_links.sql",
    "V0016__add_oratory_dates.sql",
    "V0017__add_working_hours.sql",
    "V0018__add_oratory_course_modules.sql",
    "V0019__add_file_fields_to_whatsapp_queue.sql",
    "V0020__add_day1_acting_template.sql",
    "V0021__create_editable_content_table.sql",
    "V0022__fix_blog_post_slugs.sql",
    "V0023__add_acting_cards_start_date.sql",
    "V0024__add_status_to_leads.sql",
    "V0025__add_source_and_missing_leads_columns.sql",
    "V0026__ensure_blog_posts.sql",
]


def fetch_migration(filename: str) -> str:
    url = f"{BASE_URL}/{filename}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def split_sql(content: str) -> List[str]:
    """Разбивает SQL на отдельные инструкции."""
    # Убираем однострочные комментарии
    lines = []
    for line in content.split("\n"):
        if "--" in line:
            line = line[: line.index("--")].rstrip()
        lines.append(line)
    text = "\n".join(lines)
    # Разбиваем по ; (между инструкциями обычно ; и перевод строки)
    statements = []
    for stmt in re.split(r";\s*\n", text):
        stmt = stmt.strip()
        if stmt and not stmt.startswith("/*"):
            statements.append(stmt + ";")
    return statements


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "DATABASE_URL not set"}),
        }

    results = []
    try:
        parsed = urlparse(db_url)
        conn = pg8000.connect(
            user=parsed.username or "postgres",
            password=parsed.password or "",
            host=parsed.hostname or "localhost",
            port=parsed.port or 5432,
            database=parsed.path.lstrip("/") or "postgres",
        )
        conn.autocommit = False

        for filename in MIGRATIONS:
            try:
                sql_content = fetch_migration(filename)
                statements = split_sql(sql_content)
                file_ok = True

                for i, stmt in enumerate(statements):
                    try:
                        with conn.cursor() as cur:
                            cur.execute(stmt)
                        conn.commit()
                    except Exception as e:
                        conn.rollback()
                        err_str = str(e)
                        # IF NOT EXISTS / дубликаты — пропускаем
                        if "already exists" in err_str or "duplicate key" in err_str.lower():
                            results.append({"file": filename, "stmt": i + 1, "status": "skipped", "reason": err_str[:120]})
                        else:
                            results.append({"file": filename, "stmt": i + 1, "status": "error", "error": err_str[:200]})
                            file_ok = False
                            # Продолжаем со следующей миграцией (не останавливаемся)

                if file_ok:
                    results.append({"file": filename, "status": "ok"})
            except urllib.error.HTTPError as e:
                results.append({"file": filename, "status": "fetch_error", "error": str(e)})
            except Exception as e:
                results.append({"file": filename, "status": "error", "error": str(e)[:200]})

        conn.close()
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"success": True, "migrations": results}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"success": False, "error": str(e), "migrations": results}),
        }
