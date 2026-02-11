-- Insert default phone to site_content if not exists
INSERT INTO t_p90119217_django_layout_develo.site_content (key, value)
VALUES ('phone', '+7 (999) 123-45-67')
ON CONFLICT (key) DO NOTHING;

-- Insert trial and course start dates  
INSERT INTO t_p90119217_django_layout_develo.site_content (key, value)
VALUES 
    ('trial_date', '2025-03-25'),
    ('course_start_date', '2025-04-01'),
    ('address', 'г. Москва, ул. Примерная, д. 1'),
    ('email', 'info@school.ru'),
    ('map_embed', 'https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=1234567890')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add sample team members
INSERT INTO t_p90119217_django_layout_develo.team_members (name, role, bio, sort_order) VALUES
('Казбек Меретуков', 'Режиссер и преподаватель актерского мастерства', 'Российский режиссер с многолетним опытом работы в кино и театре. Автор уникальной методики обучения актерскому мастерству.', 1),
('Ольга Штерц', 'Преподаватель ораторского искусства', 'Эксперт по публичным выступлениям и коммуникациям. Более 10 лет опыта проведения тренингов для топ-менеджеров.', 2);