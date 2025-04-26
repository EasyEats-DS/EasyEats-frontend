
import React, { useState } from 'react';
import { Clock, MapPin, Upload, ExternalLink, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';


const AdminSettings = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Burger Palace',
    description: 'The best burgers in town, made with fresh ingredients and our special sauce.',
    address: '123 Main St, New York, NY 10001',
    phone: '(123) 456-7890',
    email: 'info@burgerpalace.com',
    website: 'www.burgerpalace.com',
    logo: 'https://source.unsplash.com/random/200x200/?burger-logo',
    coverImage: 'https://source.unsplash.com/random/1200x400/?burger-restaurant',
    openingHours: {
      monday: { open: '10:00', close: '22:00', isOpen: true },
      tuesday: { open: '10:00', close: '22:00', isOpen: true },
      wednesday: { open: '10:00', close: '22:00', isOpen: true },
      thursday: { open: '10:00', close: '22:00', isOpen: true },
      friday: { open: '10:00', close: '23:00', isOpen: true },
      saturday: { open: '11:00', close: '23:00', isOpen: true },
      sunday: { open: '11:00', close: '22:00', isOpen: true },
    },
    deliveryFee: 1.99,
    minimumOrderAmount: 10,
    estimatedDeliveryTime: '15-25',
  });

  
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleOpeningHoursChange = (day, field, value) => {
    setRestaurantInfo((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };
  
  const handleToggleOpenDay = (day) => {
    setRestaurantInfo((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          isOpen: !prev.openingHours[day].isOpen,
        },
      },
    }));
  };
  
  const handleSaveSettings = () => {
    // toast({
    //   title: "Success",
    //   description: "Restaurant settings saved successfully",
    // });
  };
  
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <AdminLayout title="Restaurant Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <FoodieCard interactive={false}>
            <h2 className="text-xl font-bold mb-6">Restaurant Information</h2>
            
            <div className="space-y-4">
              <FoodieInput
                label="Restaurant Name"
                name="name"
                value={restaurantInfo.name}
                onChange={handleInfoChange}
              />
              
              <div>
                <label className="block text-foodie-charcoal font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 border border-foodie-gray focus:outline-none focus:ring-2 focus:ring-foodie-orange/50 focus:border-foodie-orange transition-all"
                  rows={3}
                  value={restaurantInfo.description}
                  onChange={handleInfoChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FoodieInput
                  label="Email"
                  name="email"
                  type="email"
                  value={restaurantInfo.email}
                  onChange={handleInfoChange}
                />
                
                <FoodieInput
                  label="Phone"
                  name="phone"
                  value={restaurantInfo.phone}
                  onChange={handleInfoChange}
                />
              </div>
              
              <FoodieInput
                label="Address"
                name="address"
                icon={<MapPin size={20} />}
                value={restaurantInfo.address}
                onChange={handleInfoChange}
              />
              
              <FoodieInput
                label="Website"
                name="website"
                icon={<ExternalLink size={20} />}
                value={restaurantInfo.website}
                onChange={handleInfoChange}
              />
            </div>
          </FoodieCard>
          
          {/* Opening Hours */}
          <FoodieCard interactive={false}>
            <h2 className="text-xl font-bold mb-6">Opening Hours</h2>
            
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day.key} className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center">
                  <div className="w-28">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={restaurantInfo.openingHours[day.key].isOpen}
                        onChange={() => handleToggleOpenDay(day.key)}
                        className="h-4 w-4 text-foodie-orange focus:ring-foodie-orange border-foodie-gray-dark rounded"
                      />
                      <span className="ml-2 block text-foodie-charcoal">
                        {day.label}
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <input
                      type="time"
                      value={restaurantInfo.openingHours[day.key].open}
                      onChange={(e) => 
                        handleOpeningHoursChange(day.key, 'open', e.target.value)
                      }
                      disabled={!restaurantInfo.openingHours[day.key].isOpen}
                      className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 border border-foodie-gray focus:outline-none focus:ring-2 focus:ring-foodie-orange/50 focus:border-foodie-orange transition-all disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 text-foodie-gray-dark">—</span>
                    <input
                      type="time"
                      value={restaurantInfo.openingHours[day.key].close}
                      onChange={(e) => 
                        handleOpeningHoursChange(day.key, 'close', e.target.value)
                      }
                      disabled={!restaurantInfo.openingHours[day.key].isOpen}
                      className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 border border-foodie-gray focus:outline-none focus:ring-2 focus:ring-foodie-orange/50 focus:border-foodie-orange transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </FoodieCard>
          
          {/* Delivery Settings */}
          <FoodieCard interactive={false}>
            <h2 className="text-xl font-bold mb-6">Delivery Settings</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FoodieInput
                  label="Delivery Fee ($)"
                  name="deliveryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={restaurantInfo.deliveryFee}
                  onChange={handleInfoChange}
                />
                
                <FoodieInput
                  label="Minimum Order Amount ($)"
                  name="minimumOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={restaurantInfo.minimumOrderAmount}
                  onChange={handleInfoChange}
                />
              </div>
              
              <FoodieInput
                label="Estimated Delivery Time (min)"
                name="estimatedDeliveryTime"
                icon={<Clock size={20} />}
                value={restaurantInfo.estimatedDeliveryTime}
                onChange={handleInfoChange}
              />
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start rounded">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Delivery Area</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Contact support to update your restaurant's delivery radius and area.
                  </p>
                </div>
              </div>
            </div>
          </FoodieCard>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Restaurant Images */}
          <FoodieCard interactive={false}>
            <h2 className="text-xl font-bold mb-6">Restaurant Images</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-foodie-charcoal font-medium mb-2">Logo</label>
                <div className="bg-foodie-gray-light rounded-xl overflow-hidden">
                  <div className="aspect-square w-full relative">
                    <img 
                      src={restaurantInfo.logo} 
                      alt="Restaurant Logo" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <label htmlFor="logo-upload" className="cursor-pointer px-3 py-2 bg-white rounded-lg flex items-center">
                        <Upload className="w-4 h-4 mr-1" />
                        <span>Change</span>
                      </label>
                      <input id="logo-upload" type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-foodie-charcoal font-medium mb-2">Cover Image</label>
                <div className="bg-foodie-gray-light rounded-xl overflow-hidden">
                  <div className="aspect-video w-full relative">
                    <img 
                      src={restaurantInfo.coverImage} 
                      alt="Restaurant Cover" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <label htmlFor="cover-upload" className="cursor-pointer px-3 py-2 bg-white rounded-lg flex items-center">
                        <Upload className="w-4 h-4 mr-1" />
                        <span>Change</span>
                      </label>
                      <input id="cover-upload" type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FoodieCard>
          
          <FoodieCard interactive={false}>
            <h2 className="text-xl font-bold mb-6">Restaurant Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Online Status</h3>
                  <p className="text-sm text-foodie-gray-dark">
                    Accept new orders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-foodie-gray-dark rounded-full peer peer-checked:bg-foodie-green peer-focus:ring-4 peer-focus:ring-foodie-green/20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>
          </FoodieCard>
          
          <FoodieButton 
            className="w-full"
            onClick={handleSaveSettings}
          >
            Save Settings
          </FoodieButton>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;