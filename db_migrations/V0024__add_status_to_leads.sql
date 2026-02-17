-- Добавить колонку status в таблицу leads (если её нет)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

-- Обновить существующие записи
UPDATE leads SET status = 'new' WHERE status IS NULL;
