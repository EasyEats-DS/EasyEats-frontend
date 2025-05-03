import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Upload, ExternalLink, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';
import { getUserFromToken } from '../../lib/auth';
import { restaurantService } from '../../lib/api/resturants';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AdminSettings = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantId: '',
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    openingHours: '',
    coverImage: '',
    isActive: true,
    deliveryFee: 1.99,
    minimumOrderAmount: 10,
    estimatedDeliveryTime: '15-25',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurant details on component mount
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const user = getUserFromToken();
        if (!user || !user.id) {
          throw new Error('No valid user token found');
        }
        const ownerId = user.id;
        const response = await restaurantService.getRestaurantsByOwnerId(ownerId);
        if (!response || response.length === 0) {
          throw new Error('No restaurant found for this owner');
        }

        const restaurant = response[0]; // Assuming the first restaurant belongs to the owner
        setRestaurantInfo({
          restaurantId: restaurant._id || '',
          name: restaurant.name || '',
          description: restaurant.description || '',
          email: restaurant.contact?.email || '',
          phone: restaurant.contact?.phone || '',
          website: restaurant.contact?.website || '',
          address: restaurant.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          openingHours: restaurant.openingHours || '',
          coverImage: restaurant.ResturantCoverImageUrl || '',
          isActive: restaurant.isActive ?? true,
          deliveryFee: restaurant.deliveryFee || 1.99,
          minimumOrderAmount: restaurant.minimumOrderAmount || 10,
          estimatedDeliveryTime: restaurant.estimatedDeliveryTime || '15-25',
        });
      } catch (err) {
        setError(err.message || 'Failed to load restaurant details');
        console.error('Error fetching restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, []);

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "EasyEats"); 
    data.append("cloud_name", "denqj4zdy"); 
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/denqj4zdy/image/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const { secure_url } = response.data;
      console.log("Image uploaded successfully:", secure_url);
      return secure_url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error.response?.data || error);
      throw new Error("Failed to upload image");
    }
  };

  const handleCoverImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      // Show loading state
      setLoading(true);
      
      // Upload the file to Cloudinary using the existing uploadFile function
      const imageUrl = await uploadFile(file);
      
      // Update the state with the new image URL
      setRestaurantInfo((prev) => ({
        ...prev,
        coverImage: imageUrl,
      }));
      
      // Optional: Show success message
      console.log('Cover image updated successfully');
      toast.success('Cover image updated successfully!');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Error uploading cover image:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleStatusChange = (e) => {
    setRestaurantInfo((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const updateData = {
        name: restaurantInfo.name,
        description: restaurantInfo.description,
        contact: {
          email: restaurantInfo.email,
          phone: restaurantInfo.phone,
          website: restaurantInfo.website,
        },
        address: restaurantInfo.address,
        openingHours: restaurantInfo.openingHours,
        ResturantCoverImageUrl: restaurantInfo.coverImage,
        isActive: restaurantInfo.isActive,
        deliveryFee: parseFloat(restaurantInfo.deliveryFee),
        minimumOrderAmount: parseFloat(restaurantInfo.minimumOrderAmount),
        estimatedDeliveryTime: restaurantInfo.estimatedDeliveryTime,
      };
      await restaurantService.updateRestaurant(restaurantInfo.restaurantId, updateData);
      // Optionally, show a success message
      console.log('Restaurant settings saved successfully');
      toast.success('Restaurant settings saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save restaurant settings');
      console.error('Error saving restaurant settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Restaurant Settings">
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
      <AdminLayout title="Restaurant Settings">
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
    <>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FoodieInput
                  label="Street"
                  name="street"
                  value={restaurantInfo.address.street}
                  onChange={handleAddressChange}
                />
                <FoodieInput
                  label="City"
                  name="city"
                  value={restaurantInfo.address.city}
                  onChange={handleAddressChange}
                />
                <FoodieInput
                  label="State"
                  name="state"
                  value={restaurantInfo.address.state}
                  onChange={handleAddressChange}
                />
                <FoodieInput
                  label="Zip Code"
                  name="zipCode"
                  value={restaurantInfo.address.zipCode}
                  onChange={handleAddressChange}
                />
                <FoodieInput
                  label="Country"
                  name="country"
                  value={restaurantInfo.address.country}
                  onChange={handleAddressChange}
                />
              </div>

              <FoodieInput
                label="Website"
                name="website"
                icon={<ExternalLink size={20} />}
                value={restaurantInfo.website}
                onChange={handleInfoChange}
              />

              <FoodieInput
                label="Opening Hours"
                name="openingHours"
                icon={<Clock size={20} />}
                value={restaurantInfo.openingHours}
                onChange={handleInfoChange}
                placeholder="e.g., 10:00 AM - 10:00 PM"
              />
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
                  <h3 className="text-sm font-medium text-yellow-800">
                    Delivery Area
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Contact support to update your restaurant's delivery radius
                    and area.
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
                <label className="block text-foodie-charcoal font-medium mb-2">
                  Cover Image
                </label>
                <div className="bg-foodie-gray-light rounded-xl overflow-hidden">
                  <div className="aspect-video w-full relative">
                    {restaurantInfo.coverImage ? (
                      <img
                        src={restaurantInfo.coverImage}
                        alt="Restaurant Cover"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-foodie-gray-light">
                        <span className="text-foodie-gray-dark">
                          No image uploaded
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <label
                        htmlFor="cover-upload"
                        className="cursor-pointer px-3 py-2 bg-white rounded-lg flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        <span>
                          {restaurantInfo.coverImage ? "Change" : "Upload"}
                        </span>
                      </label>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverImageChange}
                      />
                    </div>
                  </div>
                </div>
                {loading && (
                  <div className="mt-2 flex items-center">
                    <div className="w-4 h-4 border-2 border-foodie-orange border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-foodie-gray-dark">
                      Uploading image...
                    </span>
                  </div>
                )}
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={restaurantInfo.isActive}
                    onChange={handleStatusChange}
                  />
                  <div className="w-11 h-6 bg-foodie-gray-dark rounded-full peer peer-checked:bg-foodie-green peer-focus:ring-4 peer-focus:ring-foodie-green/20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>
          </FoodieCard>

          <FoodieButton
            className="w-full"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </FoodieButton>
        </div>
      </div>
    </AdminLayout>
    </>
  );
};

export default AdminSettings;