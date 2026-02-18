#!/bin/bash

BOT_TOKEN="8238321643:AAEV7kBinohHb-RSLah7VSBJ2XSsXTQUpW4"
WEBHOOK_URL="https://functions.yandexcloud.net/d4eb3ckc7i9h81v7gcre"

echo "🔧 Настройка Telegram webhook..."
echo "URL: $WEBHOOK_URL"
echo ""

# Установка webhook
echo "📤 Устанавливаю webhook..."
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\", \"drop_pending_updates\": true}"

echo -e "\n\n📊 Проверка webhook..."
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"

echo -e "\n\n✅ Готово! Напишите боту /start в Telegram"
