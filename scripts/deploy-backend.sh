#!/bin/bash
# Деплой gallery и auto-blog. Запуск: ./scripts/deploy-backend.sh
# Требуется: yc CLI настроен

set -e
cd "$(dirname "$0")/.."

echo "Deploying gallery..."
yc serverless function version create \
  --function-id=d4efvkeujnc7nmk8at71 \
  --runtime=python312 \
  --entrypoint=handler \
  --memory=256m \
  --execution-timeout=60 \
  --source-path=backend/gallery

echo "Deploying auto-blog..."
yc serverless function version create \
  --function-name=auto-blog \
  --runtime=python312 \
  --entrypoint=handler \
  --memory=256m \
  --execution-timeout=60 \
  --source-path=backend/auto-blog

echo "Deploying analyze-note..."
yc serverless function version create \
  --function-name=analyze-note \
  --runtime=python312 \
  --entrypoint=handler \
  --memory=128m \
  --execution-timeout=30 \
  --source-path=backend/analyze-note

echo "Done."
