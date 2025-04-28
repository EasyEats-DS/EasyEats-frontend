import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronRight, Phone, MapPin, Home, Briefcase } from 'lucide-react';
import FoodieButton from '../components/FoodieButton';
import FoodieInput from '../components/FoodieInput';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER', // Default role for new users
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the field is part of the address object
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Prepare the data for API
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      address: formData.address
    };
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5003/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      const data = await response.json();
      console.log('Signup successful:', data);
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup error:', err);
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
          <p className="mt-3 text-gray-600">Create your account and start ordering!</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FoodieInput
                label="First Name"
                name="firstName"
                type="text"
                icon={<User className="w-5 h-5 text-gray-400" />}
                placeholder="John"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              
              <FoodieInput
                label="Last Name"
                name="lastName"
                type="text"
                icon={<User className="w-5 h-5 text-gray-400" />}
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            
            <FoodieInput
              label="Email Address"
              name="email"
              type="email"
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              placeholder="hello@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
            
            <FoodieInput
              label="Phone Number"
              name="phone"
              type="tel"
              icon={<Phone className="w-5 h-5 text-gray-400" />}
              placeholder="(123) 456-7890"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            
            <div className="relative">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF7A00] focus:border-[#FF7A00] sm:text-sm"
                  required
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="RESTAURANT_OWNER">RESTAURANT_OWNER</option>
                  <option value="DELIVERY_PERSON">DELIVERY_PERSON</option>
                </select>
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <FoodieInput
              label="Password"
              name="password"
              type="password"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              placeholder="Create a password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            
            <FoodieInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              placeholder="Confirm your password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Address Information</h3>
              
              <FoodieInput
                label="Street"
                name="address.street"
                type="text"
                icon={<Home className="w-5 h-5 text-gray-400" />}
                placeholder="123 Main St"
                required
                value={formData.address.street}
                onChange={handleChange}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FoodieInput
                  label="City"
                  name="address.city"
                  type="text"
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  placeholder="New York"
                  required
                  value={formData.address.city}
                  onChange={handleChange}
                />
                
                <FoodieInput
                  label="State"
                  name="address.state"
                  type="text"
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  placeholder="NY"
                  required
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FoodieInput
                  label="Zip Code"
                  name="address.zipCode"
                  type="text"
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  placeholder="10001"
                  required
                  value={formData.address.zipCode}
                  onChange={handleChange}
                />
                
                <FoodieInput
                  label="Country"
                  name="address.country"
                  type="text"
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  placeholder="USA"
                  required
                  value={formData.address.country}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#FF7A00] focus:ring-[#FF7A00] border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the <a href="#" className="text-[#FF7A00]">Terms of Service</a> and{' '}
                <a href="#" className="text-[#FF7A00]">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <FoodieButton
            type="submit"
            className="w-full group"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'} 
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </FoodieButton>
          
          <div className="flex items-center justify-center">
            <span className="text-gray-600">Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="ml-2 font-medium text-[#FF7A00] hover:text-[#FF9E00]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;