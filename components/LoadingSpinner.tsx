import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const logoSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Logo */}
      <div className="relative mb-6">
        {/* Outer rotating ring */}
        <div className={`${logoSizeClasses[size]} relative`}>
          <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 border-r-emerald-500 animate-spin`} style={{ animationDuration: '1s' }}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-transparent border-b-green-600 border-l-green-500 animate-spin`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          
          {/* Center logo with pulse animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
              <span className="text-white font-bold" style={{ fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '1.25rem' : '1.5rem' }}>
                PP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Name with fade animation */}
      <div className="mb-3">
        <h3 className={`font-bold text-gray-800 ${textSizeClasses[size]} animate-pulse`}>
          Promise Point <span className="text-emerald-600">Farm</span>
        </h3>
      </div>

      {/* Loading message */}
      {message && (
        <div className="flex items-center space-x-2">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-emerald-600`} style={{ animationDuration: '2s' }} />
          <p className={`text-gray-600 ${textSizeClasses[size]}`}>{message}</p>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      {content}
    </div>
  );
};
