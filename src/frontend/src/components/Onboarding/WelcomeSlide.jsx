// src/frontend/src/components/Onboarding/WelcomeSlide.jsx
import React from 'react';

// Importa o componente de logo
import CapibaLogo from '../Logo/CapibaLogo.jsx'; 

// Mapeamento para tags Web
const View = 'div';
const Text = 'p';
const StyleSheet = { create: (s) => s };

// Estilos do Slide - Focados em Layout, Tipografia e Sizing
const slideStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between', 
        padding: 0, 
        height: '100%',
        width: '100%',
        textAlign: 'center',
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        flexGrow: 1, 
    },
    iconContainer: {
        width: 150, 
        height: 150, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 0, 
        overflow: 'hidden',
    },
    iconImage: {
        width: '100%', 
        height: '100%',
        objectFit: 'contain',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        fontFamily: 'Arial, sans-serif',
    },
    description: {
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 20,
        fontFamily: 'Arial, sans-serif',
    }
});

/**
 * Componente que renderiza o conteúdo de cada slide do Onboarding.
 * Agora aceita qualquer imagem passada via props "icon".
 */
const WelcomeSlide = ({ title, description, icon }) => {
    return (
        <View style={slideStyles.container}>

            {/* 1. CABEÇALHO DA MARCA */}
            <CapibaLogo />

            {/* 2. Conteúdo principal */}
            <View style={slideStyles.contentWrapper}>

                {/* Ícone do slide */}
                <View style={slideStyles.iconContainer}>
                    <img 
                        src={icon}
                        alt="Ícone do slide"
                        style={slideStyles.iconImage}
                    />
                </View>

                {/* Título e descrição */}
                <Text style={slideStyles.title}>{title}</Text>
                <Text style={slideStyles.description}>{description}</Text>
            </View>
        </View>
    );
};

export default WelcomeSlide;
