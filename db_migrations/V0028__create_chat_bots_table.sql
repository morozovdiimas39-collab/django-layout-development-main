-- Черновики чат-ботов (админка «Боты»), отдельная функция backend/chat-bots
CREATE TABLE IF NOT EXISTS chat_bots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Новый бот',
    system_prompt TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    content_key VARCHAR(150) DEFAULT '',
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_bots_order ON chat_bots (order_num, id);
