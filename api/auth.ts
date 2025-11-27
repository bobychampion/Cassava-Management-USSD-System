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
  const response = await apiClient.post<LoginResponse>('/admins/login', credentials);
  
  // Store token in cookie
  if (response.accessToken) {
    setAuthToken(response.accessToken, 1); // 1 day expiry
  }
  
  return response;
};

/**
 * Get current admin info from token
 */
export const introspect = async (): Promise<AdminInfo> => {
  return apiClient.post<IntrospectResponse>('/admins/introspect');
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
