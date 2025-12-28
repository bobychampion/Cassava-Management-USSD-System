import React, { useState, useEffect } from 'react';
import { 
  User, 
  CreditCard,
  Building2,
  Edit,
  Save,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { staffApi, StaffProfile, BankDetails } from '../api/staff';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface StaffProfileViewProps {
  profile: StaffProfile;
  onProfileUpdate: () => void;
}

export const StaffProfileView: React.FC<StaffProfileViewProps> = ({ profile, onProfileUpdate }) => {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
  });

  useEffect(() => {
    loadBankDetails();
  }, []);

  const loadBankDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffApi.getBankDetails();
      setBankDetails(data);
      setFormData({
        accountNumber: data.accountNumber || '',
        bankName: data.bankName || '',
        accountName: data.accountName || '',
      });
    } catch (err: any) {
      // If bank details don't exist, that's okay - user can add them
      if (err.message?.includes('404') || err.message?.includes('Not Found')) {
        setBankDetails(null);
        setError(null);
      } else {
        setError(err.message || 'Failed to load bank details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (bankDetails) {
      setFormData({
        accountNumber: bankDetails.accountNumber,
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (bankDetails) {
      setFormData({
        accountNumber: bankDetails.accountNumber,
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
      });
    } else {
      setFormData({
        accountNumber: '',
        bankName: '',
        accountName: '',
      });
    }
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.accountNumber || !formData.bankName || !formData.accountName) {
      setError('All fields are required');
      return;
    }

    // Validate account number is numeric
    if (!/^\d+$/.test(formData.accountNumber)) {
      setError('Account number must contain only numbers');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (bankDetails) {
        // Update existing bank details
        await staffApi.updateBankDetails({
          ...bankDetails,
          ...formData,
        });
      } else {
        // Create new bank details
        await staffApi.createBankDetails(formData);
      }

      await loadBankDetails();
      setIsEditing(false);
      onProfileUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to save bank details');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === 'accountNumber') {
      // Only allow numbers
      value = value.replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Common Nigerian banks list
  const nigerianBanks = [
    'Access Bank',
    'First Bank of Nigeria',
    'Guaranty Trust Bank (GTBank)',
    'United Bank for Africa (UBA)',
    'Zenith Bank',
    'Fidelity Bank',
    'Union Bank of Nigeria',
    'First City Monument Bank (FCMB)',
    'Sterling Bank',
    'Wema Bank',
    'Polaris Bank',
    'Ecobank Nigeria',
    'Stanbic IBTC Bank',
    'Keystone Bank',
    'Providus Bank',
    'TajBank',
    'Unity Bank',
    'Jaiz Bank',
    'Heritage Bank',
    'Other',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600 mt-1">View and manage your personal information</p>
        </div>
        <button
          onClick={onProfileUpdate}
          className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Full Name</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.firstName} {profile.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">{profile.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone Number</p>
            <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Role</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{profile.role}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              profile.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.status}
            </span>
          </div>
          {profile.nin && (
            <div>
              <p className="text-xs text-gray-500 mb-1">NIN</p>
              <p className="text-sm font-medium text-gray-900">{profile.nin}</p>
            </div>
          )}
          {profile.bvn && (
            <div>
              <p className="text-xs text-gray-500 mb-1">BVN</p>
              <p className="text-sm font-medium text-gray-900">{profile.bvn}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Bank Details
          </h3>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              {bankDetails ? 'Edit' : 'Add'} Bank Details
            </button>
          )}
        </div>

        {error && !loading && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading bank details..." />
        ) : isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter account number"
                maxLength={20}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select a bank</option>
                {nigerianBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter account name as it appears on bank statement"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        ) : bankDetails ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Account Number</span>
              <span className="text-sm font-medium text-gray-900">{bankDetails.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Bank Name</span>
              <span className="text-sm font-medium text-gray-900">{bankDetails.bankName}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Account Name</span>
              <span className="text-sm font-medium text-gray-900">{bankDetails.accountName}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No bank details added yet</p>
            <p className="text-xs mt-1">Click "Add Bank Details" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

