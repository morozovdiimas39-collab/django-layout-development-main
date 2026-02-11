-- Добавляем режим работы в контент
INSERT INTO site_content (key, value, updated_at)
VALUES ('working_hours', 'Ежедневно: 10:00 - 21:00', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO NOTHING;