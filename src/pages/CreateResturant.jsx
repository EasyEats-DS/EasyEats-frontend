import React, { useState } from 'react';
import { Building, MapPin, Clock, Phone, Mail, Image, Globe, Plus, Trash } from 'lucide-react';
import { restaurantService } from '../lib/api/resturants';
import { getUserFromToken } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const CreateResturant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    openingHours: '',
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    ResturantCoverImageUrl: '',
    isActive: true,
    menu: [] // Leave empty initially; we'll ensure addMenuItem works correctly
  });

  
  // const [menuItem, setMenuItem] = useState({
  //   name: '',
  //   description: '',
  //   price: '',
  //   category: '',
  //   isAvailable: true
  // });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const geocodeAddress = async () => {
    const { street, city, state, zipCode, country } = formData.address;
    const query = `${street}, ${city}, ${state}, ${zipCode}, ${country}`.replace(/\s+/g, '+');
    
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      console.log("Geocoding response:", response); // Debug log
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lon), parseFloat(lat)]; // Returns [longitude, latitude]
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // For development/testing purposes, create a temporary getOwnerId function
  // Remove this and uncomment the real one when authentication is implemented
  const getOwnerId = () => {
    const user = getUserFromToken();
    if (!user) {
      console.error("No user found in token");
      return null;
    }
    return user.id;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Create a new state object to ensure React detects the change
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const newFormData = JSON.parse(JSON.stringify(formData)); // Deep clone
      newFormData[parent][child] = value;
      setFormData(newFormData);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

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

  // const handleMenuItemChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setMenuItem((prev) => {
  //     const updatedMenuItem = {
  //       ...prev,
  //       [name]: type === 'checkbox' ? checked : value
  //     };
  //     console.log("Updated menuItem:", updatedMenuItem); // Debug log
  //     return updatedMenuItem;
  //   });
  // };

  // const addMenuItem = (e) => {
  //   e.preventDefault();
  //   if (menuItem.name && menuItem.price) {
  //     const newMenuItem = {
  //       ...menuItem,
  //       price: parseFloat(menuItem.price) // Ensure price is a number
  //     };
  
  //     // Update formData.menu immutably
  //     setFormData((prev) => {
  //       const updatedMenu = [...prev.menu, newMenuItem];
  //       console.log("Menu after adding item:", updatedMenu); // Debug log to verify
  //       return {
  //         ...prev,
  //         menu: updatedMenu
  //       };
  //     });
  
  //     // Reset menu item form
  //     setMenuItem({
  //       name: '',
  //       description: '',
  //       price: '',
  //       category: '',
  //       isAvailable: true
  //     });
  //   } else {
  //     console.log("Menu item name or price missing:", menuItem); // Debug log for validation
  //   }
  // };

  // const removeMenuItem = (index) => {
  //   const newFormData = JSON.parse(JSON.stringify(formData)); // Deep clone
  //   newFormData.menu.splice(index, 1);
  //   setFormData(newFormData);
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    const ownerId = getOwnerId();
    if (!ownerId) {
      throw new Error('User not authenticated');
    }

    // Geocode the address
    let coordinates = await geocodeAddress();
    console.log("Geocoded coordinates:", coordinates); // Debug log
    const formatedCordinates=[];
    formatedCordinates[0] = coordinates[1];
    formatedCordinates[1] = coordinates[0];
    
    console.log("Formatted coordinates:", formatedCordinates); // Debug log
    if (!coordinates) {
      throw new Error('Could not determine location from address');
    }
    
    console.log("Current formData.menu before formatting:", formData.menu); // Debug log

    // Format menu items
    const formattedMenu = formData.menu.map((item) => ({
      name: item.name,
      description: item.description || '', // Default to empty string if missing
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      category: item.category || '', // Default to empty string if missing
      isAvailable: item.isAvailable !== false // Default to true if not specified
    }));

    console.log("Formatted menu:", formattedMenu); // Debug log

    const payload = {
      ...formData,
      position: {
        coordinates: coordinates
      },
      ownerId
    }

    console.log("Final payload being sent:", payload); // Debug log

    const createdRestaurant = await restaurantService.createRestaurant(payload);
    console.log("Restaurant created successfully:", createdRestaurant);
    navigate('/admin/dashboard');

    setSuccess(true);
    // Reset form after successful submission
    setFormData({
      name: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      openingHours: '',
      contact: {
        phone: '',
        email: '',
        website: ''
      },
      ResturantCoverImageUrl: '',
      isActive: true,
      menu: []
    });
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    setError(error.message || 'Failed to create restaurant');
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className='my-12'>
      <div className="text-center">
      <h1 className='text-3xl font-bold text-foodie-charcoal relative inline-block'>
        Create Your Restaurant
        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-orange-400 rounded-full"></span>
      </h1>
      <p className="mt-4 text-gray-600 max-w-xl mx-auto">
        Start your culinary journey by setting up your restaurant profile. Your details help customers find and enjoy your food.
      </p>
    </div>
      <div className="max-w-6xl mx-auto ">
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
            Restaurant created successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            Error: {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foodie-charcoal">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Restaurant Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter restaurant name"
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your restaurant"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Provide a brief description of your restaurant</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foodie-charcoal">Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Enter street address"
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Hours */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foodie-charcoal">Contact & Hours</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Opening Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleChange}
                      placeholder="e.g., 9:00 AM - 10:00 PM"
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        name="contact.phone"
                        value={formData.contact.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        name="contact.email"
                        value={formData.contact.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="url"
                      name="contact.website"
                      value={formData.contact.website}
                      onChange={handleChange}
                      placeholder="Website URL"
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Status */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foodie-charcoal">Restaurant Status</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => {
                    const newFormData = JSON.parse(JSON.stringify(formData)); // Deep clone
                    newFormData.isActive = e.target.checked;
                    setFormData(newFormData);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-foodie-orange focus:ring-foodie-orange"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (Visible to customers)
                </label>
              </div>
            </div>

{/* Cover Image */}
<div>
  <h2 className="text-xl font-semibold mb-4 text-foodie-charcoal">Restaurant Image</h2>
  <div>
    <label className="block text-sm font-medium mb-2">Cover Image URL</label>
    <div className="relative w-full max-w-md">
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              const secure_url = await uploadFile(file);
              setFormData((prev) => ({
                ...prev,
                ResturantCoverImageUrl: secure_url
              }));
            } catch (error) {
              console.error("Image upload failed:", error);
              setError("Failed to upload image");
            }
          }
        }}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-28 bg-foodie-gray-light rounded-xl border-2 border-dashed border-foodie-orange/50 hover:border-foodie-orange cursor-pointer transition-all duration-300"
      >
        <svg
          className="w-12 h-12 text-foodie-orange/70 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 15a4 4 0 004 4h10a4 4 0 004-4M21 15V9a6 6 0 00-6-6H9a6 6 0 00-6 6v6m6-6l3-3m0 0l3 3m-3-3v12"
          ></path>
        </svg>
        <span className="text-foodie-charcoal/80 font-medium">
          Click to upload an image
        </span>
        <span className="text-sm text-foodie-charcoal/50">
          (PNG, JPG, or GIF)
        </span>
      </label>
    </div>
  </div>
</div>

            {/* Menu Items */}
            {/* <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foodie-charcoal">Menu Items</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={menuItem.name}
                      onChange={handleMenuItemChange}
                      placeholder="Item name"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={menuItem.category}
                      onChange={handleMenuItemChange}
                      placeholder="Category"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={menuItem.price}
                      onChange={handleMenuItemChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button" 
                      onClick={addMenuItem}
                      className="flex items-center justify-center bg-foodie-orange hover:bg-foodie-orange-dark text-white px-4 py-2 rounded-md transition-colors h-10 w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={menuItem.description}
                    onChange={handleMenuItemChange}
                    placeholder="Item description"
                    className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={menuItem.isAvailable}
                    onChange={handleMenuItemChange}
                    className="h-4 w-4 rounded border-gray-300 text-foodie-orange focus:ring-foodie-orange"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                    Available
                  </label>
                </div>

                {formData.menu.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Current Menu Items</h3>
                    <div className="space-y-2">
                      {formData.menu.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{item.name} - ${item.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMenuItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 hover:bg-foodie-orange/90 text-white px-6 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Restaurant'}
            </button>
          </div>
        </form>
      </div>
      </div>

  );
};

export default CreateResturant;