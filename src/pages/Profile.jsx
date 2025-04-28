import React, { useState, useEffect } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  FileText,
  Bell,
  Lock,
  Clock,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import FoodieInput from "../components/FoodieInput";
import FoodieButton from "../components/FoodieButton";
import { userService } from "../lib/api/users";
import Avatar from 'boring-avatars';
import {getUserFromToken} from "../lib/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      orderUpdates: true,
      promotions: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
         const user = getUserFromToken();
                if (!user || !user.id) {
                  throw new Error('No valid user token found');
                }
        const userId = user.id;
        // Get the userId from localStorage or context        
        // Fetch user data from API
        const response = await userService.getUserById(userId);
        const userData = response.user;
        
        // Format the address
        const formattedAddress = `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.zipCode}, ${userData.address.country}`;
        
        // Update state with API data
        setProfileData({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone || "+1 234 567 8900",
          address: formattedAddress,
          avatar: userData.avatar || null,  // Changed from Unsplash URL to null
          preferences: userData.preferences || {
            emailNotifications: true,
            pushNotifications: false,
            orderUpdates: true,
            promotions: false,
          },
        }); 
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      const user = getUserFromToken();
                if (!user || !user.id) {
                  throw new Error('No valid user token found');
                }
        const userId = user.id;
      
      // Parse the name into first and last name
      const nameParts = profileData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Parse the address into components
      // This is a simplified approach - you might need more robust parsing
      const addressParts = profileData.address.split(',');
      const street = addressParts[0]?.trim() || '';
      const city = addressParts[1]?.trim() || '';
      const stateZip = addressParts[2]?.trim().split(' ') || [];
      const state = stateZip[0] || '';
      const zipCode = stateZip[1] || '';
      const country = addressParts[3]?.trim() || '';
      
      // Create the update object
      const updateData = {
        firstName,
        lastName,
        email: profileData.email,
        phone: profileData.phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country
        }
      };
      
      await userService.updateUserProfile(userId, updateData);
      
      // Update preferences if necessary
      // await userService.updateUserPreferences(userId, profileData.preferences);
      
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    // Remove auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  const handleViewOrders = () => {
    navigate("/viewOrder");
  };

  // Show loading state
  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-[#FF7A00] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
  {profileData.avatar ? (
    <img
      src={profileData.avatar}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <Avatar
      size={128}
      name={profileData.name}
      variant="beam"
      colors={["#FF7A00", "#FF9E00", "#FFC300", "#FF5733", "#C70039"]}
    />
  )}
</div>
              <button className="absolute bottom-0 right-0 bg-[#FF7A00] text-white p-2 rounded-full shadow-lg hover:bg-[#FF9E00] transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">
                {profileData.name}
              </h1>
              <p className="text-gray-500 flex items-center justify-center md:justify-start mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {profileData.address}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <FoodieButton
                  onClick={() => setIsEditing(!isEditing)}
                  variant="secondary"
                >
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </FoodieButton>
                <FoodieButton
                  onClick={handleViewOrders}
                  variant="outline"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Orders
                </FoodieButton>
                <FoodieButton
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-500 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </FoodieButton>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FoodieInput
              label="Full Name"
              icon={<UserRound className="w-5 h-5" />}
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              disabled={!isEditing}
            />

            <FoodieInput
              label="Email"
              type="email"
              icon={<Mail className="w-5 h-5" />}
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              disabled={!isEditing}
            />

            <FoodieInput
              label="Phone"
              icon={<Phone className="w-5 h-5" />}
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              disabled={!isEditing}
            />

            <FoodieInput
              label="Address"
              icon={<MapPin className="w-5 h-5" />}
              value={profileData.address}
              onChange={(e) =>
                setProfileData({ ...profileData, address: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <FoodieButton type="submit" className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </FoodieButton>
            </div>
          )}
        </form>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive updates about your orders via email
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.preferences.emailNotifications}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        emailNotifications: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF7A00]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-800">Order Updates</h3>
                  <p className="text-sm text-gray-500">
                    Get real-time updates about your orders
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.preferences.orderUpdates}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        orderUpdates: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF7A00]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <button 
                  type="button"
                  className="flex items-center text-gray-700 hover:text-[#FF7A00] transition-colors"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout from Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;