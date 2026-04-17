-- SEO-поля для статей блога (опциональные переопределения title/description)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title VARCHAR(500);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
