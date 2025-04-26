
import React from 'react';
import { ChefHat, Heart, Star, ShoppingCart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white mt-16 border-t">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">FoodieVibe</h3>
            <p className="text-foodie-gray-dark mb-4">
              Delivering happiness with every order. Experience the best local restaurants at your doorstep.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <ChefHat className="w-5 h-5 text-foodie-orange mr-2" />
                <span className="font-medium">2,000+ Restaurants</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">About Us</a></li>
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">Contact Us</a></li>
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">Terms & Conditions</a></li>
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold mb-4">Get Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">Read FAQs</a></li>
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">View All Cities</a></li>
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">Restaurants near me</a></li>
              <li><a href="#" className="text-foodie-gray-dark hover:text-foodie-orange">Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-foodie-gray-dark mb-4">Subscribe to get the latest offers and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-foodie-gray rounded-l-lg focus:outline-none focus:border-foodie-orange"
              />
              <button className="bg-foodie-orange text-white px-4 py-2 rounded-r-lg hover:bg-foodie-orange-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-foodie-gray text-center text-foodie-gray-dark">
          <p>&copy; {new Date().getFullYear()} FoodieVibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;