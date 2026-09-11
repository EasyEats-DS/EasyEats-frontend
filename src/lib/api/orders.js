import axios from "axios";
import { isNotFound } from "./httpErrors";

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

// Fetch all orders (no pagination)
export const fetchAllOrdersNoPagination = async () => {
  const response = await axios.get(`${API_URL}/all`);
  console.log("Full API Response (no pagination):", response.data);
  return response.data.orders;
};

// Fetch orders by user ID
export const fetchOrdersByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data.orders ?? [];
  } catch (error) {
    // The service reports "no orders for this user" as a 404. Having never
    // ordered is a normal state, so surface it as an empty list and let the
    // page show its empty state instead of an error.
    if (isNotFound(error)) return [];
    throw error;
  }
};


// Update a specific order's status
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await axios.put(`${API_URL}/${orderId}/status`, { status: newStatus });
  return response.data;
};

// Delete a specific order by ID
export const deleteOrder = async (orderId) => {
  const response = await axios.delete(`${API_URL}/${orderId}`);
  return response.data;  // { message: 'Order deleted successfully' }
};