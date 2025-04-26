
import React, { useState } from 'react';
import { User, Mail, Phone, Edit, Save, Lock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';


const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john@burgerpalace.com',
    phone: '(123) 456-7890',
    role: 'Restaurant Owner',
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  


  const handleSaveProfile = () => {
    // Validation
    if (!editedProfile.name || !editedProfile.email) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Name and email are required",
    //   });
      return;
    }

    // Update profile
    setProfile(editedProfile);
    setIsEditing(false);
    
    // toast({
    //   title: "Success",
    //   description: "Profile updated successfully",
    // });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Validation
    if (!password.current || !password.new || !password.confirm) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "All password fields are required",
    //   });
      return;
    }

    if (password.new !== password.confirm) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "New passwords do not match",
    //   });
      return;
    }

    // Reset form
    setPassword({
      current: '',
      new: '',
      confirm: '',
    });
    
    // toast({
    //   title: "Success",
    //   description: "Password updated successfully",
    // });
  };

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
                >
                  <Save className="w-4 h-4 mr-1" /> Save
                </FoodieButton>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <FoodieInput
                  label="Full Name"
                  icon={<User size={20} />}
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                />
                
                <FoodieInput
                  label="Email Address"
                  type="email"
                  icon={<Mail size={20} />}
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                />
                
                <FoodieInput
                  label="Phone Number"
                  icon={<Phone size={20} />}
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                />
                
                <FoodieInput
                  label="Role"
                  disabled
                  value={editedProfile.role}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-foodie-orange flex items-center justify-center text-white mr-4">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <p className="text-foodie-gray-dark">{profile.role}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-foodie-gray-dark mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">Email Address</span>
                    </div>
                    <p>{profile.email}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-foodie-gray-dark mb-1">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">Phone Number</span>
                    </div>
                    <p>{profile.phone}</p>
                  </div>
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
                onChange={(e) => setPassword({...password, current: e.target.value})}
              />
              
              <FoodieInput
                label="New Password"
                type="password"
                icon={<Lock size={20} />}
                placeholder="Enter your new password"
                value={password.new}
                onChange={(e) => setPassword({...password, new: e.target.value})}
              />
              
              <FoodieInput
                label="Confirm Password"
                type="password"
                icon={<Lock size={20} />}
                placeholder="Confirm your new password"
                value={password.confirm}
                onChange={(e) => setPassword({...password, confirm: e.target.value})}
              />
              
              <FoodieButton type="submit" className="w-full">
                Update Password
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
                  <input type="checkbox" className="sr-only peer" defaultChecked />
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
                  <input type="checkbox" className="sr-only peer" />
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