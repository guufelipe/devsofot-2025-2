import { query } from "../database/db_connection.js";
import { calculateWelcomeBonus } from "../services/rewardEngine.js";

export const WelcomeBonusService = {

  async execute(user_id) {

    // 1. Verificar se usuário existe + status da flag
    const userRes = await query(
      "SELECT welcome_challenge_completed FROM users WHERE user_id = $1",
      [user_id]
    );

    if (userRes.rows.length === 0) {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      throw err;
    }

    if (userRes.rows[0].welcome_challenge_completed === "S") {
      const err = new Error("O desafio de boas-vindas já foi concluído");
      err.status = 400;
      throw err;
    }

    // 2. Regra: desafio = 1 km
    const KM_CHALLENGE = 1;
    const bonusCapibas = calculateWelcomeBonus(KM_CHALLENGE); // usa factor=30 → 60 capibas

    // 3. Registrar transação local
    await query(
      `INSERT INTO transactions
        (user_id, amount_capiba, activity_type, activity_details, bonus_origin)
       VALUES ($1, $2, 'bonus', 'Desafio de boas-vindas (1 km)', 'welcome_challenge')`,
      [user_id, bonusCapibas]
    );

    // 4. Atualizar saldo e marcar flag
    await query(
      `UPDATE users
       SET balance = balance + $1,
           welcome_challenge_completed = 'S'
       WHERE user_id = $2`,
      [bonusCapibas, user_id]
    );

    return { bonus: bonusCapibas };
  }
};
