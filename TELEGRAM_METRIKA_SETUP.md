# Настройка: Telegram + Метрика

## Что нужно сделать вам

### 1. Переменные окружения

Добавьте в секреты проекта:

| Переменная | Где нужна | Описание |
|------------|-----------|----------|
| `TELEGRAM_BOT_TOKEN` | telegram-bot, leads | Токен бота от @BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | telegram-bot, leads | Ваш Chat ID (куда приходят заявки) |
| `YANDEX_METRIKA_MP_TOKEN` | metrika-goal-sender | Токен Measurement Protocol (см. ниже) |

**Как получить YANDEX_METRIKA_MP_TOKEN:**
1. Метрика → Счётчик 104854671 → **Настройки**
2. **Дополнительные настройки** → **Безопасность и использование данных**
3. Включите **Measurement Protocol** и скопируйте сгенерированный токен

**Как получить Chat ID:**  
Запустите функцию `get-chat-id`, напишите боту `/start`, обновите страницу — увидите свой Chat ID.

### 2. Webhook

Webhook бота должен указывать на URL функции `telegram-bot`:

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=<URL_ФУНКЦИИ_TELEGRAM_BOT>
```

Скрипт: `setup-telegram-webhook.sh` или `backend/telegram-webhook-setup`.

### 3. Цели в Яндекс.Метрике

В счётчике **104854671** создайте цели (Настройки → Цели → JavaScript-события):

| Идентификатор | Название |
|---------------|----------|
| `trial_scheduled` | Записался на пробное |
| `enrolled` | Записался на обучение |
| `considering` | Думает |
| `rejected` | Нецелевой |
| `called_client` | Позвонил клиенту |

### 4. Деплой

Задеплойте обновлённые функции:
- `telegram-bot`
- `leads`

---

## Важно

- **Один бот** — и для уведомлений (leads), и для webhook (telegram-bot). Используйте один `TELEGRAM_BOT_TOKEN`.
- Без `TELEGRAM_ADMIN_CHAT_ID` кнопки в заявках не будут работать.
