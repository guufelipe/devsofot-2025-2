import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Ajuste conforme seu framework (React Native neste exemplo)

// Importa os estilos específicos do container
import styles from './style/style.css'; // Pode exigir um arquivo de exportação em style.css

// Definição do Container principal
const OnboardingScreen = ({ navigation }) => {
    // 1. Definição dos Hooks de Estado (Fase 1.1)
    const [isLoading, setIsLoading] = useState(true); // Para o status de loading inicial da API
    const [hasCompletedChallenge, setHasCompletedChallenge] = useState(false); // Para a flag welcome_challenge_completed

    // 2. Definição do Hook de Efeito (Fase 1.2: Fetch da API)
    useEffect(() => {
        // A lógica do fetch da API (GET /users/me) virá aqui
        // Por enquanto, vamos simular um delay
        setTimeout(() => {
            setIsLoading(false); // Finaliza o loading após o delay simulado
            // setHasCompletedChallenge(false); // Manter como 'false' para ver a tela inicialmente
        }, 1500); // Simula 1.5 segundos de carregamento
    }, []); // Array de dependências vazio: executa apenas na montagem

    // 3. Lógica de Redirecionamento (Fase 1.3 - Implementação Total na Próxima Etapa)
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Carregando dados do usuário...</Text>
            </View>
        );
    }

    if (hasCompletedChallenge) {
        // **NÃO IMPLEMENTAR AQUI AGORA** - O Redirecionamento é a lógica final da Fase 1.3.
        // navigation.navigate('Home'); 
        // return null; 
        
        // Retornamos uma mensagem para visualização temporária:
         return (
             <View style={styles.centerContainer}>
                 <Text>Usuário já completou o desafio. Redirecionando...</Text>
             </View>
         );
    }
    
    // 4. Renderização Principal (Onde o fluxo do tutorial será construído)
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Bem-vindo ao CapibaFit!</Text>
            <Text>Aqui você irá construir o fluxo do tutorial e desafio.</Text>
            {/* O fluxo de slides e o ChallengeCard virão aqui (Fase 2) */}
        </View>
    );
};

// Exporta o componente
export default OnboardingScreen;

// Implementação básica dos estilos (deve ser transferida para style/style.css)
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
// Nota: Em React Native, você deve garantir que os estilos sejam importados e aplicados corretamente.
// Se você estiver usando um framework como Expo/React Native, a importação de style.css pode precisar de uma etapa extra.
// Para fins de visualização inicial, usei o baseStyles.