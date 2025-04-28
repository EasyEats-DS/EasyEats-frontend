// src/utils/handleLoginSuccess.js

export default function handleLoginSuccess(user, token, navigate) {
    localStorage.setItem('authToken', token);
  
    if (user.role === 'DELIVERY_PERSON') {
      localStorage.setItem('userType', 'driver');
      localStorage.setItem('driver', JSON.stringify(user));
      //navigate('/driver/map');
    } else {
      localStorage.setItem('userType', 'customer');
      localStorage.setItem('Customer', JSON.stringify(user));
      localStorage.removeItem('driver'); // Cleanup if switching roles
      //navigate('/customer/map');
    }
  }
  