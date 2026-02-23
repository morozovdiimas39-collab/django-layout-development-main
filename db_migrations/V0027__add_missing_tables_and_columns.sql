-- Добавить все недостающие таблицы и колонки для django-layout (public).
-- Существующие таблицы не удаляются. Для blog_posts только добавляются колонки при необходимости.

-- 1) Таблицы, которых может не быть
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_modules (
    id SERIAL PRIMARY KEY,
    course_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    result TEXT,
    image_url VARCHAR(500),
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url VARCHAR(500),
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url VARCHAR(500),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS editable_content (
    id SERIAL PRIMARY KEY,
    content_key VARCHAR(255) NOT NULL UNIQUE,
    content_type VARCHAR(50) NOT NULL DEFAULT 'text',
    content_value TEXT NOT NULL,
    page VARCHAR(100),
    section VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    bio TEXT,
    photo_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0
);

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

-- 2) Индексы для editable_content
CREATE INDEX IF NOT EXISTS idx_content_key ON editable_content(content_key);
CREATE INDEX IF NOT EXISTS idx_page ON editable_content(page);

-- 3) Индексы для whatsapp (idx_leads_whatsapp_active — после добавления колонки в leads)
CREATE INDEX IF NOT EXISTS idx_whatsapp_queue_scheduled ON whatsapp_queue(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_queue_lead_id ON whatsapp_queue(lead_id);

-- 4) Колонки для leads (если таблица уже была)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_status VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_target BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp_campaign_active BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_whatsapp_sent_at TIMESTAMP;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS course VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message_id BIGINT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_content VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_term VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS yclid VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gclid VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ym_client_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp_active ON leads(whatsapp_campaign_active);

-- 5) Колонки для whatsapp_queue
ALTER TABLE whatsapp_queue ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE whatsapp_queue ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE whatsapp_queue ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);

-- 6) Колонки для whatsapp_templates
ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);
ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);

-- 7) Колонки для blog_posts (если таблица уже есть с другой структурой)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 8) Начальные данные (только если записей ещё нет)
INSERT INTO site_content (key, value) VALUES
    ('hero_video_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
    ('final_video_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
    ('trial_date', '2024-11-15'),
    ('course_start_date', '2024-12-01'),
    ('kazbek_bio', 'Казбек Меретуков - российский режиссер и педагог актерского мастерства с многолетним опытом работы в кино и театре.'),
    ('olga_bio', 'Ольга Штерц - эксперт по ораторскому искусству, тренер по публичным выступлениям.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO course_modules (course_type, title, description, result, order_num) VALUES
    ('acting', 'Модуль 1: Основы актерского мастерства', 'Изучение базовых техник актерской игры, работа с эмоциями', 'Уверенность в себе, базовые навыки актерской игры', 1),
    ('acting', 'Модуль 2: Работа с камерой', 'Преодоление страха перед камерой, техники съемки', 'Свобода перед камерой, естественность в кадре', 2),
    ('acting', 'Модуль 3: Импровизация', 'Развитие спонтанности и креативности', 'Умение импровизировать, быстрота реакции', 3),
    ('acting', 'Модуль 4: Сценическая речь', 'Постановка голоса, дикция, интонации', 'Четкая речь, выразительная подача', 4),
    ('acting', 'Модуль 5: Создание образа', 'Работа над персонажем, характером', 'Умение создавать убедительные образы', 5),
    ('acting', 'Модуль 6: Съемки короткометражки', 'Практика на съемочной площадке, создание фильма', 'Готовое кино с вашим участием', 6)
ON CONFLICT DO NOTHING;

INSERT INTO faq (question, answer, order_num) VALUES
    ('Сколько длится курс?', 'Курс длится 3 месяца с интенсивными занятиями 2-3 раза в неделю.', 1),
    ('Нужен ли опыт?', 'Нет, курс подходит для начинающих. Мы обучаем с нуля.', 2),
    ('Где проходят занятия?', 'Занятия проходят в Москве в профессиональной студии.', 3),
    ('Что нужно с собой?', 'Удобная одежда для движения и желание учиться!', 4)
ON CONFLICT DO NOTHING;

INSERT INTO whatsapp_templates (name, title, content, delay_days, course) VALUES
('welcome', 'Приветствие', 'Здравствуйте! 👋 Спасибо за интерес к нашим курсам. Я Ольга Штерц, буду рада видеть вас на занятиях!', 0, NULL),
('day1_acting', 'Актёрское мастерство - День 1', 'Уже завтра вы можете начать своё путешествие в мир актёрского мастерства! 🎭 Что вас больше всего привлекает в актерской профессии?', 1, 'acting'),
('day1_oratory', 'Ораторское искусство - День 1', 'Представьте: вы выходите на сцену, все взгляды на вас, и вы чувствуете абсолютную уверенность 🎤 Готовы к этому?', 1, 'oratory'),
('day3', 'Отзыв ученика', 'Хочу поделиться историей одной из наших учениц. Она пришла с дрожью в коленках, а сейчас ведёт презентации на 100+ человек! ⭐', 3, NULL),
('day7', 'Последнее напоминание', 'На этой неделе стартует новый поток. Осталось всего 2 места! Не упустите возможность начать меняться уже сейчас 🚀', 7, NULL)
ON CONFLICT (name) DO NOTHING;
