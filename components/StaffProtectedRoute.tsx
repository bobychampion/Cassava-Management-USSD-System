import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/cookies';

interface StaffProtectedRouteProps {
  children: React.ReactNode;
}

export const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({ children }) => {
  const token = getAuthToken();
  
  if (!token) {
    return <Navigate to="/login?staff=true" replace />;
  }
  
  return <>{children}</>;
};

