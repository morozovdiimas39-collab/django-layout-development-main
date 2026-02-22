import json
import os
import urllib.request
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests


def _update_sitemap():
    """Обновляет sitemap после изменения статей блога"""
    try:
        sitemap_url = os.environ.get("SITEMAP_URL", "https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3")
        requests.get(sitemap_url, timeout=10)
        print(f"[gallery] Sitemap updated automatically")
    except Exception as e:
        print(f"[gallery] Error updating sitemap: {e}")


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage gallery images, reviews, FAQ, blog, team (v2)
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SET search_path TO public, t_p90119217_django_layout_develo")
        params = event.get('queryStringParameters') or {}
        if not isinstance(params, dict):
            params = {}
        resource = params.get('resource', 'gallery')

        if method == 'GET':
            result = []
            if resource == 'gallery':
                cur.execute("SELECT * FROM gallery_images ORDER BY order_num")
                items = cur.fetchall()
                result = [dict(row) for row in items]
            elif resource == 'reviews':
                cur.execute("SELECT * FROM reviews ORDER BY order_num")
                items = cur.fetchall()
                result = [dict(row) for row in items]
            elif resource == 'faq':
                cur.execute("SELECT * FROM faq ORDER BY order_num")
                items = cur.fetchall()
                result = [dict(row) for row in items]
            elif resource == 'blog':
                blog_slug = params.get('slug')
                if blog_slug:
                    cur.execute("SELECT * FROM blog_posts WHERE slug = %s", (blog_slug,))
                    row = cur.fetchone()
                    result = [dict(row)] if row else []
                else:
                    page = max(1, int(params.get('page', 1)))
                    per_page = min(100, max(1, int(params.get('per_page', 20))))
                    offset = (page - 1) * per_page
                    cur.execute("SELECT COUNT(*) FROM blog_posts")
                    total = cur.fetchone()['count']
                    cur.execute(
                        "SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT %s OFFSET %s",
                        (per_page, offset)
                    )
                    items = cur.fetchall()
                    result = {
                        'items': [],
                        'total': total,
                        'page': page,
                        'per_page': per_page,
                        'total_pages': (total + per_page - 1) // per_page if per_page else 0,
                    }
                    for row in items:
                        r = dict(row)
                        img_url = r.get('image_url', '')
                        if img_url and str(img_url).startswith('data:'):
                            r['image_url'] = ''
                        result['items'].append(r)
            elif resource == 'team':
                cur.execute("SELECT * FROM team_members ORDER BY sort_order")
                items = cur.fetchall()
                result = [dict(row) for row in items]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
            body_data = json.loads(event.get('body', '{}'))
            resource = body_data.get('resource', resource)
            
            if resource == 'blog' and body_data.get('action') == 'generate':
                cur.close()
                conn.close()
                url = os.environ.get('AUTO_BLOG_URL', '').strip()
                if not url:
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'AUTO_BLOG_URL not configured'}),
                    }
                req = urllib.request.Request(
                    url,
                    data=b'{}',
                    method='POST',
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=120) as resp:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': resp.read().decode(),
                    }
            
            if not token:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Authorization required'})
                }
            
            if resource == 'gallery':
                cur.execute(
                    "INSERT INTO gallery_images (url, caption, order_num) VALUES (%s, %s, %s) RETURNING *",
                    (body_data.get('url'), body_data.get('caption'), body_data.get('order_num', 0))
                )
            elif resource == 'reviews':
                cur.execute(
                    "INSERT INTO reviews (name, text, rating, image_url, order_num) VALUES (%s, %s, %s, %s, %s) RETURNING *",
                    (body_data.get('name'), body_data.get('text'), body_data.get('rating', 5), body_data.get('image_url'), body_data.get('order_num', 0))
                )
            elif resource == 'faq':
                cur.execute(
                    "INSERT INTO faq (question, answer, order_num) VALUES (%s, %s, %s) RETURNING *",
                    (body_data.get('question'), body_data.get('answer'), body_data.get('order_num', 0))
                )
            elif resource == 'blog':
                import re
                title = (body_data.get('title') or '').strip() or 'Без названия'
                content = body_data.get('content') or ''
                slug = (body_data.get('slug') or '').strip()
                if not slug:
                    slug = re.sub(r'[^\w\s-]', '', title.lower())
                    slug = re.sub(r'[\s_-]+', '-', slug).strip('-')[:200] or 'post'
                excerpt = body_data.get('excerpt') or ''
                image_url = body_data.get('image_url') or ''
                cur.execute(
                    "INSERT INTO blog_posts (title, slug, content, excerpt, image_url, published) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                    (title, slug, content, excerpt, image_url, body_data.get('published', False))
                )
            elif resource == 'team':
                cur.execute(
                    "INSERT INTO team_members (name, role, bio, photo_url, sort_order) VALUES (%s, %s, %s, %s, %s) RETURNING *",
                    (body_data.get('name'), body_data.get('role'), body_data.get('bio'), body_data.get('photo_url'), body_data.get('sort_order', 0))
                )
            
            item = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            # Обновляем sitemap после создания статьи блога
            if resource == 'blog':
                _update_sitemap()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(item), default=str)
            }
        
        elif method == 'PUT':
            headers = event.get('headers', {})
            token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
            
            if not token:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Authorization required'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            resource = body_data.get('resource', resource)
            item_id = body_data.get('id') or (params.get('id') if params else None)
            
            if not item_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID is required'})
                }
            
            if resource == 'gallery':
                cur.execute(
                    "UPDATE gallery_images SET url = %s, caption = %s, order_num = %s WHERE id = %s RETURNING *",
                    (body_data.get('url'), body_data.get('caption'), body_data.get('order_num', 0), item_id)
                )
            elif resource == 'reviews':
                cur.execute(
                    "UPDATE reviews SET name = %s, text = %s, rating = %s, image_url = %s, order_num = %s WHERE id = %s RETURNING *",
                    (body_data.get('name'), body_data.get('text'), body_data.get('rating', 5), body_data.get('image_url'), body_data.get('order_num', 0), item_id)
                )
            elif resource == 'blog':
                image_url = body_data.get('image_url') or ''
                cur.execute(
                    "UPDATE blog_posts SET title = %s, content = %s, excerpt = %s, image_url = %s WHERE id = %s RETURNING *",
                    (body_data.get('title'), body_data.get('content'), body_data.get('excerpt'), image_url, item_id)
                )
            elif resource == 'faq':
                cur.execute(
                    "UPDATE faq SET question = %s, answer = %s, order_num = %s WHERE id = %s RETURNING *",
                    (body_data.get('question'), body_data.get('answer'), body_data.get('order_num', 0), item_id)
                )
            elif resource == 'team':
                cur.execute(
                    "UPDATE team_members SET name = %s, role = %s, bio = %s, photo_url = %s, sort_order = %s WHERE id = %s RETURNING *",
                    (body_data.get('name'), body_data.get('role'), body_data.get('bio'), body_data.get('photo_url'), body_data.get('sort_order', 0), item_id)
                )
            
            item = cur.fetchone()
            
            if not item:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Item not found'})
                }
            
            conn.commit()
            cur.close()
            conn.close()
            
            # Обновляем sitemap после обновления статьи блога
            if resource == 'blog':
                _update_sitemap()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(item), default=str)
            }
        
        elif method == 'DELETE':
            headers = event.get('headers', {})
            token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
            
            if not token:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Authorization required'})
                }
            
            body_data = json.loads(event.get('body', '{}')) if event.get('body') else {}
            resource = body_data.get('resource', resource)
            item_id = body_data.get('id') or (params.get('id') if params else None)
            
            if not item_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID is required'})
                }
            
            if resource == 'gallery':
                cur.execute("DELETE FROM gallery_images WHERE id = %s", (item_id,))
            elif resource == 'reviews':
                cur.execute("DELETE FROM reviews WHERE id = %s", (item_id,))
            elif resource == 'blog':
                cur.execute("DELETE FROM blog_posts WHERE id = %s", (item_id,))
            elif resource == 'faq':
                cur.execute("DELETE FROM faq WHERE id = %s", (item_id,))
            elif resource == 'team':
                cur.execute("DELETE FROM team_members WHERE id = %s", (item_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            # Обновляем sitemap после удаления статьи блога
            if resource == 'blog':
                _update_sitemap()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
    except Exception as e:
        try:
            if 'cur' in locals() and cur:
                cur.close()
        except:
            pass
        try:
            if 'conn' in locals() and conn:
                conn.close()
        except:
            pass
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }