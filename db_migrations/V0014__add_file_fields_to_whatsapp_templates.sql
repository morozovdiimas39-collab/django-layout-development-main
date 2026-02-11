ALTER TABLE whatsapp_templates 
ADD COLUMN file_url TEXT,
ADD COLUMN file_type VARCHAR(50),
ADD COLUMN file_name VARCHAR(255);