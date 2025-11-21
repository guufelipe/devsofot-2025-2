// src/backend/services/rewardEngine.js

import { requestCapibaCredit } from '../integrations/capibaApi.js';
import { query } from '../database/db_connection.js';

const CAPIBA_FACTOR = Number(process.env.CAPIBA_PER_KM) || 30;
const MAX_SPEED_KPH = 25;

// CODIGO REFATORADO PARA EVITAR REPETICAO DEVIDO AO BONUS FIXO
// Método auxiliar privado para registrar transação no banco

async function registerTransaction(userId, amount, type, details, apiData) {
    const transactionSql = `
        INSERT INTO transactions (user_id, amount_capiba, activity_type, activity_details, external_ref_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    
    // Pega o ID da transação da API da prefeitura, se houver

    const transactionId = (apiData && apiData.transaction_id) ? apiData.transaction_id : null;
    const transactionParams = [userId, amount, type, details, transactionId];

    try {
        await query(transactionSql, transactionParams);

        // Atualiza saldo do usuário

        const updateBalanceSql = `
            UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance;
        `;
        const updateResult = await query(updateBalanceSql, [amount, userId]);
        const newBalance = updateResult.rows && updateResult.rows[0] ? updateResult.rows[0].balance : null;

        return { success: true, credited: amount, details, balance: newBalance };
    } catch (dbError) {
        console.error("Erro ao registrar transação no BD local:", dbError);

        // Retorna falso mas avisa que o crédito externo pode ter ocorrido

        return { success: false, message: "Crédito na Capiba OK, mas falha no registro local." };
    }
}

// Métodos Públicos

export function calculateCapibas(distanceKm) {
    return Math.floor(distanceKm * CAPIBA_FACTOR);
}

// processBonusCredit (NOVO PARA S2T3)
// Processa um valor fixo (sem validar KM/tempo)

export async function processBonusCredit(userId, amount, bonusType, description) {
    console.log(`[RewardEngine] Processando bônus fixo: ${amount} para ${userId}`);
    
    // 1. Chama API Prefeitura (Integração obrigatória da Task 3)
    const creditResult = await requestCapibaCredit(userId, amount, description);

    if (creditResult.success) {
        // 2. Salva no banco
        return await registerTransaction(userId, amount, bonusType, description, creditResult.data);
    } else {
        return { success: false, message: "Falha na requisição à API da Prefeitura." };
    }
}

export async function processAndCreditActivity(userId, distanceKm, timeMinutes, activityType) {
    // 1 Validação Anti-Fraude
    const isValid = (distanceKm >= 0.1 && timeMinutes >= 1) && 
                    (!timeMinutes || (distanceKm / (timeMinutes / 60)) <= MAX_SPEED_KPH);

    if (!isValid) return { success: false, message: "Atividade rejeitada: Anti-Fraude." };

    // 2 Calcula Capibas
    const capibasToCredit = calculateCapibas(distanceKm);
    const details = `${distanceKm.toFixed(2)} km, ${timeMinutes} min`;

    // 3 API Prefeitura
    const creditResult = await requestCapibaCredit(userId, capibasToCredit, details);

    if (creditResult.success) {
        // 4 Salva no banco
        return await registerTransaction(userId, capibasToCredit, activityType, details, creditResult.data);
    } else {
        return { success: false, message: "Falha na requisição à API da Prefeitura." };
    }
}