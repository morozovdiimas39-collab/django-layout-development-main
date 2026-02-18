#!/usr/bin/env python3
"""Выполняет миграцию V0026 (blog_posts) на указанную базу."""
import os
import sys

try:
    import psycopg2
except ImportError:
    print("Установите: pip install psycopg2-binary")
    sys.exit(1)

SQL = """
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url VARCHAR(500),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

def main():
    url = os.environ.get("DATABASE_URL") or (sys.argv[1] if len(sys.argv) > 1 else None)
    if not url:
        print("Укажи DATABASE_URL или передай URL аргументом:")
        print("  DATABASE_URL='postgresql://user:pass@62.84.127.27:5432/dbname' python scripts/run-migration-v0026.py")
        print("  python scripts/run-migration-v0026.py 'postgresql://user:pass@62.84.127.27:5432/dbname'")
        sys.exit(1)
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    cur.execute(SQL)
    conn.commit()
    cur.close()
    conn.close()
    print("OK: таблица public.blog_posts создана/проверена")

if __name__ == "__main__":
    main()
