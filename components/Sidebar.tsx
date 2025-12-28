import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Scale, CreditCard, Smartphone, Settings, LogOut, X, Receipt, Shield, UserCog, Briefcase, DollarSign, PiggyBank, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'farmers', label: 'Farmers', icon: Users, path: '/farmers' },
    { id: 'products', label: 'Products', icon: Scale, path: '/products' },
    { id: 'purchases', label: 'Purchases', icon: Scale, path: '/purchases' },
    { id: 'loans', label: 'Loans', icon: CreditCard, path: '/loans' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, path: '/transactions' },
    { id: 'admins', label: 'Admin Management', icon: Shield, path: '/admins' },
    { id: 'staff', label: 'Staff Management', icon: UserCog, path: '/staff' },
    { id: 'payroll', label: 'Payroll', icon: DollarSign, path: '/payroll' },
    { id: 'pension', label: 'Pension', icon: PiggyBank, path: '/pension' },
    { id: 'ussd', label: 'USSD Logs', icon: Smartphone, path: '/ussd' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">P</span>
        </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Promise Point <span className="text-emerald-600">Farm</span></span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};