import express from 'express';
import { query } from '../database/db_connection.js';
import { addActivityToQueue } from '../services/QueueService.js';
import { WelcomeBonusService } from "../services/WelcomeBonusService.js";

const router = express.Router();


// --------------------------------------------------
// ROTA: /activities/sync
// --------------------------------------------------
router.post('/activities/sync', async (req, res) => {
    const { userId, distanceKm, timeMinutes, activityType } = req.body;

    if (!userId || !distanceKm || !timeMinutes || !activityType) {
        return res.status(400).json({ error: "Dados de atividade incompletos." });
    }

    try {
        await addActivityToQueue({ userId, distanceKm, timeMinutes, activityType });
        return res.status(202).json({
            message: "Atividade recebida e encaminhada para processamento."
        });
    } catch (error) {
        console.error("Erro ao enfileirar:", error);
        return res.status(500).json({ error: "Erro interno ao enfileirar a atividade." });
    }
});


// --------------------------------------------------
// ROTA: Extrato do usuário
// --------------------------------------------------
router.get('/users/:userId/transactions', async (req, res) => {
    const userId = req.params.userId;

    const sqlQuery = `
        SELECT 
            amount_capiba AS valor, 
            date_time AS data, 
            activity_type AS origem, 
            activity_details AS detalhes
        FROM transactions
        WHERE user_id = $1
        ORDER BY date_time DESC
        LIMIT 20;
    `;

    try {
        const { rows } = await query(sqlQuery, [userId]);
        return res.status(200).json({ transactions: rows });
    } catch (error) {
        console.error("Erro ao buscar extrato:", error);
        return res.status(500).json({ error: "Erro ao buscar transações." });
    }
});


// --------------------------------------------------
// ROTA: Saldo do usuário
// --------------------------------------------------
router.get('/users/:userId/balance', async (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT balance
        FROM users
        WHERE id = $1
        LIMIT 1;
    `;

    try {
        const { rows } = await query(sql, [userId]);

        if (!rows.length) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.status(200).json({ balance: rows[0].balance });
    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        return res.status(500).json({ error: "Erro interno ao buscar saldo." });
    }
});


// --------------------------------------------------
// ROTA: /test-db
// --------------------------------------------------
router.get('/test-db', async (req, res) => {
    try {
        const result = await query('SELECT NOW()');
        return res.status(200).json({ ok: true, time: result.rows[0].now });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
});


// --------------------------------------------------
// ROTA: WelCome Challenge Bônus
// --------------------------------------------------
router.post("/challenges/welcome", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id é obrigatório" });
    }

    const result = await WelcomeBonusService.execute(user_id);

    res.status(201).json({
      message: "Bônus de boas-vindas concedido!",
      bonus: result.bonus
    });

  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});


// --------------------------------------------------
// EXPORT — TEM QUE SER A ÚLTIMA LINHA
// --------------------------------------------------
export default router;
