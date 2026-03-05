# Sitemap на домене при сайте на ВМ (nginx)

Сайт отдаётся с ВМ. Чтобы **казбек-меретуков.рф/sitemap.xml** отдавал XML с того же домена, на ВМ в nginx нужно проксировать этот путь на функцию sitemap.

## Nginx

В конфиг сервера (сайта казбек-меретуков.рф) добавь **выше** location'а, который отдаёт SPA (например `location /`):

```nginx
location = /sitemap.xml {
    proxy_pass https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3;
    proxy_ssl_server_name on;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_hide_header Content-Type;
    add_header Content-Type "application/xml; charset=utf-8";
}
```

Перезагрузи nginx: `sudo nginx -t && sudo systemctl reload nginx` (или как у тебя).

После этого запрос к **казбек-меретуков.рф/sitemap.xml** будет уходить на функцию и отдаваться с того же домена.

## Если не nginx

Если на ВМ другой веб‑сервер (Apache, Caddy и т.д.) — напиши какой, сделаю вариант под него.
