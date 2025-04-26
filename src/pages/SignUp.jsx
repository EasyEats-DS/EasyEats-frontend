
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronRight, Phone } from 'lucide-react';
import FoodieButton from '../components/FoodieButton';
import FoodieInput from '../components/FoodieInput';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
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
        
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
            <FoodieInput
              label="Full Name"
              name="name"
              type="text"
              icon={<User className="w-5 h-5 text-gray-400" />}
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
            />
            
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
