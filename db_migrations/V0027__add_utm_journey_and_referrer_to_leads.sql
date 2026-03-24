-- Сквозная аналитика: цепочка касаний + последний referrer
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_journey JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer TEXT;
