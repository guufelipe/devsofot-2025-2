// src/backend/services/WelcomeBonusService.js
import { query } from '../database/db_connection.js';
// Importa o novo método para bônus fixo, já que ele trata da API e do DB
import { processBonusCredit } from './rewardEngine.js'; 

const BONUS_AMOUNT = 50; 
const BONUS_TYPE = 'WELCOME_BONUS'; 
const BONUS_DESC = 'Bônus de Boas-vindas: Primeira atividade completada!';

class WelcomeBonusService {
    
    // Verifica e aplica o bônus se for a primeira atividade.
    // Deve ser chamado DEPOIS que a atividade física foi registrada e creditada

    async processWelcomeBonus(userId) {
        try {
            // CA4: Creditado após o primeiro registro de atividade.
            // Contamos quantas transações de atividade física o usuário já tem no banco
            // (Excluímos o próprio WELCOME_BONUS da contagem para evitar ciclos ou erros)
            const sqlCheck = `
                SELECT count(*) as total 
                FROM transactions 
                WHERE user_id = $1 AND activity_type != $2
            `;
            
            const { rows } = await query(sqlCheck, [userId, BONUS_TYPE]);
            const activityCount = parseInt(rows[0].total);

            // Se o count for 1, significa que a atividade que acabou de ser processada é a primeira
            const isFirstActivity = activityCount === 1; 

            if (!isFirstActivity) {
                return { applied: false, reason: "Usuário já possui atividades anteriores." };
            }

            console.log(`[WelcomeBonus] User ${userId}: Primeira atividade detectada! Creditando bônus...`);
            
            // CHAMA O MÉTODO DO REWARD ENGINE (que usa requestCapibaCredit internamente)
            const result = await processBonusCredit(
                userId, 
                BONUS_AMOUNT, 
                BONUS_TYPE, 
                BONUS_DESC
            );
            
            return { applied: true, result };

        } catch (error) {
            console.error('[WelcomeBonus] Erro ao processar bônus:', error);
            return { error: error.message };
        }
    }
}

export default new WelcomeBonusService();