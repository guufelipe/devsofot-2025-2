-- ===============================================
-- TABELA: users
-- ===============================================
CREATE TABLE users (
    -- ID único do usuário
    id VARCHAR(255) PRIMARY KEY,

    -- Saldo total de Capibas do usuário
    balance INTEGER NOT NULL DEFAULT 0,

    -- Data da última atividade registrada
    last_activity_date DATE,

    -- Contagem de dias consecutivos de atividade
    current_streak_count INTEGER NOT NULL DEFAULT 0,

    -- Flag do Desafio de Boas-Vindas (F = não completado, S = completado)
    welcome_challenge_completed CHAR(1) NOT NULL DEFAULT 'F',

    -- Metadados
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ===============================================
-- TABELA: transactions
-- ===============================================
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,

    -- FK para o usuário que recebeu esta transação
    user_id VARCHAR(255) REFERENCES users(id) NOT NULL,

    -- Quantidade de Capibas creditada
    amount_capiba INTEGER NOT NULL,

    -- Data e hora da transação
    date_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Tipo da atividade (corrida, bike, caminhada, etc.)
    activity_type VARCHAR(255) NOT NULL,

    -- Detalhes adicionais da atividade (ex: "Corrida - 5.2km")
    activity_details VARCHAR(255),

    -- Origem da bonificação (ex: 'welcome_challenge', 'tourist_point', etc.)
    bonus_origin VARCHAR(50),

    -- Metadados
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
