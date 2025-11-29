-- =======================================================
-- 1. CRIAÇÃO DA ESTRUTURA (DDL)
-- =======================================================

-- Tabela de Metas (Configuração)
CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- VARCHAR para suportar 'user123' e '101'
    daily_target INT DEFAULT 5000, -- Meta padrão
    min_target INT DEFAULT 1000,   -- CA3.2
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_user_goals FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_goal UNIQUE (user_id)
);

-- Tabela de Progresso (Histórico)
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    activity_date DATE DEFAULT CURRENT_DATE,
    steps_count INT DEFAULT 0,
    distance_km DECIMAL(5, 2) DEFAULT 0.0,
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_user_progress FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT unique_daily_progress UNIQUE (user_id, activity_date)
);

-- =======================================================
-- 2. POPULAÇÃO EM MASSA (DML)
-- Aqui garantimos que TODOS (user123, tester02, 101, etc.) tenham metas
-- =======================================================

-- Passo A: Cria uma meta padrão (5000 passos) para TODO mundo que está na tabela users
INSERT INTO goals (user_id, daily_target, min_target)
SELECT user_id, 5000, 3000
FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Passo B: Cria um registro de progresso zerado para HOJE para TODO mundo
INSERT INTO user_progress (user_id, activity_date, steps_count, distance_km)
SELECT user_id, CURRENT_DATE, 0, 0.0
FROM users
ON CONFLICT (user_id, activity_date) DO NOTHING;

-- =======================================================
-- 3. AJUSTE DE CENÁRIO DE TESTE (MOCK)
-- Usuario para teste específico com progresso parcial de metas.
-- =======================================================

-- Carlos quer correr muito (Meta 10k)
UPDATE goals 
SET daily_target = 10000 
WHERE user_id = '102';

-- Carlos já correu metade hoje (5k passos = 50% da meta)
UPDATE user_progress 
SET steps_count = 5000, distance_km = 3.5 
WHERE user_id = '102' AND activity_date = CURRENT_DATE;