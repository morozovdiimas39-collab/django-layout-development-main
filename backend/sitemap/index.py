"""
Генерация sitemap.xml с динамическими URL статей блога
Соответствует стандарту sitemaps.org protocol 0.9
"""
import json
import os
import psycopg2
from datetime import datetime
from xml.sax.saxutils import escape


def handler(event: dict, context) -> dict:
    """Генерирует sitemap.xml с статическими и динамическими URL"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Базовый домен
    base_url = 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai'
    
    # Статические страницы
    static_pages = [
        {'loc': '/', 'priority': '1.0', 'changefreq': 'weekly'},
        {'loc': '/acting', 'priority': '0.9', 'changefreq': 'weekly'},
        {'loc': '/oratory', 'priority': '0.9', 'changefreq': 'weekly'},
        {'loc': '/acting-cards', 'priority': '0.9', 'changefreq': 'weekly'},
        {'loc': '/teacher', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': '/team', 'priority': '0.7', 'changefreq': 'monthly'},
        {'loc': '/reviews', 'priority': '0.7', 'changefreq': 'weekly'},
        {'loc': '/contacts', 'priority': '0.6', 'changefreq': 'monthly'},
        {'loc': '/showreel', 'priority': '0.7', 'changefreq': 'monthly'},
    ]
    
    # Получаем статьи блога и страницы пагинации из БД
    blog_posts = []
    blog_list_pages = []  # /blog, /blog?page=2, ...
    per_page = 12
    try:
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            print("[sitemap] DATABASE_URL not set")
        else:
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            cur.execute("SET search_path TO public, t_p90119217_django_layout_develo")
            cur.execute("SELECT COUNT(*) FROM blog_posts")
            total_posts = cur.fetchone()[0]
            total_pages = (total_posts + per_page - 1) // per_page if total_posts else 1
            for p in range(1, total_pages + 1):
                loc = '/blog' if p == 1 else f'/blog?page={p}'
                blog_list_pages.append({'loc': loc, 'priority': '0.8' if p == 1 else '0.6', 'changefreq': 'weekly'})
            cur.execute("""
                SELECT slug, updated_at, created_at 
                FROM blog_posts 
                WHERE published = true
                ORDER BY COALESCE(updated_at, created_at) DESC
            """)
            rows = cur.fetchall()
            print(f"[sitemap] Found {len(rows)} published blog posts, {total_pages} list pages")
            for row in rows:
                slug, updated_at, created_at = row
                if not slug:
                    print(f"[sitemap] Skipping post with empty slug")
                    continue
                if updated_at:
                    lastmod = updated_at.strftime('%Y-%m-%d')
                elif created_at:
                    lastmod = created_at.strftime('%Y-%m-%d')
                else:
                    lastmod = datetime.now().strftime('%Y-%m-%d')
                blog_posts.append({
                    'loc': f'/blog/{slug}',
                    'priority': '0.7',
                    'changefreq': 'monthly',
                    'lastmod': lastmod
                })
            cur.close()
            conn.close()
    except Exception as e:
        import traceback
        print(f"[sitemap] Error fetching blog posts: {e}")
        print(f"[sitemap] Traceback: {traceback.format_exc()}")
    
    # Генерируем XML согласно стандарту sitemaps.org protocol 0.9
    today = datetime.now().strftime('%Y-%m-%d')
    
    xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Статические страницы
    for page in static_pages:
        loc = escape(f'{base_url}{page["loc"]}')
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{loc}</loc>')
        xml_lines.append(f'    <lastmod>{today}</lastmod>')
        xml_lines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xml_lines.append(f'    <priority>{page["priority"]}</priority>')
        xml_lines.append('  </url>')

    # Страницы пагинации блога (/blog, /blog?page=2, ...)
    for page in blog_list_pages:
        loc = escape(f'{base_url}{page["loc"]}')
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{loc}</loc>')
        xml_lines.append(f'    <lastmod>{today}</lastmod>')
        xml_lines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xml_lines.append(f'    <priority>{page["priority"]}</priority>')
        xml_lines.append('  </url>')

    # Статьи блога
    for post in blog_posts:
        loc = escape(f'{base_url}{post["loc"]}')
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{loc}</loc>')
        xml_lines.append(f'    <lastmod>{post["lastmod"]}</lastmod>')
        xml_lines.append(f'    <changefreq>{post["changefreq"]}</changefreq>')
        xml_lines.append(f'    <priority>{post["priority"]}</priority>')
        xml_lines.append('  </url>')
    
    xml_lines.append('</urlset>')
    
    sitemap_xml = '\n'.join(xml_lines)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
        },
        'body': sitemap_xml,
        'isBase64Encoded': False
    }