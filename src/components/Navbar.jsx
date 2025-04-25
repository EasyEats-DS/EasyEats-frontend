import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          MyWebsite
        </div>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
