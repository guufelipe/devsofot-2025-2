import express from 'express';
import { query } from '../database/db_connection.js';
import { addActivityToQueue } from '../services/QueueService.js';
import { WelcomeBonusService } from "../services/WelcomeBonusService.js";
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
// ROTA: Saldo do usuário (CORRIGIDA)
// --------------------------------------------------
router.get('/users/:userId/balance', async (req, res) => {
    const userId = req.params.userId;
    
    // LOG 1: Ver quem está chamando
    console.log("--> [API] Buscando saldo para o ID:", userId);

    // SQL com proteção contra valor nulo (COALESCE)
    // Se capiba_balance for null, retorna 0
    const sql = `
        SELECT COALESCE(capiba_balance, 0) as total
        FROM users
        WHERE user_id = $1
        LIMIT 1;
    `;

    try {
        const { rows } = await query(sql, [userId]);
        
        // LOG 2: Ver o que o banco devolveu
        console.log("--> [DB] Resultado do banco:", rows);

        if (!rows.length) {
            console.log("--> [ERRO] Usuário não encontrado no banco.");
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // --- CORREÇÃO AQUI ---
        // Pegamos o valor 'total' que veio do banco e guardamos na variável valorFinal
        const valorFinal = rows[0].total;

        // Agora a variável existe e pode ser enviada
        return res.status(200).json({ balance: valorFinal });

    } catch (error) {
        console.error("--> [ERRO CRÍTICO]:", error);
        return res.status(500).json({ error: "Erro interno." });
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
// ROTA: Welcome Challenge Bônus
// --------------------------------------------------
router.post('/challenges/welcome', async (req, res) => {
    // Tenta ler o ID de todas as formas possíveis (userId, user_id ou id)
    const id = req.body.userId || req.body.user_id || req.body.id;

    console.log("Recebida requisição Welcome. ID extraído:", id);

    // 1. Validação: Se não tiver ID, avisa o erro
    if (!id) {
        return res.status(400).json({ error: "O campo 'userId' ou 'user_id' é obrigatório!" });
    }

    try {
        // 2. Atualiza o banco de dados
        // (Certifique-se que o nome da coluna no banco é 'welcome_challenge_completed')
        const query = "UPDATE users SET welcome_challenge_completed = 'S' WHERE id = $1 RETURNING *";
        
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
             return res.status(404).json({ error: "Usuário não encontrado no Banco de Dados." });
        }

        // 3. Sucesso!
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
// ROTA: Verificar Status do Usuário (Novo)
// --------------------------------------------------
router.get('/users/me', async (req, res) => {
    // O frontend manda ?userId=1, então pegamos do query
    const userId = req.query.userId; 

    if (!userId) {
        return res.status(400).json({ error: "userId obrigatório" });
    }

    try {
        // Ajuste 'welcome_challenge_completed' para o nome real da sua coluna no banco
        // Se sua tabela não tem essa coluna, use apenas 'user_id' para testar se o usuário existe
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
// ROTA: Pular Desafio (Marca como visto, mas sem bônus)
// --------------------------------------------------
router.post("/challenges/skip", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id obrigatório" });

  try {
    // Apenas marca que o usuário já passou pelo onboarding
    // para não mostrar a tela novamente.
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

router.patch('/users/:user_id', async (req, res) => {
    const { id } = req.params;
    const { first_login } = req.body; // Pega o valor enviado pelo React

    try {
        // Se você estiver usando query SQL pura:
        if (first_login !== undefined) {
             await pool.query(
                 'UPDATE users SET first_login = $1 WHERE user_id = $2', 
                 [first_login, id]
             );
        }
        
        res.status(200).json({ message: "Usuário atualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar" });
    }
});




// --------------------------------------------------
// EXPORT — TEM QUE SER A ÚLTIMA LINHA
// --------------------------------------------------
export default router;