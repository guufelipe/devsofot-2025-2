import api from './api'; // Usa o mestre que criamos acima
import { getCurrentUserId } from './healthService';

/**
 * Busca o saldo total consolidado do usuário.
 */
export async function getUserBalance() {
    const userId = getCurrentUserId();
    try {
        const response = await api.get(`/users/${userId}/balance`);
        // Tratamento robusto: pega .balance, ou .data, ou retorna 0
        return response.data.balance ?? response.data ?? 0;
    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        throw error; // Lança o erro para o componente decidir o que fazer (ex: mostrar "...")
    }
}

/**
 * Busca a lista de transações (para o extrato).
 */
export async function getUserTransactions() {
    const userId = getCurrentUserId();
    try {
        const response = await api.get(`/users/${userId}/transactions`);
        return response.data.transactions || [];
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
        return [];
    }
}