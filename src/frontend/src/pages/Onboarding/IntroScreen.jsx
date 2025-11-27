import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

import WelcomeSlide from '../../components/Onboarding/WelcomeSlide.jsx';

// --- IMPORTAÇÕES CORRIGIDAS (Baseado no seu print) ---
import MascoteIcon from '../../assets/icon.png';        // Seu mascote
import PegadaIcon from '../../assets/pegada.png';       // pegada.png (minúsculo)
import TrophyIcon from '../../assets/trofeu-img.png';   // trofeu-img.png (minúsculo)
import LocationIcon from '../../assets/Location.png';   // Location.png (Maiúsculo)
import RaioIcon from '../../assets/Raio.png';           // Raio.png (Maiúsculo)

const API_URL = 'http://localhost:3001/api'; 
const userIdToTest = 1; 

const testStyles = {
    fullScreenContainer: { display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 20, background: '#faf6f0' },
    centerContainer: { display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: { background: '#00cc66', color: 'white', padding: 16, borderRadius: 12, border: 'none', width: '90%', margin: '10px auto', fontSize: 18, fontWeight: 'bold' },
    skipButton: { background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', marginTop: 10, fontSize: 14 }
};

const SLIDE_DATA = [
    { 
        id: 1, 
        icon: PegadaIcon, // Tenta usar a pegada. Se der erro, troque por MascoteIcon
        title: 'Cada passo conta!', 
        description: 'Transforme suas caminhadas, corridas e atividades físicas em recompensas reais.'
    },
    { 
        id: 2, 
        icon: TrophyIcon, 
        title: 'Ganhe Capibas', 
        description: 'Nossa moeda digital exclusiva que premia seu esforço e dedicação aos exercícios.'
    },
    { 
        id: 3, 
        icon: LocationIcon, 
        title: 'Explore Recife', 
        description: 'Visite pontos turísticos da cidade e ganhe bônus em Capibas ao se exercitar nesses locais.'
    },
    { 
        id: 4, 
        icon: RaioIcon, 
        title: 'Desafios e Conquistas', 
        description: 'Complete metas, mantenha sequências ativas e desbloqueie medalhas especiais!'
    }
];

const IntroScreen = () => {
    const navigate = useNavigate();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 

    const finalizarTutorial = async (destino) => {
        try {
            await axios.patch(`${API_URL}/users/${userIdToTest}`, { first_login: false });
            navigate(destino, { replace: true });
        } catch (error) {
            console.error("Erro first_login:", error);
            navigate(destino, { replace: true });
        }
    };

    const handleNext = () => {
        const isLastSlide = currentSlideIndex === SLIDE_DATA.length - 1;
        if (isLastSlide) {
            finalizarTutorial('/welcome-challenge');
        } else {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const handleSkip = () => {
        finalizarTutorial('/home');
    };

    const currentSlide = SLIDE_DATA[currentSlideIndex];
    const isLastSlide = currentSlideIndex === SLIDE_DATA.length - 1;

    // --- PROTEÇÃO CONTRA ERRO ---
    // Se a imagem não carregar, usamos o Mascote como fallback para não travar a tela
    const imagemSegura = currentSlide.icon || MascoteIcon;

    return (
        <div style={testStyles.fullScreenContainer}>
             <div style={testStyles.centerContainer}>
                <WelcomeSlide 
                    title={currentSlide.title} 
                    description={currentSlide.description} 
                    icon={imagemSegura} 
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                <button style={testStyles.button} onClick={handleNext}>
                    {isLastSlide ? 'Vamos lá!' : 'Próximo'}
                </button>
                <button style={testStyles.skipButton} onClick={handleSkip}>
                    Pular introdução
                </button>
            </div>
        </div>
    );
};

export default IntroScreen;