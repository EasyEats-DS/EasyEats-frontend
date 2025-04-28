import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/orders`;

export const fetchAllOrders = async (page = 1, limit = 10) => {
  const response = await axios.get(API_URL, {
    params: { page, limit },
  });

  console.log("Full API Response:", response.data); 

  return response.data.data.orders; 
};