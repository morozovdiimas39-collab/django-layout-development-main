#!/usr/bin/env bash
# Запускать НА СЕРВЕРЕ из каталога приложения после git pull / деплоя.
# Собирает проект и поднимает PM2 на порту из package.json (сейчас 3497).
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

echo "==> Каталог: $APP_DIR"
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
if ss -tlnp 2>/dev/null | grep -q ':3497'; then
  echo "==> OK: порт 3497 слушается (совпадает с типичным nginx proxy_pass)."
else
  echo "!!! ВНИМАНИЕ: на 3497 никто не слушает. Проверь: ss -tlnp | grep node"
  echo "    и строку proxy_pass в nginx для kazbek-meretukov.ru"
  exit 1
fi
