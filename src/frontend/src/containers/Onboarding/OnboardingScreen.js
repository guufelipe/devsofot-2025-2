import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios'; 
// Garante que o arquivo de estilos seja importado corretamente
import styles from './style/style.css'; 

// Endereço base da API utilizada pelo app (executando na porta 3001)
const API_URL = 'http://localhost:3001/api'; 

const OnboardingScreen = ({ navigation }) => {

    // -----------------------------
    // 1. Estados do componente
    // -----------------------------
    const [isLoading, setIsLoading] = useState(true);                 // Controla exibição de loading
    const [hasCompletedChallenge, setHasCompletedChallenge] = useState(false); // Flag do desafio concluído

    // -----------------------------
    // 2. Carregamento do status do usuário ao montar o componente
    // -----------------------------
    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                // Chama o endpoint que retorna a flag de conclusão do desafio
                // userId=1 é usado provisoriamente, pois ainda não há login implementado
                const response = await axios.get(`${API_URL}/users/me?userId=1`);
                const userData = response.data;

                // A flag vem como 'S' (sim) ou 'F' (não). Interpretamos isso para boolean.
                const isCompleted = userData && userData.welcome_challenge_completed === 'S';
                setHasCompletedChallenge(isCompleted);

            } catch (error) {
                // Em caso de falha (exemplo: usuário não encontrado), 
                // assumimos que o usuário ainda não completou o desafio,
                // garantindo a exibição da tela de onboarding.
                console.error("Erro ao buscar status do usuário. Exibindo Onboarding por segurança.", error);
                setHasCompletedChallenge(false);

            } finally {
                // Finaliza o estado de loading, independentemente do resultado.
                setIsLoading(false);
            }
        };

        fetchUserStatus();
    }, []); // Executa uma única vez, quando o componente é montado

    // -----------------------------
    // 3. Controle de fluxo: loading e redirecionamento
    // -----------------------------
    
    // Enquanto os dados não chegam, mostramos um indicador de carregamento.
    if (isLoading) {
        return (
            <View style={baseStyles.centerContainer}>
                <Text>Carregando dados do usuário...</Text>
            </View>
        );
    }

    // Se o usuário já completou o desafio, ele não deve ver a tela de onboarding.
    if (hasCompletedChallenge) {
        // A navegação real será implementada futuramente.
        // navigation.navigate('Home');

        // Temporariamente exibimos uma mensagem para fins de teste.
        return (
            <View style={baseStyles.centerContainer}>
                <Text>Usuário já completou o desafio. Redirecionando para a Home...</Text>
            </View>
        );
    }

    // -----------------------------
    // 4. Renderização principal (Fluxo do tutorial)
    // -----------------------------
    return (
        <View style={baseStyles.mainContainer}>
            <Text style={baseStyles.title}>Bem-vindo ao CapibaFit!</Text>
            <Text>Aqui você irá construir o fluxo do tutorial e desafio.</Text>
            {/* Os slides e o ChallengeCard serão adicionados aqui futuramente */}
        </View>
    );
};

// Exporta o componente principal da tela
export default OnboardingScreen;

// Estilos básicos do layout (depois poderão ser movidos para style/style.css)
const baseStyles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    }
});


// Lembre-se: Em um ambiente real, o Worker seria um processo Node.js separado,
// e a fila seria gerenciada por uma biblioteca como BullMQ com Redis.
// Aqui, tudo está simplificado para fins de demonstração.