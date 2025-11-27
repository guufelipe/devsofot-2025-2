// src/frontend/src/components/Onboarding/WelcomeSlide.jsx
import React from 'react';

// Importa o caminho da imagem
import CapibaLogo from '../../assets/icon.png'; 

// Mapeamento para tags Web
const View = 'div';
const Text = 'p';
const StyleSheet = { create: (s) => s };

// Estilos do Slide
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
    logoImage: {
        width: 60,       // Tamanho sugerido para a logo no topo
        height: 60,
        marginTop: 20,
        objectFit: 'contain',
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
        // CORREÇÃO: paddingHorizontal não existe na Web, use padding shorthand
        padding: '0 20px', 
        fontFamily: 'Arial, sans-serif',
    }
});

/**
 * Componente que renderiza o conteúdo de cada slide do Onboarding.
 */
const WelcomeSlide = ({ title, description, icon }) => {
    return (
        <View style={slideStyles.container}>

            {/* 1. CABEÇALHO DA MARCA (CORRIGIDO) */}
            {/* Antes estava <CapibaLogo />, o que causa erro. Agora é uma img: */}
            <img 
                src={CapibaLogo} 
                alt="Logo Capiba" 
                style={slideStyles.logoImage} 
            />

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