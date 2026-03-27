#!/usr/bin/env bash
# Прод-запуск: порт ТОЛЬКО из .env.production (как в nginx proxy_pass).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.production ]]; then
  echo "Ошибка: нет .env.production в $ROOT" >&2
  echo "  cp .env.production.example .env.production" >&2
  echo "  Укажи PORT= тот же порт, что в nginx (proxy_pass)." >&2
  exit 1
fi

line="$(grep -E '^[[:space:]]*PORT[[:space:]]*=' .env.production | head -1 || true)"
if [[ -z "$line" ]]; then
  echo "Ошибка: в .env.production нет строки PORT=..." >&2
  exit 1
fi

PORT="${line#*=}"
PORT="$(echo "$PORT" | tr -d '\r' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//;s/^["'\'']//;s/["'\'']$//')"
if [[ ! "$PORT" =~ ^[0-9]+$ ]]; then
  echo "Ошибка: PORT=\"$PORT\" — нужно одно число (порт из nginx)." >&2
  exit 1
fi

exec next start -H 127.0.0.1 -p "$PORT"
