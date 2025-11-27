import express from 'express';
import { query } from '../database/db_connection.js';
import { addActivityToQueue } from '../services/QueueService.js';
// Se não estiver usando o WelcomeBonusService, pode remover a importação abaixo
// import { WelcomeBonusService } from "../services/WelcomeBonusService.js";
import pool from '../database/db_connection.js';

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
// ROTA: Buscar Transações
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
    
    console.log("--> [API] Buscando saldo para o ID:", userId);

    const sql = `
        SELECT COALESCE(capiba_balance, 0) as total
        FROM users
        WHERE user_id = $1
        LIMIT 1;
    `;

    try {
        const { rows } = await query(sql, [userId]);
        
        console.log("--> [DB] Resultado do banco:", rows);

        if (!rows.length) {
            console.log("--> [ERRO] Usuário não encontrado no banco.");
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const valorFinal = rows[0].total;

        return res.status(200).json({ balance: valorFinal });

    } catch (error) {
        console.error("--> [ERRO CRÍTICO]:", error);
        return res.status(500).json({ error: "Erro interno." });
    }
});


// --------------------------------------------------
// ROTA: Teste de DB
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
// ROTA: Welcome Challenge Bônus (CORRIGIDA)
// --------------------------------------------------
router.post('/challenges/welcome', async (req, res) => {
    // Tenta ler o ID de todas as formas possíveis
    const id = req.body.userId || req.body.user_id || req.body.id;

    console.log("Recebida requisição Welcome. ID extraído:", id);

    if (!id) {
        return res.status(400).json({ error: "O campo 'userId' ou 'user_id' é obrigatório!" });
    }

    try {
        // CORREÇÃO: WHERE user_id = $1 (antes estava 'id')
        const query = "UPDATE users SET welcome_challenge_completed = 'S' WHERE user_id = $1 RETURNING *";
        
        // CORREÇÃO: Passamos a variável 'id' que extraímos acima (antes estava 'user_id' que não existia)
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
             return res.status(404).json({ error: "Usuário não encontrado no Banco de Dados." });
        }

        // CORREÇÃO: Removido erro de sintaxe (a barra / solta)
        res.status(200).json({ 
            message: "Desafio aceito!", 
            user: result.rows[0]
        });

    } catch (error) {
        console.error("ERRO NO BACKEND (Welcome):", error);
        res.status(500).json({ error: "Erro interno ao salvar no banco." });
    }
});


// --------------------------------------------------
// ROTA: Verificar Status do Usuário
// --------------------------------------------------
router.get('/users/me', async (req, res) => {
    const userId = req.query.userId; 

    if (!userId) {
        return res.status(400).json({ error: "userId obrigatório" });
    }

    try {
        // CORREÇÃO: Garantindo user_id na query
        const sql = `
            SELECT user_id, welcome_challenge_completed, first_login 
            FROM users 
            WHERE user_id = $1
        `;
        
        const { rows } = await query(sql, [userId]);

        if (rows.length > 0) {
            return res.json(rows[0]);
        } else {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar status do usuário:", error);
        return res.status(500).json({ error: "Erro interno" });
    }
});

// --------------------------------------------------
// ROTA: Pular Desafio
// --------------------------------------------------
router.post("/challenges/skip", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id obrigatório" });

  try {
    await query(
      "UPDATE users SET welcome_challenge_completed = 'S' WHERE user_id = $1",
      [user_id]
    );

    res.status(200).json({ message: "Onboarding pulado. Desafio mantido como pendente." });
  } catch (err) {
    console.error("Erro ao pular desafio:", err);
    res.status(500).json({ error: "Erro interno ao pular." });
  }
});

// --------------------------------------------------
// ROTA: Atualizar First Login (CORRIGIDA)
// --------------------------------------------------
// Note o uso de :user_id na URL
router.patch('/users/:user_id', async (req, res) => {
    // CORREÇÃO: Pegamos 'user_id' do params, pois a rota é /users/:user_id
    const { user_id } = req.params; 
    const { first_login } = req.body;

    try {
        if (first_login !== undefined) {
             // CORREÇÃO: WHERE user_id = $2
             await pool.query(
                 'UPDATE users SET first_login = $1 WHERE user_id = $2', 
                 [first_login, user_id]
             );
        }
        
        res.status(200).json({ message: "Usuário atualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar" });
    }
});

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
export default router;