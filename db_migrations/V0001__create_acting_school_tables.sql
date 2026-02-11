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