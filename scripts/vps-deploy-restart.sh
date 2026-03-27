#!/usr/bin/env bash
# Запускать НА СЕРВЕРЕ из каталога приложения после git pull / деплоя.
# Порт Next = переменная PORT в .env.production (должен совпадать с proxy_pass в nginx).
#
#   bash scripts/vps-deploy-restart.sh
#   bash scripts/vps-deploy-restart.sh /var/www/kazbek-meretukov_ru

set -euo pipefail

APP_DIR="${1:-$PWD}"
cd "$APP_DIR"

if [[ ! -f package.json ]]; then
  echo "Ошибка: в $APP_DIR нет package.json — укажи каталог деплоя первым аргументом."
  exit 1
fi

DEPLOY_PORT="3000"
if [[ -f .env.production ]]; then
  line="$(grep -E '^[[:space:]]*PORT[[:space:]]*=' .env.production | head -1 || true)"
  if [[ -n "$line" ]]; then
    DEPLOY_PORT="${line#*=}"
    DEPLOY_PORT="$(echo "$DEPLOY_PORT" | tr -d '\r' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//;s/^["'\'']//;s/["'\'']$//')"
  fi
fi
if [[ ! "$DEPLOY_PORT" =~ ^[0-9]+$ ]]; then
  DEPLOY_PORT="3000"
fi

if [[ ! -f .env.production ]]; then
  echo "!!! Нет файла .env.production"
  echo "    Создай: cp .env.production.example .env.production"
  echo "    Укажи PORT= тот же порт, что в nginx (proxy_pass http://127.0.0.1:ПОРТ;)"
  exit 1
fi

echo "==> Каталог: $APP_DIR"
echo "==> Ожидаемый порт из .env.production: $DEPLOY_PORT"
echo "==> npm ci"
npm ci
echo "==> npm run build"
npm run build

if command -v pm2 >/dev/null 2>&1; then
  echo "==> PM2: перезапуск kazbek-meretukov"
  pm2 delete kazbek-meretukov 2>/dev/null || true
  pm2 start ecosystem.config.cjs
  pm2 save
else
  echo "PM2 не найден. Запусти вручную в screen/tmux:"
  echo "  NODE_ENV=production npm run start"
  exit 1
fi

sleep 2
if ss -tlnp 2>/dev/null | grep -q ":${DEPLOY_PORT}"; then
  echo "==> OK: порт ${DEPLOY_PORT} слушается (как в .env.production)."
else
  echo "!!! ВНИМАНИЕ: на ${DEPLOY_PORT} никто не слушает."
  echo "    Проверь PORT в .env.production и proxy_pass в nginx."
  ss -tlnp 2>/dev/null | grep -E 'node|next' || true
  exit 1
fi
