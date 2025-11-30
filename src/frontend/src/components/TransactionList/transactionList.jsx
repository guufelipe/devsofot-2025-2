import React, { useEffect, useState } from 'react';
import { getUserTransactions } from '../../services/balanceService'; 
import '../../pages/style/style.css'; 

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // ✅ novo estado de erro

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getUserTransactions();

        // ✅ Se a API não retornar nada válido, usa mock
        if (!data || !Array.isArray(data)) {
          throw new Error("Resposta inválida da API");
        }

        setTransactions(data);
      } catch (error) {
        console.error("Erro ao carregar extrato:", error);
        setError(true);

        // ✅ MOCK DE SEGURANÇA (pra você conseguir apresentar a tela)
        const mockData = [
          {
            origem: "Caminhada",
            data: new Date().toISOString(),
            valor: 10
          },
          {
            origem: "Corrida",
            data: new Date().toISOString(),
            valor: 20
          }
        ];

        setTransactions(mockData);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return <div className="transacao-loading">Carregando extrato...</div>;
  }

  // -------------------------
  // ERRO
  // -------------------------
  if (error && transactions.length === 0) {
    return <div className="transacao-vazia">Erro ao carregar transações.</div>;
  }

  // -------------------------
  // SUCESSO / VAZIO
  // -------------------------
  return (
    <div className="transacao-container">
      <h2 className="transacao-titulo">Extrato de Ganhos</h2>
      
      {transactions.length === 0 ? (
        <p className="transacao-vazia">Nenhuma transação encontrada.</p>
      ) : (
        <ul className="transacao-lista">
          {transactions.map((t, index) => (
            <li key={index} className="transacao-item">
              <div className="transacao-info">
                <span className="transacao-origem">{t.origem}</span>
                <span className="transacao-data">
                  {new Date(t.data).toLocaleDateString('pt-BR')} às{" "}
                  {new Date(t.data).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <span className="transacao-valor">
                + {t.valor} Capibas
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}