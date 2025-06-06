import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import FoodieButton from '../components/FoodieButton';
import FoodieInput from '../components/FoodieInput';
import axios from 'axios';
import CryptoJS from 'crypto-js'; // Add this import
import { toast } from 'react-toastify';

import handleLoginSuccess from '../utils/handleLoginSuccess';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // console.log(BASE_URL);

  // const hashPassword = (password) => {
  //   // Using SHA-256 hashing algorithm
  //   // You can add a salt if needed: CryptoJS.SHA256(password + salt).toString()
  //   return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  // };


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // const hashedPassword = hashPassword(password);
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });


      console.log("Login successful:", response.data.data);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      const { token, user } = response.data.data; // Assuming the response includes user data
      handleLoginSuccess(user, token); // Call the utility function to handle login success
      
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user)); // Store user data including role
      }
  
      // Redirect based on user role
      if (user.role === "RESTAURANT_OWNER") {
        // Check if they already have a restaurant
        try {
          const restaurantResponse = await axios.get(`${BASE_URL}/restaurants/owner/${user._id}`);
          // console.log("Restaurant check response:", restaurantResponse);
          
          // Check if the response array has items
          if (restaurantResponse.data.length > 0) {
            navigate("/admin/dashboard"); // User has a restaurant
          } else {
            navigate("/create-restaurant"); // User doesn't have a restaurant
          }
        } catch (error) {
          console.error("Error checking restaurant:", error);
          // If there's an error checking, navigate to create restaurant
          navigate("/create-restaurant");
        }
      }
      else if (user.role === "SUPER_ADMIN") {
        navigate("/superadmin/dashboard"); // Redirect to Super Admin dashboard
      }
      else {
        // Default redirect for other roles
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 animate-[fadeIn_0.3s_ease-out]">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF7A00] to-[#FF9E00] bg-clip-text text-transparent py-1">
            EasyEats
          </h1>
          <p className="mt-3 text-gray-600">Welcome back! Sign in to continue</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
            <FoodieInput
              label="Email Address"
              type="email"
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              placeholder="hello@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <FoodieInput
              label="Password"
              type="password"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#FF7A00] focus:ring-[#FF7A00] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#FF7A00] hover:text-[#FF9E00]">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
          
          <FoodieButton
            type="submit"
            className="w-full group"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'} 
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </FoodieButton>
          
          <div className="flex items-center justify-center">
            <span className="text-gray-600">Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="ml-2 font-medium text-[#FF7A00] hover:text-[#FF9E00]"
            >
              Sign up
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-sm font-medium text-gray-500 hover:text-[#FF7A00]"
            >
              Restaurant Owner? Sign in to admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;