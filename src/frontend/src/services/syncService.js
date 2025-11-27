import api from './api';
import { getCurrentUserId } from './health/healthService';

export async function sendActivityToBackend(activityData) {
    const userId = getCurrentUserId();
    
    const payload = {
        userId: userId,
        distanceKm: parseFloat(activityData.distanceKm),
        timeMinutes: activityData.timeMinutes,
        activityType: 'RUN_WALK_CYCLE', 
        startTime: activityData.startTime
    };

    try {
        console.log("[Sync] Enviando atividade...");
        // Não precisa mais digitar a URL inteira, o api.js já sabe a base
        const response = await api.post('/activities/sync', payload);

        if (response.status === 202) {
            return { 
                success: true, 
                message: response.data.message || "Sincronização iniciada." 
            };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error("ERRO [Sync]:", errorMessage);
        return { success: false, error: errorMessage };
    }
    return { success: false, error: "Erro desconhecido." };
}