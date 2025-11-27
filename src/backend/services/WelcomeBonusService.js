import { query } from "../database/db_connection.js";
// Se você tiver esse arquivo, pode manter. Se não, use o valor fixo abaixo.
import { calculateWelcomeBonus } from "../services/rewardEngine.js";

export const WelcomeBonusService = {

  async execute(user_id) {
    // 1. Iniciar Transação (Segurança para garantir que tudo grava ou nada grava)
    await query('BEGIN');

    try {
        // 2. Verificar se usuário existe + status da flag
        // Ajuste: Certifique-se que a coluna 'welcome_challenge_completed' existe na tabela users
        const userRes = await query(
            "SELECT welcome_challenge_completed FROM users WHERE user_id = $1",
            [user_id]
        );

        if (userRes.rows.length === 0) {
            throw { status: 404, message: "Usuário não encontrado" };
        }

        if (userRes.rows[0].welcome_challenge_completed === "S") {
            throw { status: 400, message: "O desafio de boas-vindas já foi concluído" };
        }

        // 3. Regra do Bônus
        const KM_CHALLENGE = 1;
        // Se a função calculateWelcomeBonus der erro, use: const bonusCapibas = 500;
        const bonusCapibas = calculateWelcomeBonus(KM_CHALLENGE); 

        // 4. Registrar transação (Tabela transactions)
        // Ajustado para bater com a tabela que você me mostrou (amount_capiba, bonus_origin, etc)
        await query(
            `INSERT INTO transactions
            (user_id, amount_capiba, activity_type, activity_details, bonus_origin)
            VALUES ($1, $2, 'bonus', 'Desafio de boas-vindas (1 km)', 'welcome_challenge')`,
            [user_id, bonusCapibas]
        );

        // 5. Atualizar saldo e marcar flag (Tabela users)
        // CORREÇÃO CRÍTICA: Mudamos de 'balance' para 'capiba_balance'
        // COALESCE: Se o saldo for null, considera como 0 antes de somar
        await query(
            `UPDATE users
            SET capiba_balance = COALESCE(capiba_balance, 0) + $1,
                welcome_challenge_completed = 'S'
            WHERE user_id = $2`,
            [bonusCapibas, user_id]
        );

        // Se tudo deu certo, confirma as mudanças no banco
        await query('COMMIT');
        
        return { bonus: bonusCapibas };

    } catch (error) {
        // Se algo der errado, desfaz tudo
        await query('ROLLBACK');
        
        // Repassa o erro para o controller tratar
        // Se o erro já tiver status (ex: 400 ou 404), mantém. Se não, vira 500.
        const finalError = new Error(error.message || "Erro interno ao processar bônus");
        finalError.status = error.status || 500;
        throw finalError;
    }
  }
};