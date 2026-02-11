-- Add new admin user: school/password123
INSERT INTO admins (username, password_hash) 
VALUES ('school', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
ON CONFLICT (username) DO NOTHING;