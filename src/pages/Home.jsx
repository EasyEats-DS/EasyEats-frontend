import React from "react";
import { Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';




const Home = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const user = userType === 'driver' 
    ? JSON.parse(localStorage.getItem('driver'))
    : JSON.parse(localStorage.getItem('Customer'));

  const cards = [
    {
      title: "Browse Restaurants",
      description: "Explore our partner restaurants",
      link: "/restaurant",
      colorClass: "border-orange-500",
      buttonClass: "bg-orange-500 hover:bg-orange-600",
      iconColorClass: "text-orange-500",
      svgPath:
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      buttonText: "Order Now",
    },
    {
      title: "Your Cart",
      description: "Review your selected items",
      link: "/cart",
      colorClass: "border-green-500",
      buttonClass: "bg-green-500 hover:bg-green-600",
      iconColorClass: "text-green-500",
      svgPath:
        "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
      buttonText: "View Cart",
    },
    {
      title: "Your Orders",
      description: "Track your food delivery",
      link: "/order",
      colorClass: "border-blue-500",
      buttonClass: "bg-blue-500 hover:bg-blue-600",
      iconColorClass: "text-blue-500",
      svgPath:
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      buttonText: "Track Order",
    },
    {
      title: "Deliveries",
      description: "Track your food delivery",
      link: userType ? (userType === 'driver' ? "/driver/map" : "/customer/map") : "/login",
      colorClass: "border-blue-500",
      buttonClass: "bg-blue-500 hover:bg-blue-600",
      iconColorClass: "text-blue-500",
      svgPath:
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      buttonText: userType === 'driver' ? "View Deliveries" : "Track Orders"
      
    
    },
    {
      title: "Login",
      description: "Access your account",
      link: "/login",
      colorClass: "border-yellow-500",
      buttonClass: "bg-yellow-500 hover:bg-yellow-600",
      iconColorClass: "text-yellow-500",
      svgPath:
        "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      buttonText: "Sign In",
    },
    {
      title: "Sign Up",
      description: "Create a new account",
      link: "/signup",
      colorClass: "border-purple-500",
      buttonClass: "bg-purple-500 hover:bg-purple-600",
      iconColorClass: "text-purple-500",
      svgPath:
        "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      buttonText: "Join Now",
    },
    {
      title: "Admin Dashboard",
      description: "Manage system settings",
      link: "/admin/dashboard",
      colorClass: "border-indigo-500",
      buttonClass: "bg-indigo-500 hover:bg-indigo-600",
      iconColorClass: "text-indigo-500",
      svgPath:
        "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      buttonText: "Access",
    },
    {
      title: "Payment",
      description: "Manage and complete your payments",
      link: "/payment",
      colorClass: "border-teal-500",
      buttonClass: "bg-teal-500 hover:bg-teal-600",
      iconColorClass: "text-teal-500",
      svgPath:
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      buttonText: "Pay Now",
    },
    {
      title: "forget-password",
      description: "Reset your password",
      link: "/forgot-password",
      colorClass: "border-teal-500",
      buttonClass: "bg-teal-500 hover:bg-teal-600",
      iconColorClass: "text-teal-500",
      svgPath:
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      buttonText: "Reset Password",
    },
    {
      title: "Notification",
      description: "Check your notifications",
      link: "/notification",
      colorClass: "border-red-500",
      buttonClass: "bg-red-500 hover:bg-red-600",
      iconColorClass: "text-red-500",
      svgPath:
        "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
      buttonText: "View Notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 shadow-lg">
        <div className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Welcome to EasyEats
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl">
            Tasty food at your fingertips — Fast, Fresh, and Fabulous!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Order Delicious Food Instantly
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover top restaurants and get your favorite meals delivered at
            lightning speed.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link }
              className="transform hover:scale-105 transition duration-300"
            >
              <div
                className={`bg-white rounded-2xl shadow-md hover:shadow-2xl p-8 text-center ${card.colorClass}`}
              >
                <div className={`${card.iconColorClass} mb-5`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={card.svgPath}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <button
                  className={`${card.buttonClass} text-white font-medium py-2 px-6 rounded-full transition-all duration-300`}
                >
                  {card.buttonText}
                </button>
              </div>
            </Link>
          ))}

          {/* Coming Soon Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border-t-4 border-gray-300">
            <div className="text-gray-500 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-4">More exciting features ahead</p>
            <button className="bg-gray-400 cursor-not-allowed text-white font-medium py-2 px-6 rounded-full">
              Stay Tuned
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <p>© {new Date().getFullYear()} EasyEats. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-400 transition">
              Terms
            </a>
            <a href="#" className="hover:text-orange-400 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-400 transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
