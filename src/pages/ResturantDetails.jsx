import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Heart, Plus, Minus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import FoodieButton from '../components/FoodieButton';
import FoodieCard from '../components/FoodieCard';
import { restaurantService } from '../lib/api/resturants';
import { generateAvatarUrl } from '../lib/avatar'

const ResturantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load cart from localStorage
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  });

  // whenever cart changes, persist back to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (item) => {
    const prevRest = localStorage.getItem("cartRestaurantId");
    // if they’re switching restaurants, clear out the old cart
    if (prevRest && prevRest !== id) {
    // optional: confirm("Switch restaurant? Cart will be cleared.")
    setCart([]);
    localStorage.removeItem("cartItems");
  }
  localStorage.setItem("cartRestaurantId", id);

    const updated = [...cart];
    const idx = updated.findIndex(ci => ci.id === item.id);
    if (idx > -1) {
      updated[idx].quantity += 1;
    } else {
      updated.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      });
    }
    setCart(updated);
    localStorage.setItem('cartRestaurantId', id);
  };

  const handleRemoveFromCart = (item) => {
    const updated = [...cart];
    const idx = updated.findIndex(ci => ci.id === item.id);
    if (idx > -1) {
      updated[idx].quantity -= 1;
      if (updated[idx].quantity <= 0) {
        updated.splice(idx, 1);
      }
      setCart(updated);
    }
  };

  const getItemQuantity = (itemId) => {
    const found = cart.find(ci => ci.id === itemId);
    return found ? found.quantity : 0;
  };

  const getTotalItems = () =>
    cart.reduce((sum, ci) => sum + ci.quantity, 0);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const restaurantData = await restaurantService.getRestaurantById(id);
        setRestaurant(restaurantData);

        const menuResponse = await restaurantService.getRestaurantMenu(id);
        const menuItems = menuResponse.menu || [];

        const categories = Array.from(
          new Set(menuItems.map(item => item.category))
        );
        const formattedCategories = categories.map((category, index) => ({
          id: index + 1,
          name: category,
          items: menuItems
            .filter(item => item.category === category)
            .map(item => ({
              id: item._id,
              name: item.name,
              description: item.description,
              price: item.price,
              image:
                item.imageUrl ||
                `/api/placeholder/400/300?text=${encodeURIComponent(item.name)}`,
              popular: item.popular || false,
              isAvailable: item.isAvailable
            }))
        }));

        setMenuCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategory(formattedCategories[0].id);
        }
      } catch (err) {
        console.error('Error loading restaurant data:', err);
        setError('Failed to load restaurant data');
      } finally {
        setLoading(false);
        console.error('Error loading restaurant data:');
      }
    };

    if (id) fetchRestaurantData();
  }, [id]);

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

  if (error) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 text-xl">{error}</p>
          <FoodieButton className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </FoodieButton>
        </div>
      </UserLayout>
    );
  }

  if (!restaurant) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Restaurant not found</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title={restaurant.name || restaurant.restaurantName}>
      {/* Restaurant Header */}
      <div className="relative h-64 rounded-2xl overflow-hidden animate-fade-in">
        <img
          src={restaurant.ResturantCoverImageUrl}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-6 flex items-end space-x-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
            <img
              src={
                restaurant.logo ||
                restaurant.image ||
                generateAvatarUrl(restaurant.name || restaurant.restaurantName)
              }
              alt={`${restaurant.name || restaurant.restaurantName} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">
              {restaurant.name || restaurant.restaurantName}
            </h1>
            <div className="flex items-center mt-1">
              <div className="flex items-center mr-3">
                <Star className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" />
                <span className="ml-1">{restaurant.rating || "4.5"}</span>
                <span className="ml-1 opacity-80">
                  ({restaurant.reviewCount || 0})
                </span>
              </div>
              <div className="flex items-center mr-3">
                <Clock className="w-4 h-4" />
                <span className="ml-1">
                  {restaurant.openingHours || "15-30"} min
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4" />
                <span className="ml-1 truncate max-w-[200px]">
                  {/* {formatAddress(restaurant.address)} */}
                </span>
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
            {menuCategories.length > 0 ? (
              <ul className="space-y-2">
                {menuCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? "bg-[#FF7A00] text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No menu categories available
              </p>
            )}
          </div>
        </aside>

        {/* Menu Items */}
        <div className="flex-1">
          {menuCategories.length > 0 ? (
            menuCategories.map((category) =>
              activeCategory === category.id ? (
                <div key={category.id} className="mb-8 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                  {category.items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {category.items.map((item) => (
                        <FoodieCard
                          key={item.id}
                          interactive={false}
                          className="flex overflow-hidden"
                        >
                          <div className="flex-1 p-4">
                            {item.popular && (
                              <span className="inline-block bg-[#FF7A00] text-white text-xs px-2 py-1 rounded-full mb-2">
                                Popular
                              </span>
                            )}
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                              <p className="font-bold text-gray-800">
                                USD {item.price.toFixed(2)}
                              </p>
                              <div className="flex items-center">
                                {getItemQuantity(item.id) > 0 ? (
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => handleRemoveFromCart(item)}
                                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                      <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="px-3 font-medium">
                                      {getItemQuantity(item.id)}
                                    </span>
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
                  ) : (
                    <p className="text-gray-500">
                      No items available in this category
                    </p>
                  )}
                </div>
              ) : null
            )
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No menu items available for this restaurant
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center z-10 animate-fade-in">
          <FoodieButton
            className="px-8 py-4 shadow-lg"
            size="lg"
            onClick={() => navigate("/cart")}
          >
            View Cart ({getTotalItems()} items)
          </FoodieButton>
        </div>
      )}
    </UserLayout>
  );
};

export default ResturantDetails;