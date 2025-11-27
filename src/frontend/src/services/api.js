import axios from 'axios';

// Cria uma instância padrão do Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    // Aqui você pode configurar timeouts globais, headers de autenticação, etc.
    timeout: 10000, 
});

export default api;