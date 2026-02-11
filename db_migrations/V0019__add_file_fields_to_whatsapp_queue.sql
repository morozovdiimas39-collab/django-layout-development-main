-- Добавляем поля для файлов в таблицу whatsapp_queue
ALTER TABLE whatsapp_queue 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);