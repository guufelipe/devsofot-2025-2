import React, { useState, useEffect } from 'react';
import CapibaraIcon from '../../assets/icon.png';
import StartButton from '../../components/StartButton/Start';
import CardDesafio from '../../components/CardsDesafio/CardDesafio';
import { getUserBalance } from '../../../services/api/BalanceApiClient';

function Home() {
    const [saldo, setSaldo] = useState(0);

    // Vamos usar o loading apenas para a PRIMEIRA vez que a tela abre
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    useEffect(() => {
        // Função que busca o saldo
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

        // 1. Busca imediata
        buscarSaldo();

        // 2. Busca recorrente a cada 5 segundos
        const intervalo = setInterval(() => {
            buscarSaldo();
        }, 5000);

        // 3. Limpeza do intervalo
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="home-container">
            <div className="extrato-container">
                <h2 className="extrato-titulo">Extrato de Capibas</h2>

                <div className="total-acumulado-box">
                    <div className="icone-capibara-wrapper">
                        <img
                            src={CapibaraIcon}
                            alt="Ícone de Capibara"
                            className="icone-capibara"
                        />
                    </div>

                    <div className="texto-valor-wrapper">
                        <p className="texto-acumulado">Total Acumulado</p>

                        <span className="valor-acumulado">
                            {isFirstLoading ? "..." : saldo}
                        </span>
                    </div>

                    <div className="icones-moeda-wrapper">
                        <span className="icone-moeda um" aria-hidden="true"></span>
                        <span className="icone-moeda dois" aria-hidden="true"></span>
                    </div>
                </div>
            </div>

            <div className="StartButton">
                <StartButton onClick={() => alert('Atividade Iniciada!')} />
            </div>

            <div className="CardsDesafios"></div>
        </div>
    );
}

export default Home;
