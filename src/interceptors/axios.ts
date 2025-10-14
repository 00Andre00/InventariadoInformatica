// src/interceptors/axios.ts
import axios from 'axios';
import authService from '../services/authService';
import router from '../routes';

// Configurar la URL base desde las variables de entorno de Vite
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Interceptor para requests
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si es error 401 (no autorizado) o 403 (prohibido)
    if (error.response?.status === 401) {
      // Token expirado o inválido
      authService.logout();
      router.push('/login');
      
      // Mostrar mensaje opcional
      if (error.response?.data?.error !== 'Token de acceso requerido') {
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      }
    } else if (error.response?.status === 403) {
      // Sin permisos suficientes
      alert('No tiene permisos para realizar esta acción.');
    }
    
    return Promise.reject(error);
  }
);

export default axios;