import express from 'express';
import { query } from '../database/db_connection.js';
import { addActivityToQueue } from '../services/QueueService.js';
// Serviço responsável pelo processamento de bônus de boas-vindas.
// Necessário para o fluxo assíncrono via Worker (QueueService).
import { WelcomeBonusService } from '../services/WelcomeBonusService.js';

const welcomeBonusService = new WelcomeBonusService();

const router = express.Router();

// ==================================================================
// IMPORTANTE SOBRE OS ENDPOINTS:
// O arquivo server.js já adiciona automaticamente o prefixo `/api`.
// ==================================================================

// [HU1] Rota de sincronização de atividades físicas.
// Endpoint final: POST http://localhost:3001/api/activities/sync
router.post('/activities/sync', async (req, res) => {
	// Logs para facilitar o debug no servidor.
	console.log('Recebi POST em /activities/sync');
	console.log('Body recebido:', req.body);

	const { userId, distanceKm, timeMinutes, activityType } = req.body;

	// Verificação de dados obrigatórios.
	if (!userId || !distanceKm || !timeMinutes || !activityType) {
		return res.status(400).json({ error: 'Dados de atividade incompletos.' });
	}

	try {
		// Envia a atividade para a fila que será processada por um Worker.
		await addActivityToQueue({ userId, distanceKm, timeMinutes, activityType });

		return res.status(202).json({
			message: 'Atividade recebida e encaminhada para processamento.'
		});
	} catch (error) {
		console.error('Erro ao enfileirar:', error);
		return res.status(500).json({ error: 'Erro interno ao enfileirar a atividade.' });
	}
});

// [HU2] Rota para obter o extrato (últimas 20 transações) do usuário.
// Endpoint final: GET http://localhost:3001/api/users/:userId/transactions
router.get('/users/:userId/transactions', async (req, res) => {
	const userId = req.params.userId;

	// Seleciona as 20 transações mais recentes do usuário.
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
		console.error('Erro ao buscar transações:', error);
		return res.status(500).json({ error: 'Erro ao buscar transações.' });
	}
});

// [HU2/HU3] Rota para consultar o saldo atual do usuário.
// Endpoint final: GET http://localhost:3001/api/users/:userId/balance
router.get('/users/:userId/balance', async (req, res) => {
	const userId = req.params.userId;

	// Observação: a coluna correta da tabela 'users' é 'balance'.
	const sql = `SELECT balance FROM users WHERE user_id = $1 LIMIT 1;`;

	try {
		const { rows } = await query(sql, [userId]);

		if (!rows.length) {
			return res.status(404).json({ error: 'Usuário não encontrado.' });
		}

		// Conversão explícita para número flutuante antes de retornar.
		return res.status(200).json({
			balance: parseFloat(rows[0].balance)
		});

	} catch (error) {
		console.error('Erro ao buscar saldo:', error);
		return res.status(500).json({ error: 'Erro interno.' });
	}
});


// ==================================================================
// ROTAS DA SPRINT 2 / HU4 (Desafio de Boas-Vindas)
// ==================================================================

// 📌 Rota para a FASE 1.2 da OnboardingScreen (Busca de Status)
// O Front-end usa esta rota para buscar a flag 'welcome_challenge_completed'.
router.get('/users/me', async (req, res) => {
	// Busca o ID do query (Front-end envia: ?userId=X)
	const userId = req.query.userId;

	// 🚨 CORREÇÃO CRÍTICA: Substitui 'WHERE id = $1' por 'WHERE user_id = $1' (conforme estrutura do DB).
	const sql = `
		SELECT balance, welcome_challenge_completed AS completed
		FROM users
		WHERE user_id = $1
		LIMIT 1;
	`;

	try {
		const { rows } = await query(sql, [userId]);

		// Se não houver linhas, assumimos que o usuário não existe.
		if (!rows.length) {
			return res.status(404).json({ error: 'Usuário não encontrado.' });
		}

		return res.status(200).json({
			balance: parseFloat(rows[0].balance),
			// A flag é retornada para o Front-end aqui
			welcome_challenge_completed: rows[0].completed
		});
	} catch (error) {
		console.error('Erro ao buscar status do usuário (/me):', error);
		return res.status(500).json({ error: 'Erro interno.' });
	}
});


// 📌 Rota para a FASE 3.2 da OnboardingScreen (Aceite do Desafio)
// O Front-end chama esta rota quando o usuário clica em "Aceitar Desafio".
router.post('/challenges/welcome', async (req, res) => {
	const userId = req.body.userId;

	// O backend registra que o usuário aceitou (mas o crédito só vem após a primeira atividade)
	console.log(`[Challenge] Usuário ${userId} aceitou o desafio de boas-vindas. Próxima atividade será bonificada.`);

	return res.status(202).json({
		message: 'Desafio aceito. O bônus será creditado após a primeira atividade concluída.'
	});
});


export default router;