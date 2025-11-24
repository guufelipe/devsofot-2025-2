// src/containers/Onboarding/OnboardingScreen.jsx
import Home from '../Home/home'; 
import React, { useState, useEffect } from "react";
import axios from "axios"; 

// FASE 2.1 & 2.2: Importando os componentes de UI
import WelcomeSlide from '../../components/Onboarding/WelcomeSlide.jsx';
import ChallengeCard from '../../components/Onboarding/ChallengeCard.jsx'; 

// Import das imagens reais
import PegadasIcon from '../../assets/pegada.png';
import TrophyIcon from '../../assets/trofeu-img.png';
import LocationIcon from '../../assets/Location.png';
import RaioIcon from '../../assets/Raio.png';

// Task 5 Confetti feedback
import { showConfetti } from "../../../services/confetti.js";

// Mapeamento para React Web
const View = 'div';
const Text = 'p';
const StyleSheet = { create: (s) => s }; 

// URL base da API
const API_URL = 'http://localhost:3001/api'; 

// ESTRUTURA DE DADOS DOS SLIDES (FASE 2.3)
const SLIDE_DATA = [
    { 
        id: 1, 
        icon: PegadasIcon, 
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

// Estilos de teste
const testStyles = {
    centerContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#faf6f0',
    },
    fullScreenContainer: { 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
        height: '100vh',
        backgroundColor: '#faf6f0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        paddingBottom: '20px', 
    },
    button: {
        backgroundColor: '#00cc66',
        color: 'white',
        padding: '16px 20px', 
        borderRadius: '12px', 
        fontSize: 18,
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        width: '90%',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0, 204, 102, 0.3)',
    },
    skipButton: {
        background: 'none',
        border: 'none',
        color: '#666',
        fontSize: 14,
        cursor: 'pointer',
        marginTop: 10,
        textDecoration: 'underline',
        width: '100%',
        textAlign: 'center',
    }
};

const userIdToTest = 'user123'; 

const OnboardingScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true); 
    const [hasCompletedChallenge, setHasCompletedChallenge] = useState(false); 
    
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 
    const [isAcceptingChallenge, setIsAcceptingChallenge] = useState(false); 

    // Fetch inicial
    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/me?userId=${userIdToTest}`);
                const userData = response.data;
                const isCompleted = userData && userData.welcome_challenge_completed === 'S';
                setHasCompletedChallenge(isCompleted);
            } catch (error) {
                console.error("Erro ao buscar status do usuário. Exibindo Onboarding.", error);
                setHasCompletedChallenge(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserStatus();
    }, []); 
    
    const handleNextSlide = () => {
        setCurrentSlideIndex(currentSlideIndex + 1);
    };

    const handleAcceptChallenge = async (shouldAccept) => {
        if (!shouldAccept) {
            setHasCompletedChallenge(true);
            return;
        }

        setIsAcceptingChallenge(true); 

        try {
            const response = await axios.post(`${API_URL}/challenges/welcome`, {
                userId: userIdToTest
            });

            if (response.status === 202) {
                showConfetti();   // Feedback visual da Task 5
                setHasCompletedChallenge(true);
            }

        } catch (error) {
            console.error("[FRONTEND] Erro ao aceitar desafio:", error);
            alert("Erro ao aceitar o desafio.");
        } finally {
            setIsAcceptingChallenge(false);
        }
    };

    if (isLoading) {
        return (
            <View style={testStyles.centerContainer}>
                <Text>Carregando dados do usuário...</Text>
            </View>
        );
    }

    if (hasCompletedChallenge) {
        return <Home />;
    }

    // SLIDES
    const isTutorialSlide = currentSlideIndex < SLIDE_DATA.length;

    if (isTutorialSlide) {
        const currentSlide = SLIDE_DATA[currentSlideIndex];
        const isLastSlide = currentSlideIndex === SLIDE_DATA.length - 1;

        return (
            <View style={testStyles.fullScreenContainer}>
                
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <WelcomeSlide 
                        title={currentSlide.title}
                        description={currentSlide.description}
                        icon={currentSlide.icon}
                    />
                </View>

                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                    <button 
                        style={testStyles.button} 
                        onClick={handleNextSlide}
                    >
                        {isLastSlide ? 'Começar Desafio' : 'Próximo'}
                    </button>

                    <button
                        style={testStyles.skipButton}
                        onClick={() => handleAcceptChallenge(false)}
                    >
                        Pular
                    </button>

                </View>
            </View>
        );
    } 

    return (
        <ChallengeCard 
            onAccept={() => handleAcceptChallenge(true)} 
            onSkip={() => handleAcceptChallenge(false)} 
            isAccepting={isAcceptingChallenge} 
        />
    );
};

export default OnboardingScreen;
