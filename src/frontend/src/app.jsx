import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Páginas
import Home from './pages/Home/Home'; 
import Desafios from './pages/Desafios/desafios'; 
import Extrato from './pages/Extrato/extrato'; 
import BottomMenu from './components/BottomMenu/BottomMenu.jsx';

// NOVOS IMPORTS SEPARADOS
import IntroScreen from './pages/Onboarding/IntroScreen';
import WelcomeChallengeScreen from './pages/Onboarding/WelcomeChallengerScreen';

// 1. PORTEIRO (Decide se vai para Intro ou Home)
const AuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPrimeiroAcesso = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/me?userId=1');
        const user = response.data;

        // REGRA 1: É o primeiro login da vida?
        // Se first_login for true (ou 1), joga para os slides.
        if (user.first_login) {
          console.log("Usuário novo: Indo para Intro.");
          navigate('/intro', { replace: true });
        } else {
          // Se não é novo, vai para Home. 
          // (O DesafiosGuard cuidará do desafio pendente depois)
          console.log("Usuário recorrente: Indo para Home.");
          navigate('/home', { replace: true });
        }

      } catch (error) {
        console.error("Erro ao verificar user:", error);
        // Fallback: Na dúvida, manda pra Home pra não travar
        navigate('/home', { replace: true });
      }
    };

    verificarPrimeiroAcesso();
  }, [navigate]);

  return <div style={{display:'flex', justifyContent:'center', marginTop:'50vh'}}>Carregando...</div>;
};

// 2. GUARDA (Se clicar em Desafios sem ter o welcome, vai pro Card)
const DesafiosGuard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificar = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/me?userId=1');
        const dbCompletou = response.data && response.data.welcome_challenge_completed === 'S';

        if (!dbCompletou) {
          // MUDANÇA: Manda direto para a rota do Card (sem slides)
          console.log("Pendente. Redirecionando para tela de Desafio Inicial.");
          navigate('/welcome-challenge', { replace: true });
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    verificar();
  }, [navigate]);

  if (loading) return <div>Verificando...</div>;
  return children;
};

function Layout() {
  const location = useLocation();
  // Só mostra menu nestas rotas
  const rotasComMenu = ['/home', '/desafios', '/extrato'];
  const mostrarMenu = rotasComMenu.includes(location.pathname);

  return (
    <>
      <div className="app-content" style={{ paddingBottom: mostrarMenu ? '80px' : '0' }}>
        <Routes>
          <Route path="/" element={<AuthCheck />} />
          <Route path="/home" element={<Home />} />
          
          {/* ROTAS DE ONBOARDING SEPARADAS */}
          <Route path="/intro" element={<IntroScreen />} />
          <Route path="/welcome-challenge" element={<WelcomeChallengeScreen />} />

          <Route path="/desafios" element={
            <DesafiosGuard>
              <Desafios />
            </DesafiosGuard>
          } />

          <Route path="/extrato" element={<Extrato />} />
        </Routes>
      </div>
      {mostrarMenu && <BottomMenu />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}