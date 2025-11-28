import { httpClient } from './client';

/**
 * Authentication API Service
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  pictureUrl?: string;
}

/**
 * Admin login with email and password
 * Note: This endpoint needs to be implemented in backend
 */
export const authAPI = {
  /**
   * Login with email and password
   * @param credentials Email and password
   * @returns JWT token and user data
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // httpClient already unwraps { data: ... } envelope
    return httpClient.post<LoginResponse>('/auth/admin/login', credentials, {
      requireAuth: false,
    });
  },

  /**
   * Get current user profile
   * Uses existing /auth/me endpoint from API specs
   */
  async getMe(): Promise<UserProfile> {
    // httpClient already unwraps { data: ... } envelope
    return httpClient.get<UserProfile>('/auth/me');
  },

  /**
   * Logout (clear local token)
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  /**
   * Store auth token
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },
};
