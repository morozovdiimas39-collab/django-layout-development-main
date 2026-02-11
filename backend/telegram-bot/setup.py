#!/usr/bin/env python3
import urllib.request
import json

BOT_TOKEN = "8238321643:AAEV7kBinohHb-RSLah7VSBJ2XSsXTQUpW4"
WEBHOOK_URL = "https://functions.poehali.dev/ee18a8c5-48c7-4ecd-bf90-d69fbfc2d751"

print("🔍 Проверяю текущий webhook...")
url = f'https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo'
try:
    with urllib.request.urlopen(url) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Текущий webhook: {result.get('result', {}).get('url', 'не установлен')}")
except Exception as e:
    print(f"❌ Ошибка: {e}")
    exit(1)

print(f"\n🔧 Устанавливаю webhook: {WEBHOOK_URL}")
url = f'https://api.telegram.org/bot{BOT_TOKEN}/setWebhook'
data = json.dumps({'url': WEBHOOK_URL, 'drop_pending_updates': True}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        if result.get('ok'):
            print("✅ Webhook установлен успешно!")
        else:
            print(f"❌ Ошибка: {result.get('description')}")
except Exception as e:
    print(f"❌ Ошибка: {e}")
    exit(1)

print("\n🔍 Проверяю установленный webhook...")
url = f'https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo'
try:
    with urllib.request.urlopen(url) as response:
        result = json.loads(response.read().decode('utf-8'))
        info = result.get('result', {})
        print(f"URL: {info.get('url')}")
        print(f"Проверен: {info.get('has_custom_certificate')}")
        print(f"Ожидающих обновлений: {info.get('pending_update_count', 0)}")
        if info.get('last_error_message'):
            print(f"⚠️ Последняя ошибка: {info.get('last_error_message')}")
except Exception as e:
    print(f"❌ Ошибка: {e}")

print("\n✅ Готово! Напишите боту /start в Telegram")
