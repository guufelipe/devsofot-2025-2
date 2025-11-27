// Motor de recompensa: calcula quantas 'capibas' creditar por atividade,
// valida a atividade quanto a plausibilidade (anti-fraude), solicita o
// crédito à API externa (Prefeitura) e registra a transação localmente.


// Contrato / exportações:
// - calculateCapibas(distanceKm): number
// - processAndCreditActivity(userId, distanceKm, timeMinutes, activityType): Promise<{success, ...}>


// Variáveis de ambiente relevantes:
// - CAPIBA_PER_KM: fator (capibas por km). Se não definido, usa 30.

// Observações operacionais:
// - O módulo NÃO faz rollback automático na Prefeitura caso o registro local falhe;
//   esse comportamento exige uma política de estorno/compensação entre as equipes.

// - A função processAndCreditActivity retorna objetos simples com success=true/false
//   e mensagem/erro para que a camada superior (rotas) converta em respostas HTTP.

import { requestCapibaCredit } from '../integrations/capibaApi.js';
import { query } from '../database/db_connection.js';

// --- Regras de Negócio ---
// Fator que converte distância (km) em Capibas. Pode ser string via env; coerce se necessário.
const CAPIBA_FACTOR = Number(process.env.CAPIBA_PER_KM) || 30; // Capibas por km
const MAX_SPEED_KPH = 25; // Limite anti-fraude (atividades com velocidade maior são rejeitadas)

/**
 * calculateCapibas
 * -----------------
 * Converte a distância em capibas usando o fator configurável.
 * - Usa Math.floor para garantir um inteiro (não credita frações).
 *
 * Entrada:
 * - distanceKm {number}
 * Saída:
 * - {number} capibas inteiras
 */
export function calculateCapibas(distanceKm) {
    // Regra básica: capibas = floor(distanceKm * fator)
    return Math.floor(distanceKm * CAPIBA_FACTOR);
}

/**
 * validateActivity
 * ----------------
 * Verifica regras simples de plausibilidade para evitar fraudes básicas:
 * - distancia mínima e tempo mínimo
 * - velocidade calculada não deve exceder MAX_SPEED_KPH
 *
 * Retorna true quando a atividade parece plausível.
 */
function validateActivity(distanceKm, timeMinutes) {
    // Rejeita atividades absurdamente curtas/rapidas
    if (distanceKm < 0.1 || timeMinutes < 1) return false;

    if (timeMinutes > 0) {
        // velocidade em km/h
        const speedKPH = distanceKm / (timeMinutes / 60);
        if (speedKPH > MAX_SPEED_KPH) {
            // Atividade com velocidade física impossível (ex.: viagem de carro) => suspeita de fraude
            return false;
        }
    }
    return true;
}

/**
 * processAndCreditActivity
 * ------------------------
 * Fluxo principal:
 * 1) valida a atividade (anti-fraude)
 * 2) calcula quantas capibas creditar
 * 3) solicita crédito à API da Prefeitura (requestCapibaCredit)
 * 4) registra a transação localmente no banco
 *
 * Entrada:
 * - userId {string}
 * - distanceKm {number}
 * - timeMinutes {number}
 * - activityType {string}
 *
 * Retorno: Promise que resolve para um objeto com { success: boolean, ... }
 * - On success: { success: true, credited, details }
 * - On external API failure: { success: false, message }
 * - On DB failure after external success: { success: false, message }
 *
 * Importante:
 * - Idempotência: o endpoint externo deve ser chamado com cautela se houver risco de reenvio
 *   (p.ex. insira um request id único nos headers/payload). Aqui não implementamos idempotency.
 * - Transações distribuídas: como a operação envolve um sistema externo, é necessário um
 *   acordo sobre compensações/estornos caso o registro local falhe após o crédito ser concedido.
 */
export async function processAndCreditActivity(userId, distanceKm, timeMinutes, activityType) {
    // 1) Valida plausibilidade da atividade
    if (!validateActivity(distanceKm, timeMinutes)) {
        return { success: false, message: "Atividade rejeitada pela validação Anti-Fraude." };
    }

    // 2) Calcula quantas capibas creditar
    const capibasToCredit = calculateCapibas(distanceKm);
    const details = `${distanceKm.toFixed(2)} km, ${timeMinutes} min`;

    // 3) Solicita crédito ao serviço central (Prefeitura)
    //    requestCapibaCredit encapsula a chamada HTTP e retorna { success, data?, error? }
    const creditResult = await requestCapibaCredit(userId, capibasToCredit, details);

    if (creditResult.success) {
        // 4) Persiste transação localmente
        const transactionSql = `
            INSERT INTO transactions (user_id, amount_capiba, activity_type, activity_details, external_ref_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const transactionParams = [
            userId,
            capibasToCredit,
            activityType,
            details,
            // se a API externa devolveu um id de transação, tenta armazenar para rastreabilidade
            (creditResult.data && creditResult.data.transaction_id) ? creditResult.data.transaction_id : null
        ];

        // após inserir a transação
        try {
            await query(transactionSql, transactionParams);

            // Atualiza saldo do usuário (incrementa)
            const updateBalanceSql = `
                UPDATE users
                SET balance = balance + $1
                WHERE id = $2
                RETURNING balance;
            `;
            const updateResult = await query(updateBalanceSql, [capibasToCredit, userId]);

            // opcional: ler o saldo atualizado
            const newBalance = updateResult.rows && updateResult.rows[0] ? updateResult.rows[0].balance : null;

            return { success: true, credited: capibasToCredit, details, balance: newBalance };
        } catch (dbError) {
            console.error("Erro ao registrar transação no BD local:", dbError);
            return { success: false, message: "Crédito na Capiba OK, mas falha no registro local." };
        }

    } else {
        // Falha ao comunicar com a Prefeitura ou erro retornado por ela
        return { success: false, message: "Falha na requisição à API da Prefeitura." };
    }
}

// Função adicional: calcula bônus de boas-vindas (2x capibas normais)
// Usada pelo WelcomeBonusService.js
export function calculateWelcomeBonus(km) {
    return calculateCapibas(km) * 2;  // 2x
}
