#!/usr/bin/env python3
"""
Проверка схемы БД: какие таблицы и колонки ожидает проект vs что есть в базе.
Запуск:
  DATABASE_URL='postgresql://...' python scripts/check-db-schema.py
  python scripts/check-db-schema.py 'postgresql://...'
Опционально: DB_SCHEMA=public,t_p90119217_django_layout_develo — проверить несколько схем.
"""
import os
import sys
from urllib.parse import urlparse

# Ожидаемые таблицы и колонки (по миграциям и коду backend)
EXPECTED_SCHEMA = {
    "admins": ["id", "username", "password_hash", "created_at"],
    "site_content": ["id", "key", "value", "updated_at"],
    "editable_content": [
        "id", "content_key", "content_type", "content_value",
        "page", "section", "updated_at", "created_at",
    ],
    "course_modules": [
        "id", "course_type", "title", "description", "result",
        "image_url", "order_num", "created_at",
    ],
    "leads": [
        "id", "phone", "status", "source", "name", "course", "message_id",
        "created_at", "updated_at",
        "call_status", "is_target", "whatsapp_campaign_active", "last_whatsapp_sent_at",
        "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
        "yclid", "gclid", "ym_client_id",
    ],
    "gallery_images": ["id", "url", "caption", "order_num", "created_at"],
    "reviews": ["id", "name", "text", "rating", "image_url", "order_num", "created_at"],
    "faq": ["id", "question", "answer", "order_num", "created_at"],
    "blog_posts": [
        "id", "title", "slug", "content", "excerpt", "image_url",
        "published", "created_at", "updated_at",
    ],
    "whatsapp_queue": [
        "id", "lead_id", "phone", "message_template", "message_text",
        "scheduled_at", "sent_at", "status", "error_message", "green_api_response",
        "created_at", "updated_at",
        "file_url", "file_name", "file_type",
    ],
    "whatsapp_templates": [
        "id", "name", "title", "content", "delay_days", "course", "active",
        "created_at", "updated_at",
        "file_url", "file_type", "file_name",
    ],
    "team_members": ["id", "name", "role", "bio", "photo_url", "sort_order"],
    "chat_bots": ["id", "name", "start_message", "order_num", "created_at", "updated_at"],
}

# Таблица content используется в backend/leads/index.py (trial_date, oratory_trial_date),
# но в миграциях её нет — даты хранятся в site_content по ключам. Либо создать content, либо править код.
EXTRA_TABLE_CONTENT = ["id", "trial_date", "oratory_trial_date"]


def get_connection():
    url = os.environ.get("DATABASE_URL") or (sys.argv[1] if len(sys.argv) > 1 else None)
    if not url:
        print("Укажите DATABASE_URL или передайте URL аргументом:")
        print("  DATABASE_URL='postgresql://user:pass@host:5432/dbname' python scripts/check-db-schema.py")
        print("  python scripts/check-db-schema.py 'postgresql://...'")
        sys.exit(1)
    try:
        import psycopg2
        return psycopg2.connect(url)
    except ImportError:
        print("Установите: pip install psycopg2-binary")
        sys.exit(1)


def get_schemas_to_check():
    # По умолчанию проверяем public; в content/index.py ещё используется t_p90119217_django_layout_develo
    env_schema = os.environ.get("DB_SCHEMA")
    if env_schema:
        return [s.strip() for s in env_schema.split(",")]
    return ["public"]


def fetch_tables_and_columns(conn, schemas=None):
    if schemas is None:
        schemas = ["public"]
    cur = conn.cursor()
    cur.execute("""
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = ANY(%s)
        ORDER BY table_schema, table_name, ordinal_position
    """, (schemas,))
    rows = cur.fetchall()
    cur.close()
    # Объединяем колонки из всех указанных схем (таблица может быть в одной из них)
    result = {}
    for _schema, table, column in rows:
        key = table
        if key not in result:
            result[key] = []
        if column not in result[key]:
            result[key].append(column)
    return result


def main():
    conn = get_connection()
    schemas = get_schemas_to_check()
    actual = fetch_tables_and_columns(conn, schemas)
    conn.close()
    if len(schemas) > 1:
        print(f"Проверены схемы: {', '.join(schemas)}\n")

    expected_all = dict(EXPECTED_SCHEMA)
    expected_all["content"] = EXTRA_TABLE_CONTENT  # опциональная таблица для leads

    missing_tables = []
    missing_columns = []
    extra_tables = []

    for table, expected_cols in expected_all.items():
        if table not in actual:
            missing_tables.append((table, expected_cols))
            continue
        for col in expected_cols:
            if col not in actual[table]:
                missing_columns.append((table, col))

    for t in actual:
        if t not in expected_all:
            extra_tables.append(t)

    # Отчёт
    print("=== Проверка схемы БД ===\n")
    if not missing_tables and not missing_columns:
        print("Все ожидаемые таблицы и колонки присутствуют.")
    else:
        if missing_tables:
            print("Отсутствующие таблицы:")
            for table, cols in missing_tables:
                print(f"  - {table} (ожидаемые колонки: {', '.join(cols)})")
            print()
        if missing_columns:
            print("Отсутствующие колонки:")
            for table, col in missing_columns:
                print(f"  - {table}.{col}")
            print()

    if extra_tables:
        print("Таблицы в БД, не описанные в ожидаемой схеме (могут быть служебными):")
        for t in sorted(extra_tables):
            print(f"  - {t}")
        print()

    if missing_tables or missing_columns:
        print("Рекомендации:")
        print("  1. Запустите миграции (облачная функция run-migrations или скрипты из db_migrations/).")
        print("  2. В content/index.py используются две сущности: editable_content (по key/page) и site_content (список + PUT). Убедитесь, что обе таблицы есть.")
        if "content" in [t for t, _ in missing_tables]:
            print("  3. В backend/leads/index.py читается таблица 'content' (trial_date, oratory_trial_date). В миграциях её нет; даты хранятся в site_content по ключам trial_date и oratory_trial_date. Либо добавьте миграцию с таблицей content, либо измените leads/index.py на чтение из site_content.")
        sys.exit(1)
    else:
        print("Схема в порядке.")
        sys.exit(0)


if __name__ == "__main__":
    main()
