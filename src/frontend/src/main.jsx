import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app' // <--- MUDANÇA 1: Importamos o App, não a Home
import './pages/style/style.css' // Mantém seu estilo global

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* <--- MUDANÇA 2: Renderizamos o App (que contém as rotas) */}
  </StrictMode>,
)