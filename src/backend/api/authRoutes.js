// src/backend/api/authRoutes.js 

import express from 'express';
import { query } from '../database/db_connection.js';
import bcrypt from 'bcrypt';
import { grantWelcomeSignupBonus } from '../services/rewardEngine.js'; // <- Importa o serviço de bônus

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, height, weight, goal } = req.body;

        if (!name || !email || !password || !height || !weight || !goal) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verifica se e-mail já existe
        const check = await query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'E-mail já cadastrado' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (name, email, password_hash, height, weight, goal, capiba_balance, welcome_challenge_completed, current_streak_count, last_activity_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING user_id, name, email, height, weight, goal, capiba_balance`;

        const result = await query(
            sql,
            [
                name,
                email,
                password_hash,
                height,
                weight,
                goal,
                0,     // $7: capiba_balance (INICIA EM 0) <--- ALTERADO DE 50 PARA 0
                'N',    // $8: welcome_challenge_completed
                0      // $9: current_streak_count
            ]
        );

        const newUser = result.rows[0];
        
        // CHAMA O SERVIÇO DE BÔNUS (Task 4) para creditar 50 Capibas, registrar a transação e marcar a flag.
        await grantWelcomeSignupBonus(newUser.user_id); 

        // ATUALIZA O OBJETO DE RESPOSTA para refletir o saldo real (50) concedido pelo serviço.
        newUser.capiba_balance = 50; 

        res.status(201).json({
            message: 'Cadastro concluído! Você ganhou 50 Capibas do desafio de boas-vindas!', 
            user: newUser
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;