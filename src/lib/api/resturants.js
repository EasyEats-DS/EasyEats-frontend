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
  }
};