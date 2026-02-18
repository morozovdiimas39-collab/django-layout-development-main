# Run Migrations — облачная функция

Применяет все миграции из [GitHub](https://github.com/morozovdiimas39-collab/django-layout-development-main) к вашей БД.

## Деплой в Yandex Cloud

1. Создайте функцию в Yandex Cloud Functions
2. Загрузите код (index.py + requirements.txt)
3. Укажите переменную окружения:
   - `DATABASE_URL` — строка подключения к PostgreSQL

## Вызов

После деплоя вызовите HTTP-триггер:

```
GET https://functions.yandexcloud.net/<ID_ВАШЕЙ_ФУНКЦИИ>
```

Или через curl:

```bash
curl https://functions.yandexcloud.net/<ID_ВАШЕЙ_ФУНКЦИИ>
```

## Результат

- `200` — миграции применены
- `500` — ошибка (смотри `body` в ответе)
