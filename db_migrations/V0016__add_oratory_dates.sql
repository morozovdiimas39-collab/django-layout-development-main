-- Добавляем даты для ораторского курса
INSERT INTO site_content (key, value, updated_at)
VALUES 
  ('oratory_trial_date', '2025-11-02', CURRENT_TIMESTAMP),
  ('oratory_course_start_date', '2025-11-04', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO NOTHING;