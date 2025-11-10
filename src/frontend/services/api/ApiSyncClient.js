// src/frontend/services/api/ApiSyncClient.js

import axios from 'axios';
import { getCurrentUserId } from '../health/healthService';

// Deve ser configurado via variável de ambiente do React Native
const BACKEND_API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:3000/api/v1'; 

/**
 * Task HU1-1: Envia os dados de atividade validados para o endpoint de sincronização do Backend.
 * @param {object} activityData - Dados formatados de collectLatestActivityData().
 * @returns {Promise<{success: boolean, message: string, credited?: number}>}
 */
export async function sendActivityToBackend(activityData) {
    const userId = getCurrentUserId();
    const syncUrl = `${BACKEND_API_BASE_URL}/activities/sync`;

    const payload = {
        userId: userId,
        distanceKm: parseFloat(activityData.distanceKm),
        timeMinutes: activityData.timeMinutes,
        activityType: 'RUN_WALK_CYCLE', 
        startTime: activityData.startTime
        // O backend precisa de todos esses dados para as regras (HU1-4)
    };
    
    // ** Ponto de Chamada da API da Prefeitura **
    // O código Mobile (FRONTEND) chama o SEU BACKEND.
    // O BACKEND, por sua vez, chama a API da Prefeitura.

    try {
        console.log("[Mobile] Enviando sincronização de atividade para Backend:", syncUrl);
        
        const response = await axios.post(syncUrl, payload);

        // O backend deve retornar 202 Accepted (Task HU1-4 - Assíncrono)
        if (response.status === 202) {
            return { 
                success: true, 
                message: response.data.message || "Sincronização iniciada com sucesso.",
                // O backend pode, opcionalmente, retornar o valor esperado do crédito
                credited: response.data.credited 
            };
        }

    } catch (error) {
        // Capturar e formatar erros do backend (ex: Anti-Fraude rejeitou a atividade)
        const errorMessage = error.response?.data?.error || error.message;
        console.error("ERRO: Falha ao enviar atividade:", errorMessage);
        return { success: false, error: errorMessage };
    }
    return { success: false, error: "Erro desconhecido na sincronização." };
}