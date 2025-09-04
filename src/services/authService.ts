// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'https://isiback.drtchco.gob.pe/api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    nombre: string;
    rol: string;
  };
}

interface User {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  // Login
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // Guardar token y usuario en localStorage
      this.setToken(token);
      this.setUser(user);
      
      // Configurar axios para usar el token en futuras peticiones
      this.setAuthHeader(token);
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.removeAuthHeader();
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtener usuario
  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.rol === 'admin';
  }

  // Verificar token con el servidor
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Métodos privados
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private setAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private removeAuthHeader(): void {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Inicializar el servicio (llamar al inicio de la app)
  init(): void {
    const token = this.getToken();
    if (token) {
      this.setAuthHeader(token);
    }
  }
}

export default new AuthService();