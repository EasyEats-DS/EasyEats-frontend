import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 shadow-md">
        <h1 className="text-3xl font-bold text-white p-6 text-center">Welcome to FoodExpress</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Delicious Food in Just a Few Clicks</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best restaurants in your area and get your favorite meals delivered fast.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link 
            to="/restaurant" 
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl border-l-4 border-orange-500">
              <div className="text-orange-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Browse Restaurants</h3>
              <p className="text-gray-600">Explore our partner restaurants</p>
              <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-full">
                Order Now
              </button>
            </div>
          </Link>

          <Link 
            to="/cart" 
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl border-l-4 border-green-500">
              <div className="text-green-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Your Cart</h3>
              <p className="text-gray-600">Review your selected items</p>
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full">
                View Cart
              </button>
            </div>
          </Link>

          <Link 
            to="/order" 
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl border-l-4 border-blue-500">
              <div className="text-blue-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Your Orders</h3>
              <p className="text-gray-600">Track your food delivery</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full">
                Track Order
              </button>
            </div>
          </Link>

          <Link 
            to="/login" 
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl border-l-4 border-yellow-500">
              <div className="text-yellow-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Login</h3>
              <p className="text-gray-600">Access your account</p>
              <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-full">
                Sign In
              </button>
            </div>
          </Link>

          <Link 
            to="/signup" 
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl border-l-4 border-purple-500">
              <div className="text-purple-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create a new account</p>
              <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-full">
                Join Now
              </button>
            </div>
          </Link>

          <Link 
          to="/dashboard" 
          className="transform hover:scale-105 transition duration-300"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl border-l-4 border-indigo-500">
            <div className="text-indigo-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Admin Dashboard</h3>
            <p className="text-gray-600">Manage system settings</p>
            <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-full">
              Access
            </button>
          </div>
        </Link>


          {/* You can add more cards here or leave this space for future features */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-l-4 border-gray-300">
            <div className="text-gray-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Coming Soon</h3>
            <p className="text-gray-600">More exciting features</p>
            <button className="mt-4 bg-gray-400 cursor-not-allowed text-white font-medium py-2 px-6 rounded-full">
              Stay Tuned
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} FoodExpress. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-orange-400">Terms</a>
            <a href="#" className="hover:text-orange-400">Privacy</a>
            <a href="#" className="hover:text-orange-400">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;