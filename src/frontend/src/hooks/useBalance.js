import { useState, useEffect } from 'react';
import { getUserBalance } from '../services/balanceService'; // Ajuste o caminho conforme necessário

/**
 * Hook para gerenciar o saldo do usuário com atualização automática (Polling).
 * @param {number} intervalMs - Tempo em milissegundos para atualização (Padrão: 5000ms)
 */
export function useBalance(intervalMs = 5000) {
    const [saldo, setSaldo] = useState(0);
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    useEffect(() => {
        const buscarSaldo = async () => {
            try {
                const novoSaldo = await getUserBalance();
                setSaldo(novoSaldo);
            } catch (error) {
                console.error("Erro ao atualizar saldo:", error);
            } finally {
                setIsFirstLoading(false);
            }
        };

        buscarSaldo();

        const intervalo = setInterval(() => {
            buscarSaldo();
        }, intervalMs);

        return () => clearInterval(intervalo);

    }, [intervalMs]); 

    return { saldo, isFirstLoading };
}