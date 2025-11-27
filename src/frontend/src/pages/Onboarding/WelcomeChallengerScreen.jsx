import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import ChallengeCard from '../../components/Onboarding/ChallengeCard.jsx'; 

const API_URL = 'http://localhost:3001/api'; 
const userIdToTest = 1; 

const WelcomeChallengeScreen = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false); 

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            await axios.post(`${API_URL}/challenges/welcome`, { 
                userId: userIdToTest
            });
            alert("Desafio Aceito! 500 Capibas garantidas.");
            // Aceitou? Vai para a aba de desafios ver o progresso
            navigate('/desafios', { replace: true });
        } catch (error) {
            console.error(error);
            alert("Erro ao aceitar.");
            setIsProcessing(false);
        }
    };

    const handleSkip = () => {
        // Se pular aqui, vai pra Home. Só vê de novo se clicar na aba Desafios.
        navigate('/home', { replace: true }); 
    };

    return (
        <ChallengeCard 
            onAccept={handleAccept} 
            onSkip={handleSkip} 
            isAccepting={isProcessing} 
        />
    );
};

export default WelcomeChallengeScreen;