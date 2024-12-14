-- 可読性のために文字数を記載(厳密には反映されない: SQLiteの使用上)
DROP TABLE IF EXISTS qrcodes;
CREATE TABLE qrcodes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    qrcode_content VARCHAR(50) NOT NULL,
    qrcode_name VARCHAR(50) NOT NULL,
    qrcode_url VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_id ON qrcodes (user_id);