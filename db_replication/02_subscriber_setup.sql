-- ============================================================
-- SUBSCRIBER SETUP (Barathiraja's MacBook — receives data from Pratyush's DB)
-- ============================================================
-- Publisher: Pratyush's machine at 10.82.74.239:5432 (DeepBlue)
-- Subscriber: YOUR local PostgreSQL DeepBlue database
-- ============================================================

-- 1. Create the EXACT same table schemas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    profile_image   TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_medical_data (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id   VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    answer_json   JSONB NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_medical_data_user_id ON user_medical_data(user_id);

CREATE TABLE IF NOT EXISTS user_profiles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id   VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    answer_json   JSONB NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE TABLE IF NOT EXISTS reports (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_id        VARCHAR(100) NOT NULL,
    assessment_topic VARCHAR(255),
    urgency_level    VARCHAR(100),
    report_data      JSONB NOT NULL,
    created_at       TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_report_id ON reports(report_id);

-- 2. Subscribe to Pratyush's publisher
CREATE SUBSCRIPTION deepblue_sync
    CONNECTION 'host=10.82.74.239 port=5432 dbname=DeepBlue user=repl_user password=DeepBlue_repl_2026!'
    PUBLICATION deepblue_shared_tables;

-- 3. Verify
SELECT * FROM pg_stat_subscription;
SELECT * FROM pg_subscription_rel;
