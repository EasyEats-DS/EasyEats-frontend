import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit, Save, Lock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';
import { userService } from '../../lib/api/users';
import { getUserFromToken } from '../../lib/auth';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    firstName: '', 
    lastName: '',
    email: '',
    phone: '',
    role: 'Restaurant Owner',
    emailNotifications: true,
    smsNotifications: false,
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform role for display
  const formatRoleForDisplay = (role) => {
    if (role === 'RESTAURANT_OWNER') return 'Restaurant Owner';
    return role || 'Restaurant Owner';
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const user = getUserFromToken();
        if (!user || !user.id) {
          throw new Error('No valid user token found');
        }
        const userId = user.id;
        const userData = await userService.getUserById(userId);
        console.log('API Response (userData):', userData);

        // Access the nested user object
        const userInfo = userData.user || {};
        const userProfile = {
          firstName: userInfo.firstName || '',
          lastName: userInfo.lastName || '',
          name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || '',
          email: userInfo.email || '',
          phone: userInfo.phone || '', // Not in API response, so will be empty
          role: formatRoleForDisplay(userInfo.role),
          emailNotifications: userInfo.preferences?.emailNotifications ?? true,
          smsNotifications: userInfo.preferences?.smsNotifications ?? false,
        };
        setProfile(userProfile);
        setEditedProfile(userProfile);
      } catch (err) {
        setError(err.message || 'Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!editedProfile.name || !editedProfile.email) {
      setError('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      const user = getUserFromToken();
      if (!user || !user.id) {
        throw new Error('No valid user token found');
      }
      const userId = user.id;

      // Split name into firstName and lastName
      const nameParts = editedProfile.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updatedData = {
        firstName,
        lastName,
        email: editedProfile.email,
        phone: editedProfile.phone || undefined, // Send undefined if empty to avoid overwriting with empty string
      };
      const updatedUser = await userService.updateUserProfile(userId, updatedData);
      const preferences = {
        emailNotifications: editedProfile.emailNotifications,
        smsNotifications: editedProfile.smsNotifications,
      };
      // await userService.updateUserPreferences(userId, preferences);

      const updatedUserInfo = updatedUser.user || {};
      setProfile({
        firstName: updatedUserInfo.firstName || '',
        lastName: updatedUserInfo.lastName || '',
        name: `${updatedUserInfo.firstName || ''} ${updatedUserInfo.lastName || ''}`.trim() || '',
        email: updatedUserInfo.email || '',
        phone: updatedUserInfo.phone || '',
        role: formatRoleForDisplay(updatedUserInfo.role),
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
      });
      setEditedProfile({
        firstName,
        lastName,
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
        role: formatRoleForDisplay(updatedUserInfo.role),
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
      });
      setIsEditing(false);
      setError(null);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!password.current || !password.new || !password.confirm) {
      setError('All password fields are required');
      return;
    }

    if (password.new !== password.confirm) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const user = getUserFromToken();
      if (!user || !user.id) {
        throw new Error('No valid user token found');
      }
      const userId = user.id;
      const passwordData = {
        currentPassword: password.current,
        newPassword: password.new,
      };
      await userService.changePassword(userId, passwordData);
      setPassword({
        current: '',
        new: '',
        confirm: '',
      });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setEditedProfile((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <AdminLayout title="Profile">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse">
            <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Profile">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 text-xl">{error}</p>
          <FoodieButton className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </FoodieButton>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Profile">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="md:col-span-2">
          <FoodieCard className="overflow-hidden">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Account Information</h2>
              {!isEditing ? (
                <FoodieButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </FoodieButton>
              ) : (
                <FoodieButton
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-1" /> {loading ? 'Saving...' : 'Save'}
                </FoodieButton>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <FoodieInput
                  label="Full Name"
                  icon={<User size={20} />}
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
                <FoodieInput
                  label="Email Address"
                  type="email"
                  icon={<Mail size={20} />}
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                />
                {/* <FoodieInput
                  label="Phone Number"
                  icon={<Phone size={20} />}
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                /> */}
                <FoodieInput
                  label="Role"
                  disabled
                  value={editedProfile.role}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-foodie-orange flex items-center justify-center text-black mr-4 bg-orange-400">
                    {profile.name ? profile.name.charAt(0) : '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{profile.name || 'N/A'}</h3>
                    <p className="text-foodie-gray-dark">{profile.role}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-foodie-gray-dark mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">Email Address</span>
                    </div>
                    <p>{profile.email || 'N/A'}</p>
                  </div>
                  {/* <div>
                    <div className="flex items-center text-foodie-gray-dark mb-1">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">Phone Number</span>
                    </div>
                    <p>{profile.phone || 'N/A'}</p>
                  </div> */}
                </div>
              </div>
            )}
          </FoodieCard>

          <FoodieCard className="mt-6 overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <FoodieInput
                label="Current Password"
                type="password"
                icon={<Lock size={20} />}
                placeholder="Enter your current password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
              />
              <FoodieInput
                label="New Password"
                type="password"
                icon={<Lock size={20} />}
                placeholder="Enter your new password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
              />
              <FoodieInput
                label="Confirm Password"
                type="password"
                icon={<Lock size={20} />}
                placeholder="Confirm your new password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              />
              <FoodieButton type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </FoodieButton>
            </form>
          </FoodieCard>
        </div>

        <div>
          <FoodieCard className="overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Account Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-foodie-gray-dark mb-3">
                  Add an extra layer of security to your account
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foodie-gray-dark">Not enabled</span>
                  <FoodieButton variant="outline" size="sm">
                    Enable
                  </FoodieButton>
                </div>
              </div>
              <div className="pt-4 border-t border-foodie-gray">
                <h3 className="font-medium mb-1">Active Sessions</h3>
                <p className="text-sm text-foodie-gray-dark mb-3">
                  Manage your active login sessions
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-foodie-gray-light">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Current session</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <p className="text-xs text-foodie-gray-dark">
                      Chrome on Windows • New York, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FoodieCard>

          <FoodieCard className="mt-6 overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-foodie-gray-dark">
                    Receive order notifications via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editedProfile.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-foodie-gray-dark rounded-full peer peer-checked:bg-foodie-orange peer-focus:ring-4 peer-focus:ring-foodie-orange/20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-foodie-gray">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-foodie-gray-dark">
                    Receive order notifications via SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editedProfile.smsNotifications}
                    onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-foodie-gray-dark rounded-full peer peer-checked:bg-foodie-orange peer-focus:ring-4 peer-focus:ring-foodie-orange/20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>
          </FoodieCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;