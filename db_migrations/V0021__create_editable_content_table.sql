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

CREATE INDEX idx_content_key ON editable_content(content_key);
CREATE INDEX idx_page ON editable_content(page);