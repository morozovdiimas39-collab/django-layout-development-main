INSERT INTO site_content (key, value) VALUES 
('instagram_url', 'https://instagram.com/'),
('youtube_url', 'https://youtube.com/'),
('telegram_url', 'https://t.me/'),
('whatsapp_url', 'https://wa.me/')
ON CONFLICT (key) DO NOTHING;