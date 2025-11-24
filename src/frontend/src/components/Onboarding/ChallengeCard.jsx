// src/components/Onboarding/ChallengeCard.jsx
import React from "react";

const View = "div";
const Text = "p";
const StyleSheet = { create: (s) => s };

// Estilos recriados fielmente ao protótipo
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 25,
        paddingTop: 40,
        backgroundColor: "#F7F9FA",
        minHeight: "100vh",
        overflowY: "auto",
    },

    // Cabeçalho
    badgeWrapper: {
        width: 90,
        height: 90,
        borderRadius: 100,
        backgroundColor: "#00D07D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        position: "relative",
        marginBottom: 20,
    },
    badgeEmoji: {
        fontSize: 40,
    },
    badgeBolt: {
        position: "absolute",
        right: -5,
        top: -5,
        fontSize: 22,
    },

    headerTitle: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
        color: "#1A8F2E",
    },
    headerTitleHighlight: {
        color: "#F08A00",
    },
    subtitle: {
        fontSize: 15,
        color: "#777",
        marginBottom: 30,
        textAlign: "center",
    },

    // Card principal
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        width: "92%",
        maxWidth: 440,
        padding: 25,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        marginBottom: 25,
    },

    bonusTag: {
        backgroundColor: "#E9FAEE",
        borderRadius: 20,
        padding: "6px 16px",
        fontWeight: "bold",
        width: "fit-content",
        margin: "0 auto 20px auto",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 17,
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },

    rulesList: {
        marginTop: 20,
        padding: 0,
    },

    ruleItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 12,
    },

    ruleNumber: {
        width: 26,
        height: 26,
        borderRadius: 100,
        backgroundColor: "#DFFFEF",
        color: "#00B067",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    // Box de atenção
    alertBox: {
        marginTop: 25,
        padding: 18,
        borderRadius: 12,
        backgroundColor: "#FFF7D9",
        border: "1px solid #FFE08A",
        color: "#7A5A00",
        fontSize: 14,
        lineHeight: 1.45,
    },

    // Botão principal
    buttonPrimary: {
        backgroundColor: "#0AC26D",
        color: "#fff",
        padding: "16px 20px",
        borderRadius: 12,
        fontSize: 18,
        fontWeight: "bold",
        cursor: "pointer",
        border: "none",
        marginTop: 25,
        width: "92%",
        maxWidth: 440,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    },

    skipText: {
        fontSize: 15,
        color: "#999",
        marginTop: 18,
        textDecoration: "underline",
        cursor: "pointer",
        marginBottom: 20,
    },
});

const ChallengeCard = ({ onAccept, onSkip, isAccepting }) => {
    return (
        <View style={styles.container}>

            {/* Badge de presente */}
            <View style={styles.badgeWrapper}>
                <Text style={styles.badgeEmoji}>🎁</Text>
                <Text style={styles.badgeBolt}>⚡</Text>
            </View>

            {/* Título */}
            <Text style={styles.headerTitle}>
                Desafio de <span style={styles.headerTitleHighlight}>Boas-Vindas!</span>
            </Text>
            <Text style={styles.subtitle}>Oferta exclusiva para novos usuários</Text>

            {/* Card principal */}
            <View style={styles.card}>

                {/* Badge verde 2x */}
                <View style={styles.bonusTag}>
                    2x <span>🪙</span>
                </View>

                <Text style={styles.title}>Ganhe o Dobro de Capibas!</Text>

                <Text style={{ textAlign: "center" }}>
                    Complete <b>1 km</b> de qualquer atividade física e ganhe{" "}
                    <b>60 Capibas</b> (2x o valor padrão de 30)!
                </Text>

                {/* Lista de regras */}
                <div style={styles.rulesList}>
                    {[
                        "Escolha entre Caminhada, Corrida ou Bicicleta",
                        "Complete apenas 1 km de distância",
                        "A atividade será finalizada automaticamente em 1 km",
                        "Receba 60 Capibas de recompensa!",
                    ].map((item, index) => (
                        <div key={index} style={styles.ruleItem}>
                            <div style={styles.ruleNumber}>{index + 1}</div>
                            <Text>{item}</Text>
                        </div>
                    ))}
                </div>

                {/* Atenção */}
                <View style={styles.alertBox}>
                    <b>⚠ Atenção:</b><br/><br/>
                    • Se você cancelar antes de 1 km, receberá apenas os Capibas normais pela distância percorrida.<br/>
                    • O desafio recomeça se você finalizar manualmente.<br/>
                    • Este desafio só está disponível uma vez!
                </View>

            </View>

            {/* Botão aceitar */}
            <button
                style={styles.buttonPrimary}
                onClick={onAccept}
                disabled={isAccepting}
            >
                {isAccepting ? "Aguarde..." : "Aceitar Desafio"}
                {!isAccepting && "→"}
            </button>

            {/* Pular */}
            <Text style={styles.skipText} onClick={onSkip}>
                ✖ Pular por enquanto
            </Text>

        </View>
    );
};

export default ChallengeCard;
