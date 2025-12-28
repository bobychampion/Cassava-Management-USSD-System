/**
 * Authentication API functions
 */

import { apiClient } from './client';
import { setAuthToken, clearAuthToken } from '../utils/cookies';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminInfo {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface IntrospectResponse {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * Login admin user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Try different possible endpoints
  const endpoints = [
    '/admins/login',
    '/admin/login',
    '/auth/login',
    '/api/admins/login',
    '/api/admin/login',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.post<LoginResponse>(endpoint, credentials);
      
      // Store token in cookie
      if (response.accessToken) {
        setAuthToken(response.accessToken, 1); // 1 day expiry
      }
      
      return response;
    } catch (error: any) {
      // If it's not a 404, throw the error
      if (!error.message?.includes('404') && !error.message?.includes('Not Found')) {
        throw error;
      }
      // Otherwise, try next endpoint
      continue;
    }
  }
  
  throw new Error('Login endpoint not found. Please check backend configuration.');
};

/**
 * Get current admin info from token
 */
export const introspect = async (): Promise<AdminInfo> => {
  // Try different possible endpoints
  const endpoints = [
    '/admins/introspect',
    '/admin/introspect',
    '/auth/introspect',
    '/auth/me',
    '/admin/me',
    '/admins/me',
    '/api/admins/introspect',
    '/api/admin/introspect',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.post<IntrospectResponse>(endpoint);
      return response;
    } catch (error: any) {
      // If it's not a 404, throw the error
      if (!error.message?.includes('404') && !error.message?.includes('Not Found')) {
        throw error;
      }
      // Otherwise, try next endpoint
      continue;
    }
  }
  
  throw new Error('Introspect endpoint not found. Please check backend configuration.');
};

/**
 * Logout admin user
 */
export const logout = () => {
  clearAuthToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!apiClient;
};
