// src/frontend/src/components/Logo/CapibaLogo.jsx
import React from 'react';

// Importa a imagem do mascote
import MascoteCapiba from './icon.png'; 

// Mapeamento para tags Web (necessário para rodar no ambiente Vite)
const View = 'div';
const Text = 'p';
const StyleSheet = { create: (s) => s };

const logoStyles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        // Ocupa 100% da largura e justifica para o INÍCIO do container, alinhando à esquerda
        justifyContent: 'flex-start', 
        padding: '15px 20px', 
        width: '100%',
        boxSizing: 'border-box',
    },
    image: {
        width: 90, 
        height: 90,
        marginRight: 15,
        borderRadius: '50%',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        // Garante que o texto comece alinhado à esquerda do Mascote
        alignItems: 'flex-start', 
    },
    capibaText: {
        fontSize: 40, 
        fontWeight: 'bold',
        // 🚨 CORREÇÃO DEGRADÊ: Aplica o gradiente Verde para Laranja
        backgroundImage: 'linear-gradient(to right, #00cc66, #ff9900)', // Verde para Laranja
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent', 
        color: '#00cc66', // Fallback
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        textAlign: 'left', 
    },
    sloganText: {
        fontSize: 13, 
        color: '#666',
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        textAlign: 'left', 
    },
});

const CapibaLogo = () => {
    return (
        <View style={logoStyles.container}>
            {/* Mascote */}
            <img 
                src={MascoteCapiba} 
                alt="Mascote Capiba" 
                style={logoStyles.image} 
            />
            
            {/* Texto e Slogan */}
            <View style={logoStyles.textContainer}>
                <Text style={logoStyles.capibaText}>CapibaFit</Text>
                <Text style={logoStyles.sloganText}>Movimente-se e seja recompensado</Text>
            </View>
        </View>
    );
};

export default CapibaLogo;