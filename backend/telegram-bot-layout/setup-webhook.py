#!/usr/bin/env python3
"""
Скрипт для настройки webhook Telegram бота (проект layout).
Запустите после добавления TELEGRAM_BOT_TOKEN в секреты.
Webhook должен указывать на URL функции telegram-bot-layout в Yandex Cloud.
"""

import urllib.request
import json
import sys

BOT_TOKEN = "8238321643:AAEV7kBinohHb-RSLah7VSBJ2XSsXTQUpW4"
# URL функции telegram-bot-layout в Yandex Cloud (замените на свой после деплоя)
WEBHOOK_URL = "https://functions.yandexcloud.net/d4eg7ndil8cisa90cjhu"

def set_webhook():
    """Установка webhook для бота"""
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/setWebhook'
    
    data = json.dumps({
        'url': WEBHOOK_URL,
        'drop_pending_updates': True
    }).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Webhook установлен успешно!")
            print(f"📋 Ответ: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
    except Exception as e:
        print(f"❌ Ошибка при установке webhook: {e}")
        return False

def get_webhook_info():
    """Получение информации о текущем webhook"""
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo'
    
    try:
        with urllib.request.urlopen(url) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("\n📊 Информация о webhook:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return result
    except Exception as e:
        print(f"❌ Ошибка при получении информации: {e}")
        return None

if __name__ == '__main__':
    print("🤖 Настройка Telegram бота (layout)...\n")
    print(f"🔗 Webhook URL: {WEBHOOK_URL}\n")
    
    if set_webhook():
        get_webhook_info()
        print("\n✨ Бот готов к работе!")
        print("💬 Найдите вашего бота в Telegram и отправьте /start")
    else:
        sys.exit(1)
