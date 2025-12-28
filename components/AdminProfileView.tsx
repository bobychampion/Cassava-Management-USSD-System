import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Loader2 } from 'lucide-react';
import { introspect } from '../api/auth';
import type { AdminInfo } from '../api/auth';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

const AdminProfileView: React.FC = () => {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdminInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await introspect();
        setAdminInfo(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin profile');
      } finally {
        setLoading(false);
      }
    };

    loadAdminInfo();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Profile"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!adminInfo) {
    return (
      <div className="p-6 text-center text-gray-500">
        No profile information available
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h1>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {adminInfo.email.split('@')[0]}
              </h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-base text-gray-900 mt-1">{adminInfo.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-base text-gray-900 mt-1 capitalize">
                  {adminInfo.role.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(adminInfo.createdAt)}
                </p>
              </div>
            </div>

            {/* Admin ID */}
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500">Admin ID</label>
                <p className="text-base text-gray-900 mt-1 font-mono text-sm">
                  {adminInfo.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileView;

