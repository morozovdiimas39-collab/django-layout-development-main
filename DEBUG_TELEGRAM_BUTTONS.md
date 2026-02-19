# Отладка кнопок Telegram

## Что проверить по шагам

### 1. Webhook указывает на telegram-bot

У одного бота может быть только один webhook. Callback от кнопок приходит на URL webhook.

**Проверка:**
```bash
curl "https://api.telegram.org/bot<ВАШ_ТОКЕН>/getWebhookInfo"
```

В ответе `url` должен быть URL функции **telegram-bot** (та же, что обрабатывает callback).

**Настройка webhook:**
```bash
curl -X POST "https://api.telegram.org/bot<ТОКЕН>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://functions.yandexcloud.net/d4eb3ckc7i9h81v7gcre"}'
```

### 2. Один и тот же бот

- **leads** отправляет уведомления с кнопками через `TELEGRAM_BOT_TOKEN`
- **telegram-bot** получает callback через webhook
- Токен должен быть **один и тот же** — и в leads, и в telegram-bot

### 3. TELEGRAM_ADMIN_CHAT_ID

- В **telegram-bot** и **leads** должен быть одинаковый `TELEGRAM_ADMIN_CHAT_ID`
- Формат: для личного чата — `4940620915`, для группы — `-1001234567890`
- При нажатии кнопки `chat_id` из Telegram сравнивается с этой переменной

### 4. LEADS_API_URL в telegram-bot

При нажатии кнопки telegram-bot вызывает `PUT` на leads. URL leads должен быть корректным.

По умолчанию: `https://functions.yandexcloud.net/d4edr6jj85mv48hoo4e1`

Если leads развёрнут в другом месте — задайте `LEADS_API_URL` в env функции telegram-bot.

### 5. Логи

После нажатия кнопки в логах функции telegram-bot должно быть:

```
Update keys: ['callback_query'], has callback_query: True
Callback: data=status_42_trial, chat_id=4940620915, admin_chat_id='4940620915'
```

Если в логах нет `callback_query` — webhook не доходит до telegram-bot или URL webhook неверный.

### 6. Что вы видите при нажатии

| Что видите | Причина |
|------------|---------|
| Ничего | Callback не доходит до telegram-bot (webhook/URL) |
| «TELEGRAM_ADMIN_CHAT_ID не настроен» | Переменная не задана в telegram-bot |
| «Доступ только для администратора» | chat_id не совпадает с TELEGRAM_ADMIN_CHAT_ID |
| «Ошибка обновления: 404» | Неверный LEADS_API_URL |
| «✅ Статус обновлён» | Всё работает |

---

## Быстрый тест webhook

1. Напишите боту в Telegram любое сообщение.
2. Если он отвечает (через Gemini) — webhook доходит до telegram-bot.
3. Значит, callback от кнопок тоже должен идти на telegram-bot.

Если бот не отвечает на сообщения — webhook либо не настроен, либо указывает на неправильный URL.
