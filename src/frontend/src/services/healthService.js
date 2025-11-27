// src/frontend/services/health/HealthService.js

/**
 * MOCK: Simula a coleta de dados de atividade do Google Fit / Apple Health. -> Na implementação de um produto implementariamos as bibliotecas.
 * @returns {Promise<{distanceKm: number, timeMinutes: number, startTime: string, stepsCount: number}>}
 */
export async function collectLatestActivityData() {
    // Simulação de dados válidos
    const data = {
        distanceKm: (Math.random() * 5 + 3).toFixed(2), // 3.00km a 8.00km
        timeMinutes: Math.floor(Math.random() * 60) + 15, // 15 a 75 minutos
        startTime: new Date().toISOString(), 
        stepsCount: Math.floor(Math.random() * 10000) + 3000, // Passos (relevante para HU3 - Painel de Metas)
    };

    console.log("[Mobile] Dados Mock Coletados:", data);
    return data;
}

/**
 * Obtém o ID do usuário logado (simulação do Conecta Recife).
 * Em um cenário real, este dado viria do estado global (Redux/Context).
 */
export function getCurrentUserId() {
    // MOCK do ID do usuário logado (essencial para o backend)
    return "1"; 
}