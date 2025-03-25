import api from './api';
import { AuthResponse, User } from '../types/api';

interface SignInRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async signIn({ email, password }: SignInRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@UrlShortener:token', token);
    localStorage.setItem('@UrlShortener:user', JSON.stringify(user));

    return response.data;
  },

  async signUp({ name, email, password }: SignUpRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@UrlShortener:token', token);
    localStorage.setItem('@UrlShortener:user', JSON.stringify(user));

    return response.data;
  },

  signOut(): void {
    localStorage.removeItem('@UrlShortener:token');
    localStorage.removeItem('@UrlShortener:user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('@UrlShortener:user');
    return userStr ? JSON.parse(userStr) : null;
  },
}; 