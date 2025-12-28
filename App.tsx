
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FarmersDirectory } from './components/FarmersDirectory';
import { PurchasesView } from './components/PurchasesView';
import { LoansView } from './components/LoansView';
import { SettingsView } from './components/SettingsView';
import ProductsView from './components/ProductsView';
import UnifiedLoginPage from './components/UnifiedLoginPage';
import { TransactionsView } from './components/TransactionsView';
import { AdminManagementView } from './components/AdminManagementView';
import StaffManagementView from './components/StaffManagementView';
import { USSDAnalyticsView } from './components/USSDAnalyticsView';
import { StaffPortal } from './components/StaffPortal';
import PayrollManagementView from './components/PayrollManagementView';
import PensionManagementView from './components/PensionManagementView';
import AdminProfileView from './components/AdminProfileView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StaffProtectedRoute } from './components/StaffProtectedRoute';
import { SuccessModal } from './components/SuccessModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { settingsApi } from './api/settings';
import { SystemSettings } from './types';
import { Signal, Menu } from 'lucide-react';
import { getAuthToken, clearAuthToken } from './utils/cookies';
import { introspect, logout as apiLogout } from './api/auth';
import type { AdminInfo } from './api/auth';
import type { Staff } from './api/staff';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [staffInfo, setStaffInfo] = useState<Staff | null>(null);
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });
  
  // System Settings State - must be at top level, not inside conditional
  const [settings, setSettings] = useState<SystemSettings>({
    cassavaPricePerKg: 500,
    cassavaPricePerTon: 450000,
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (token) {
        try {
          // Try to get admin info
          const admin = await introspect();
          setAdminInfo(admin);
          setIsAuthenticated(true);
          setIsStaffMode(false);
        } catch (error: any) {
          console.error('Token validation failed:', error);
          // If it's a 404, the endpoint might not exist - clear token and show login
          if (error.message?.includes('404') || error.message?.includes('Not Found')) {
            console.warn('Auth endpoint not found. Please check backend configuration.');
            clearAuthToken();
          }
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();

    // Listen for unauthorized events (401 errors)
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setAdminInfo(null);
      setStaffInfo(null);
      setIsStaffMode(false);
      if (!location.pathname.startsWith('/login')) {
        navigate('/login');
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    apiLogout();
    setAdminInfo(null);
    setStaffInfo(null);
    setIsAuthenticated(false);
    setIsStaffMode(false);
    navigate('/login');
  };

  const handleUpdateSettings = async (newSettings: SystemSettings) => {
    try {
      setSettingsLoading(true);
      const response = await settingsApi.updateSettings(newSettings);
      
      if (response.success) {
        setSettings(newSettings);
        setSettingsSuccess({
          isOpen: true,
          message: response.message || 'Settings saved successfully! Cassava pricing has been updated.'
        });
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      alert(`Failed to save settings: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return <LoadingSpinner message="Initializing..." fullScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<UnifiedLoginPage />} />
      
      {/* Root redirect */}
      <Route 
        path="/" 
        element={
          getAuthToken() ? (
            location.pathname.startsWith('/staff-portal') ? (
              <Navigate to="/staff-portal/dashboard" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Staff Portal Routes */}
      <Route
        path="/staff-portal/*"
        element={
          <StaffProtectedRoute>
            <StaffPortal
              onLogout={handleLogout}
            />
          </StaffProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50">
              <Sidebar 
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
              />
              <main className="flex-1 lg:ml-64">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                      aria-label="Open menu"
                    >
                      <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="hidden sm:inline">Branch:</span>
                      <span className="font-semibold text-gray-800 ml-0 sm:ml-2">Ogun State HQ</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold">
                      <Signal className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">System Operational</span>
                      <span className="sm:hidden">Operational</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
                      SA
                    </div>
                  </div>
                </header>
                <div className="p-4 sm:p-6 lg:p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<AdminProfileView />} />
                    <Route path="/farmers" element={<FarmersDirectory />} />
                    <Route path="/products" element={<ProductsView />} />
                    <Route path="/purchases" element={<PurchasesView />} />
                    <Route path="/loans" element={<LoansView />} />
                    <Route path="/transactions" element={<TransactionsView />} />
                    <Route path="/admins" element={<AdminManagementView />} />
                    <Route path="/staff" element={<StaffManagementView adminId={adminInfo?.id || ''} />} />
                    <Route path="/payroll" element={<PayrollManagementView />} />
                    <Route path="/pension" element={<PensionManagementView />} />
                    <Route path="/ussd" element={<USSDAnalyticsView />} />
                    <Route 
                      path="/settings" 
                      element={
                        <SettingsView
                          settings={settings}
                          onSave={handleUpdateSettings}
                          loading={settingsLoading}
                        />
                      } 
                    />
                    <Route path="*" element={<div className="p-10 text-center text-gray-500">Page not found</div>} />
                  </Routes>
                </div>
              </main>

              {/* Settings Success Modal */}
              <SuccessModal
                isOpen={settingsSuccess.isOpen}
                onClose={() => setSettingsSuccess({ isOpen: false, message: '' })}
                title="Settings Saved!"
                message={settingsSuccess.message}
              />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
