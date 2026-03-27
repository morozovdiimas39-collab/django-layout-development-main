# Деплой на VPS и порт nginx

## 502 = несовпадение портов

Nginx шлёт запросы на **`proxy_pass`**, например `http://127.0.0.1:3045`.  
Next должен слушать **тот же** порт.

В репозитории **нет одного «правильного» числа** для всех серверов — порт задаётся **на VPS**.

Команда **`npm run start`** вызывает **`scripts/start-production.sh`**: он читает **`PORT`** из **`.env.production`** и запускает `next start -p …` (так порт не «теряется», как бывает при одном только `.env`).

## Как задать порт

1. На сервере в корне проекта создай **`.env.production`** (в git не коммитится):

   ```bash
   cp .env.production.example .env.production
   nano .env.production
   ```

2. Поставь **ровно тот порт**, что в nginx:

   ```env
   PORT=3045
   ```

   (вместо `3045` — своё число из `proxy_pass`.)

3. Узнать порт в nginx:

   ```bash
   sudo grep -r proxy_pass /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
   ```

4. Деплой:

   ```bash
   bash scripts/vps-deploy-restart.sh
   ```

Скрипт читает `PORT` из `.env.production` и проверяет, что этот порт слушается.

## Запуск без PM2

```bash
NODE_ENV=production npm run start
```

Next подхватит `.env.production` и `PORT`.

## Проверка

```bash
grep PORT .env.production
curl -sI "http://127.0.0.1:$(grep -E '^PORT=' .env.production | cut -d= -f2 | tr -d '\r')/" | head -3
```
