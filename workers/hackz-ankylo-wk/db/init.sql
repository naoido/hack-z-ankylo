-- 可読性のために文字数を記載(厳密には反映されない: SQLiteの使用上)
CREATE TABLE qr_codes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    qrcode_name VARCHAR(50) NOT NULL,
    qrcode_key VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_id_user_id ON qr_codes (id, user_id);