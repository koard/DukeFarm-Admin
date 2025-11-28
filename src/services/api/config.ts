/**
 * API Configuration
 * Centralized configuration for API requests
 */

export const API_CONFIG = {
  baseURL: 'https://dukefarm-backend.onrender.com/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Get authorization header with JWT token
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Build full API URL
 */
export const buildURL = (endpoint: string): string => {
  const base = API_CONFIG.baseURL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
