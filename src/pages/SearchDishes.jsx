import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, Star, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';

const SearchDishes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  
  // Sample restaurant data
  const restaurants = [
    {
      id: 1,
      name: 'Sushi Haven',
      image: 'https://source.unsplash.com/random/400x300/?sushi',
      cuisine: 'Japanese',
      location: 'Brooklyn, NY',
      deliveryTime: '25-35 min',
      rating: 4.8,
      priceCategory: '$$$'
    },
    {
      id: 2,
      name: 'Burger Palace',
      image: 'https://source.unsplash.com/random/400x300/?burger',
      cuisine: 'American',
      location: 'Manhattan, NY',
      deliveryTime: '20-30 min',
      rating: 4.5,
      priceCategory: '$$'
    },
    {
      id: 3,
      name: 'Pasta Paradise',
      image: 'https://source.unsplash.com/random/400x300/?pasta',
      cuisine: 'Italian',
      location: 'Queens, NY',
      deliveryTime: '30-40 min',
      rating: 4.6,
      priceCategory: '$$'
    }
  ];

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <UserLayout>
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Meal</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-lg focus:ring-[#FF7A00] focus:border-[#FF7A00] focus:outline-none"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center mb-6">
              <Filter className="w-5 h-5 mr-2 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <h4 className="text-gray-700 font-medium mb-4">Price Range</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value="all"
                      checked={priceFilter === 'all'}
                      onChange={() => setPriceFilter('all')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${priceFilter === 'all' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {priceFilter === 'all' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">All Prices</span>
                </label>
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value="under15"
                      checked={priceFilter === 'under15'}
                      onChange={() => setPriceFilter('under15')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${priceFilter === 'under15' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {priceFilter === 'under15' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">$ (Under $15)</span>
                </label>
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value="15to30"
                      checked={priceFilter === '15to30'}
                      onChange={() => setPriceFilter('15to30')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${priceFilter === '15to30' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {priceFilter === '15to30' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">$$ ($15-$30)</span>
                </label>
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value="over30"
                      checked={priceFilter === 'over30'}
                      onChange={() => setPriceFilter('over30')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${priceFilter === 'over30' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {priceFilter === 'over30' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">$$$ ($30+)</span>
                </label>
              </div>
            </div>

            {/* Cuisine Filter */}
            <div className="mb-8">
              <h4 className="text-gray-700 font-medium mb-4">Cuisine</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="cuisine"
                      value="all"
                      checked={cuisineFilter === 'all'}
                      onChange={() => setCuisineFilter('all')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${cuisineFilter === 'all' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {cuisineFilter === 'all' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">All Cuisines</span>
                </label>
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="cuisine"
                      value="american"
                      checked={cuisineFilter === 'american'}
                      onChange={() => setCuisineFilter('american')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${cuisineFilter === 'american' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {cuisineFilter === 'american' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">American</span>
                </label>
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="cuisine"
                      value="italian"
                      checked={cuisineFilter === 'italian'}
                      onChange={() => setCuisineFilter('italian')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${cuisineFilter === 'italian' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {cuisineFilter === 'italian' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">Italian</span>
                </label>
                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="cuisine"
                      value="japanese"
                      checked={cuisineFilter === 'japanese'}
                      onChange={() => setCuisineFilter('japanese')}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${cuisineFilter === 'japanese' ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border border-gray-300 bg-white'}`}>
                      {cuisineFilter === 'japanese' && <div className="rounded-full w-2.5 h-2.5 bg-white"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">Japanese</span>
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h4 className="text-gray-700 font-medium mb-4">Sort By</h4>
              <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:border-gray-300">
                <span>Recommended</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Restaurant Results */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg text-gray-700">{restaurants.length} restaurants found</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <div className="relative h-48">
                    <img 
                      src={restaurant.image || "/placeholder.svg"} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md font-semibold text-gray-800">
                      {restaurant.priceCategory}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
    </UserLayout>
  );
};

export default SearchDishes;