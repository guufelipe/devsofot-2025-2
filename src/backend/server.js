// DEBUG: conferir variáveis carregadas
// Agora elas devem aparecer corretamente no terminal
console.log("DEBUG ENV:", {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD, // Verifique se a senha aparece aqui
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

console.log("TIPOS:", {
  DB_USER: typeof process.env.DB_USER,
  DB_PASSWORD: typeof process.env.DB_PASSWORD,
  RAW_PASSWORD: process.env.DB_PASSWORD,
});

// 2. IMPORTS DO SERVIDOR
import express from 'express';
import cors from 'cors';
import apiRouter from './api/routes.js';
import { query } from './database/db_connection.js';

// 3. FUNÇÃO DE TESTE DE CONEXÃO COM O BANCO
async function testDatabaseConnection() {
  try {
    await query('SELECT 1');
    console.log('💾 Conectado ao PostgreSQL com sucesso.');
  } catch (err) {
    console.error('❌ ERRO ao conectar ao PostgreSQL:', err);
  }
}

// 4. CONFIGURAÇÃO DO SERVIDOR EXPRESS
const app = express();
const PORT = 3001;
const FRONTEND_URL = 'http://localhost:5173';

// CORS
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));

// JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.json()); // Redundante, mas não quebra. Pode manter ou remover essa linha duplicada.

// 5. REGISTRO DAS ROTAS
// Todas as rotas em routes.js começarão com /api
// Ex: /api/v1/users/1/balance
app.use('/api', apiRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

// 6. INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Express rodando na porta ${PORT}`);
    console.log(`Aguardando requisições de ${FRONTEND_URL}`);

    await testDatabaseConnection();
});