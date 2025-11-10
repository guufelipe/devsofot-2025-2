// src/frontend/services/BalanceService.js

// Importamos o getCurrentUserId do serviço de saúde para fins de teste
import { getCurrentUserId } from './health/healthService.js'; 

async function calculateBalanceFromTransactions(userId) {
    const response = await fetch(`/api/v1/users/${userId}/transactions`); 
    
    if (response.ok) {
        const data = await response.json();
        // A chave 'valor' é a que você definiu no seu routes.js
        const totalCapibas = data.transactions.reduce((sum, t) => sum + t.valor, 0);
        
        return totalCapibas;
    }
    return 0; 
}

/**
 * Função principal para atualizar o display do saldo na UI (HU1.7).
 */
export async function updateBalanceDisplay(userId = getCurrentUserId()) {
    const newBalance = await calculateBalanceFromTransactions(userId);
    
    // Supondo que existe um elemento na tela com este ID
    const balanceElement = document.getElementById('capiba-balance-field');
    
    if (balanceElement) {
        balanceElement.textContent = newBalance.toString();
        // Feedback visual sutil (HU1.6) após a atualização
    }
}