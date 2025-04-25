import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
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
            Discover top restaurants and get your favorite meals delivered at lightning speed.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card Template */}
          {[
            {
              title: "Browse Restaurants",
              description: "Explore our partner restaurants",
              link: "/restaurant",
              color: "orange-500",
              hoverColor: "orange-600",
              svgPath:
                "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              buttonText: "Order Now",
            },
            {
              title: "Your Cart",
              description: "Review your selected items",
              link: "/cart",
              color: "green-500",
              hoverColor: "green-600",
              svgPath:
                "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
              buttonText: "View Cart",
            },
            {
              title: "Your Orders",
              description: "Track your food delivery",
              link: "/order",
              color: "blue-500",
              hoverColor: "blue-600",
              svgPath:
                "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              buttonText: "Track Order",
            },
            {
              title: "Login",
              description: "Access your account",
              link: "/login",
              color: "yellow-500",
              hoverColor: "yellow-600",
              svgPath:
                "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              buttonText: "Sign In",
            },
            {
              title: "Sign Up",
              description: "Create a new account",
              link: "/signup",
              color: "purple-500",
              hoverColor: "purple-600",
              svgPath:
                "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
              buttonText: "Join Now",
            },
            {
              title: "Admin Dashboard",
              description: "Manage system settings",
              link: "/dashboard",
              color: "indigo-500",
              hoverColor: "indigo-600",
              svgPath:
                "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
              buttonText: "Access",
            },
            {
              title: "Payment",
              description: "Manage and complete your payments",
              link: "/payment",
              color: "teal-500",
              hoverColor: "teal-600",
              svgPath:
                "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              buttonText: "Pay Now",
            },
          ].map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="transform hover:scale-105 transition duration-300"
            >
              <div
                className={`bg-white rounded-2xl shadow-md hover:shadow-2xl p-8 text-center border-t-4 border-${card.color}`}
              >
                <div className={`text-${card.color} mb-5`}>
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
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <button
                  className={`bg-${card.color} hover:bg-${card.hoverColor} text-white font-medium py-2 px-6 rounded-full transition-all duration-300`}
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
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
            <a href="#" className="hover:text-orange-400 transition">Terms</a>
            <a href="#" className="hover:text-orange-400 transition">Privacy</a>
            <a href="#" className="hover:text-orange-400 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
