-- Добавляем новые статусы для лидов
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_status VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_target BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp_campaign_active BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_whatsapp_sent_at TIMESTAMP;

-- Создаём таблицу для очереди WhatsApp сообщений
CREATE TABLE IF NOT EXISTS whatsapp_queue (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    phone VARCHAR(20) NOT NULL,
    message_template VARCHAR(100) NOT NULL,
    message_text TEXT NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    green_api_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_queue_scheduled ON whatsapp_queue(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_queue_lead_id ON whatsapp_queue(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp_active ON leads(whatsapp_campaign_active);

-- Создаём таблицу для шаблонов WhatsApp сообщений
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    delay_days INTEGER NOT NULL,
    course VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем начальные шаблоны
INSERT INTO whatsapp_templates (name, title, content, delay_days, course) VALUES
('welcome', 'Приветствие', 'Здравствуйте! 👋 Спасибо за интерес к нашим курсам. Я Ольга Штерц, буду рада видеть вас на занятиях!', 0, NULL),
('day1_acting', 'Актёрское мастерство - День 1', 'Уже завтра вы можете начать своё путешествие в мир актёрского мастерства! 🎭 Что вас больше всего привлекает в актерской профессии?', 1, 'acting'),
('day1_oratory', 'Ораторское искусство - День 1', 'Представьте: вы выходите на сцену, все взгляды на вас, и вы чувствуете абсолютную уверенность 🎤 Готовы к этому?', 1, 'oratory'),
('day3', 'Отзыв ученика', 'Хочу поделиться историей одной из наших учениц. Она пришла с дрожью в коленках, а сейчас ведёт презентации на 100+ человек! ⭐', 3, NULL),
('day7', 'Последнее напоминание', 'На этой неделе стартует новый поток. Осталось всего 2 места! Не упустите возможность начать меняться уже сейчас 🚀', 7, NULL)
ON CONFLICT (name) DO NOTHING;