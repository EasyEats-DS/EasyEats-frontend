import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Heart, Plus, Minus } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import FoodieButton from '../components/FoodieButton';
import FoodieCard from '../components/FoodieCard';

// Sample restaurant data
const restaurantData = {
  id: 1,
  name: 'Burger Palace',
  image: 'https://source.unsplash.com/random/1200x400/?burger-restaurant',
  coverImage: 'https://source.unsplash.com/random/1200x400/?burger',
  logo: 'https://source.unsplash.com/random/200x200/?burger-logo',
  rating: 4.8,
  reviewCount: 243,
  deliveryTime: '15-25',
  deliveryFee: 2.99,
  categories: ['Burger', 'American', 'Fast Food'],
  address: '123 Main St, New York, NY 10001',
  description: 'The best burgers in town, made with fresh ingredients and our special sauce.',
  openingHours: '10:00 AM - 10:00 PM',
};

// Sample menu categories and items
const menuCategories = [
  {
    id: 1,
    name: 'Popular Items',
    items: [
      {
        id: 101,
        name: 'Classic Cheeseburger',
        description: 'Beef patty, cheddar cheese, lettuce, tomato, and our special sauce',
        price: 8.99,
        image: 'https://source.unsplash.com/random/400x300/?cheeseburger',
        popular: true,
      },
      {
        id: 102,
        name: 'Bacon Deluxe',
        description: 'Beef patty, bacon, cheddar cheese, caramelized onions, and BBQ sauce',
        price: 10.99,
        image: 'https://source.unsplash.com/random/400x300/?bacon-burger',
        popular: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Burgers',
    items: [
      {
        id: 201,
        name: 'Classic Cheeseburger',
        description: 'Beef patty, cheddar cheese, lettuce, tomato, and our special sauce',
        price: 8.99,
        image: 'https://source.unsplash.com/random/400x300/?cheeseburger',
      },
      {
        id: 202,
        name: 'Bacon Deluxe',
        description: 'Beef patty, bacon, cheddar cheese, caramelized onions, and BBQ sauce',
        price: 10.99,
        image: 'https://source.unsplash.com/random/400x300/?bacon-burger',
      },
      {
        id: 203,
        name: 'Mushroom Swiss',
        description: 'Beef patty, swiss cheese, sautéed mushrooms, and truffle aioli',
        price: 11.99,
        image: 'https://source.unsplash.com/random/400x300/?mushroom-burger',
      },
      {
        id: 204,
        name: 'Veggie Burger',
        description: 'Plant-based patty, avocado, lettuce, tomato, and vegan mayo',
        price: 9.99,
        image: 'https://source.unsplash.com/random/400x300/?veggie-burger',
      },
    ],
  },
  {
    id: 3,
    name: 'Sides',
    items: [
      {
        id: 301,
        name: 'French Fries',
        description: 'Crispy golden fries with sea salt',
        price: 3.99,
        image: 'https://source.unsplash.com/random/400x300/?french-fries',
      },
      {
        id: 302,
        name: 'Onion Rings',
        description: 'Crispy battered onion rings with dipping sauce',
        price: 4.99,
        image: 'https://source.unsplash.com/random/400x300/?onion-rings',
      },
    ],
  },
  {
    id: 4,
    name: 'Beverages',
    items: [
      {
        id: 401,
        name: 'Soft Drinks',
        description: 'Cola, Diet Cola, Lemon-Lime, or Root Beer',
        price: 2.49,
        image: 'https://source.unsplash.com/random/400x300/?soft-drink',
      },
      {
        id: 402,
        name: 'Milkshake',
        description: 'Vanilla, Chocolate, or Strawberry',
        price: 4.99,
        image: 'https://source.unsplash.com/random/400x300/?milkshake',
      },
    ],
  },
];

const ResturantDetails = () => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };
  
  const handleRemoveFromCart = (item) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[item.id] > 0) {
        newCart[item.id] -= 1;
        if (newCart[item.id] === 0) {
          delete newCart[item.id];
        }
      }
      return newCart;
    });
  };
  
  const getItemQuantity = (itemId) => {
    return cart[itemId] || 0;
  };
  
  const getTotalItems = () => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  };
  
  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse">
            <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title={restaurantData.name}>
      {/* Restaurant Header */}
      <div className="relative h-64 rounded-2xl overflow-hidden animate-fade-in">
        <img 
          src={restaurantData.coverImage} 
          alt={restaurantData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 flex items-end space-x-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
            <img 
              src={restaurantData.logo} 
              alt={`${restaurantData.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">{restaurantData.name}</h1>
            <div className="flex items-center mt-1">
              <div className="flex items-center mr-3">
                <Star className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" />
                <span className="ml-1">{restaurantData.rating}</span>
                <span className="ml-1 opacity-80">({restaurantData.reviewCount})</span>
              </div>
              <div className="flex items-center mr-3">
                <Clock className="w-4 h-4" />
                <span className="ml-1">{restaurantData.deliveryTime} min</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4" />
                <span className="ml-1 truncate max-w-[200px]">{restaurantData.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
          <Heart className="w-6 h-6 text-white" />
        </button>
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row md:space-x-8">
        {/* Category Navigation */}
        <aside className="md:w-1/4 mb-6 md:mb-0">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 animate-fade-in">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Menu</h3>
            <ul className="space-y-2">
              {menuCategories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                      activeCategory === category.id 
                        ? 'bg-[#FF7A00] text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        
        {/* Menu Items */}
        <div className="flex-1">
          {menuCategories.map((category) => (
            <div 
              key={category.id}
              id={`category-${category.id}`}
              className="mb-8 animate-fade-in"
            >
              <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <FoodieCard key={item.id} interactive={false} className="flex overflow-hidden">
                    <div className="flex-1 p-2">
                      {item.popular && (
                        <span className="inline-block bg-[#FF7A00] text-white text-xs px-2 py-1 rounded-full mb-2">
                          Popular
                        </span>
                      )}
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="font-bold text-gray-800">${item.price.toFixed(2)}</p>
                        <div className="flex items-center">
                          {getItemQuantity(item.id) > 0 ? (
                            <div className="flex items-center">
                              <button 
                                onClick={() => handleRemoveFromCart(item)}
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="px-3 font-medium">{getItemQuantity(item.id)}</span>
                              <button 
                                onClick={() => handleAddToCart(item)}
                                className="p-1 rounded-full bg-[#FF7A00] text-white"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleAddToCart(item)}
                              className="bg-gray-100 hover:bg-[#FF7A00] hover:text-white transition-colors text-gray-700 px-3 py-1 rounded-full flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3 h-auto">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FoodieCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center z-10 animate-fade-in">
          <FoodieButton 
            className="px-8 py-4 shadow-lg"
            size="lg"
          >
            View Cart ({getTotalItems()} items)
          </FoodieButton>
        </div>
      )}
    </UserLayout>
  );
};

export default ResturantDetails;
