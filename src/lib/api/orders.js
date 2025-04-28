import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/orders`;

// Create a new order
export const createOrder = async (orderPayload) => {
  const response = await axios.post(API_URL, orderPayload);
  return response.data; // the newly created order
};

// Fetch all orders with pagination
export const fetchAllOrders = async (page = 1, limit = 10) => {
  const response = await axios.get(API_URL, {
    params: { page, limit },
  });

  console.log("Full API Response:", response.data); 

  return response.data.data.orders; 
};

// Fetch orders by user ID
export const fetchOrdersByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    console.log("Full API Response (User Fetch):", response.data);
    return response.data.orders; 
  };


// Update a specific order's status
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await axios.put(`${API_URL}/${orderId}/status`, { status: newStatus });
  return response.data;
};