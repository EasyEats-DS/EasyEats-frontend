import axios from 'axios';

const API_URL = 'http://localhost:5003/notifications';

export const sendOrderConfirmation = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/order-confirmation`, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
};

export const sendDeliveryUpdate = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/delivery-update`, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending delivery update:', error);
    throw error;
  }
};