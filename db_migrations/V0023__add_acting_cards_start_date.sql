-- Добавляем поле для даты начала съемки визиток
INSERT INTO site_content (key, value) 
VALUES ('acting_cards_start_date', '2025-03-15')
ON CONFLICT (key) DO NOTHING;