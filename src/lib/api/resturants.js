import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const restaurantService = {

  // Create a new restaurant
  createRestaurant: async (restaurantData) => {
    try {
      const response = await api.post('/restaurants', restaurantData);
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },

  // Fetch all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  // Fetch restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  },

  // Fetch menu items for a restaurant
  getRestaurantMenu: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}/menu`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      throw error;
    }
  },

  getRestaurantsByOwnerId: async (ownerId) => {
    try {
      const response = await api.get(`/restaurants/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants by owner ID:', error);
      throw error;
    }
  },

  addMenuItem: async (restaurantId, menuItemData) => {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/menu`, menuItemData);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  deleteMenuItem: async (restaurantId, menuItemId) => {
    try {
      const response = await api.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },
  updateMenuItem: async (restaurantId, menuItemId, updatedData) => {
    try {
      const response = await api.put(
        `/restaurants/${restaurantId}/menu/${menuItemId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },
  updateRestaurant: async (restaurantId, updateData) => {
    try {
      const response = await api.put(
        `/restaurants/${restaurantId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },
};