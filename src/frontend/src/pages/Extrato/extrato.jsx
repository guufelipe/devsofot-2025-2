import React from 'react';
import TransactionList from '../../components/TransactionList/transactionList.jsx'; // Importa sua lista pronta

export default function Extrato() {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Seu Histórico</h2>
      {/* Aqui reutilizamos o componente que você já tinha! */}
      <TransactionList />
    </div>
  );
}