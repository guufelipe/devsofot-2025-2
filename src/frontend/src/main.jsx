// src/frontend/src/main.jsx

import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client'

// Importa o componente Home, utilizado como destino após o onboarding

import Home from './containers/Home/home' 
// Importa a tela de Onboarding, que decide se deve aparecer ou enviar o usuário para Home

import OnboardingScreen from './containers/Onboarding/OnboardingScreen.jsx' 
import './containers/style/style.css'

// A tela principal carregada inicialmente é a OnboardingScreen. 
// Ela consulta a API para verificar se o usuário já concluiu o desafio. 
//Com base nisso, ela mesma decide se permanece visível ou navega para <Home />.

createRoot(document.getElementById('root')).render( <StrictMode> 
  {/* Passamos um objeto navigation simples apenas para evitar erros enquanto a navegação real não é implementada */} 
  <OnboardingScreen navigation={{ navigate: () => {} }} />
   </StrictMode>, )