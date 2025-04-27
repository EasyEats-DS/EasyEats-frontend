import React, { useState } from "react";
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

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Food Street, NY 10001",
    avatar: "https://source.unsplash.com/random/200x200/?portrait",
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      orderUpdates: true,
      promotions: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For example:
    // localStorage.removeItem('token');
    // sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  const handleViewOrders = () => {
    navigate("/viewOrder");
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
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
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF7A00]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <button className="flex items-center text-gray-700 hover:text-[#FF7A00] transition-colors">
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </button>

                <button
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
