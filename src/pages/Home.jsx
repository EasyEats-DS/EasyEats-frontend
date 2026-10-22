"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  Utensils,
  TrendingUp,
  Award,
  Truck,
  Heart,
  Filter,
} from "lucide-react"
import UserLayout from "../components/UserLayout"
import FoodieCard from "../components/FoodieCard"
import FoodieButton from "../components/FoodieButton"
import Footer from "../components/Footer"
import { restaurantService } from "../lib/api/resturants"

const categories = [
  { id: 1, name: "Pizza", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936071/pizza_n1hfc3.jpg" },
  { id: 2, name: "Burger", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936071/burger_jdrl2z.jpg" },
  { id: 3, name: "Sushi", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936070/sushi_iz5icu.jpg" },
  { id: 4, name: "Pasta", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936071/pasta_xsulik.jpg" },
  { id: 5, name: "Salad", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936072/salad_ysicvd.jpg" },
  { id: 6, name: "Dessert", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936071/summer-desserts_s7ll0l.jpg" },
  { id: 7, name: "Indian", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936071/indian_vzsgb8.jpg" },
  { id: 8, name: "Mexican", image: "https://res.cloudinary.com/denqj4zdy/image/upload/v1745936071/mexican-cuisine-more-than-640x427_wcquia.jpg" },
]

const promos = [
  {
    id: 1,
    title: "50% OFF",
    description: "Get 50% off on your first order",
    code: "WELCOME50",
    backgroundColor: "bg-[#FFE8D2]",
    icon: "discount",
  },
  {
    id: 2,
    title: "Free Delivery",
    description: "Free delivery on orders over $20",
    code: "FREEDEL",
    backgroundColor: "bg-[#D7F9E9]",
    icon: "truck",
  },
  {
    id: 3,
    title: "Family Deal",
    description: "Save $15 on family-sized orders",
    code: "FAMILY15",
    backgroundColor: "bg-[#FFD8E2]",
    icon: "users",
  },
]

const features = [
  {
    id: 1,
    title: "Fast Delivery",
    description: "Get your food delivered in under 30 minutes",
    icon: <Truck className="w-8 h-8 text-white" />,
  },
  {
    id: 2,
    title: "Top Rated",
    description: "We partner with the best restaurants in town",
    icon: <Award className="w-8 h-8 text-white" />,
  },
  {
    id: 3,
    title: "Wide Selection",
    description: "Choose from thousands of restaurants",
    icon: <Utensils className="w-8 h-8 text-white" />,
  },
]

const cuisineFilters = ["All", "American", "Italian", "Asian", "Mexican", "Healthy", "Desserts"]

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)
  const [heroSearch, setHeroSearch] = useState("")

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants()
        const transformedData = data.map((restaurant, index) => ({
          id: restaurant._id,
          name: restaurant.name,
          image: restaurant.ResturantCoverImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
          rating: Number((4.5 + ((index % 5) * 0.1)).toFixed(1)),
          reviewCount: 120 + (index * 35),
          deliveryTime: `${20 + (index % 3) * 5}-${35 + (index % 3) * 5}`,
          deliveryFee: index % 2 === 0 ? "0.00" : "2.49",
          categories: restaurant.description ? restaurant.description.split(" ").slice(0, 3) : ["Delicious", "Food"],
          distance: `${(0.8 + (index * 0.4)).toFixed(1)} miles away`,
          featured: index < 3,
          discount: index < 2 ? (index === 0 ? "20% OFF" : "Free Delivery") : undefined,
        }))
        setRestaurants(transformedData)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch restaurants:", err)
        setError("Failed to load restaurants. Please try again later.")
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      navigate(`/restaurant?search=${encodeURIComponent(heroSearch.trim())}`)
    } else {
      navigate("/restaurant")
    }
  }

  const handleCategoryClick = (categoryName) => {
    navigate(`/restaurant?category=${encodeURIComponent(categoryName)}`)
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#FF7A00] font-medium text-lg">Loading delicious options...</p>
        </div>
      </UserLayout>
    )
  }

  if (error) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-500 font-medium text-lg mb-4">{error}</p>
          <FoodieButton onClick={() => window.location.reload()}>
            Try Again
          </FoodieButton>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="space-y-12 pb-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#FF7A00] to-[#FF9E00] rounded-3xl overflow-hidden shadow-xl animate-[fadeIn_0.5s_ease-out] mt-2 sm:mt-4">
          <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 text-white z-10">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase inline-block mb-4">
                Fast & Delicious Food Delivery
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Hungry? You're in the right place!
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Order food from your favorite local restaurants delivered directly to your doorstep.
              </p>
              <form onSubmit={handleSearchSubmit} className="flex bg-white rounded-full p-2 shadow-2xl max-w-md">
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search restaurants, cuisines, dishes..."
                  className="w-full px-5 py-3 text-gray-800 rounded-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#FF7A00] text-white p-3 rounded-full hover:bg-[#E06900] transition-colors shadow-md"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
            <div className="md:w-1/2 flex justify-center mt-6 md:mt-8">
              <div className="relative mt-2">
                <img
                  src="https://res.cloudinary.com/denqj4zdy/image/upload/v1745936705/3a029dc4cc871caef3e5ddda310b699e_chmho9.jpg"
                  alt="Delicious food"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-white text-[#FF7A00] font-bold text-xl p-4 rounded-full shadow-lg animate-bounce">
                  New!
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-[#FF7A00] to-[#FF9E00] p-3 rounded-xl shadow-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Promos Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-foodie-charcoal">
            <TrendingUp className="mr-2 text-[#FF7A00]" />
            Hot Deals & Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className={`${promo.backgroundColor} p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-white`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-foodie-charcoal">{promo.title}</h3>
                  {promo.icon === "discount" && (
                    <div className="bg-[#FF7A00] p-2 rounded-full">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {promo.icon === "truck" && (
                    <div className="bg-[#00B67A] p-2 rounded-full">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {promo.icon === "users" && (
                    <div className="bg-[#FF4D6D] p-2 rounded-full">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-foodie-charcoal mb-4">{promo.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-white px-3 py-1 rounded-md font-medium text-foodie-orange border border-foodie-orange text-sm">
                    {promo.code}
                  </span>
                  <FoodieButton size="sm" onClick={() => navigate("/restaurant")}>
                    Explore Deals
                  </FoodieButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center text-foodie-charcoal">
              <Utensils className="mr-2 text-[#FF7A00]" />
              Food Categories
            </h2>
            <button
              onClick={() => navigate("/restaurant")}
              className="text-foodie-orange flex items-center hover:underline font-medium text-sm group"
            >
              See all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-square mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                    <p className="text-white font-bold text-sm">{category.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Restaurants Section */}
        <div className="bg-gradient-to-r from-[#FFF6E9] to-[#FFF0DF] p-6 md:p-10 rounded-3xl shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center text-[#FF7A00]">
              <Award className="mr-2 text-[#FF7A00]" />
              Featured Restaurants
            </h2>
            <button
              onClick={() => navigate("/restaurant")}
              className="text-foodie-orange flex items-center hover:underline font-medium text-sm group"
            >
              View all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants
              .filter((r) => r.featured)
              .map((restaurant) => (
                <FoodieCard
                  key={restaurant.id}
                  className="overflow-hidden cursor-pointer bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <div className="relative h-48 -mx-5 -mt-5 mb-4">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    {restaurant.discount && (
                      <div className="absolute top-4 left-4 bg-[#FF7A00] px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                        {restaurant.discount}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-xs font-medium flex items-center text-foodie-orange shadow-md">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {restaurant.deliveryTime} min
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-foodie-charcoal">{restaurant.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-foodie-orange mr-2">
                        <Star className="w-4 h-4 fill-foodie-orange text-foodie-orange" />
                        <span className="ml-1 font-semibold text-sm">{restaurant.rating}</span>
                        <span className="text-foodie-gray-dark text-xs ml-1">({restaurant.reviewCount})</span>
                      </div>
                      <div className="text-foodie-gray-dark text-xs flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {restaurant.distance}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-foodie-gray-light px-2 py-0.5 rounded-md text-xs text-foodie-charcoal border border-gray-100"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-foodie-gray-dark">
                        Delivery: <span className="text-foodie-charcoal font-semibold">${restaurant.deliveryFee}</span>
                      </span>
                      <FoodieButton size="sm">Order Now</FoodieButton>
                    </div>
                  </div>
                </FoodieCard>
              ))}
          </div>
        </div>

        {/* Popular Restaurants Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center text-foodie-charcoal">
              <TrendingUp className="mr-2 text-[#FF7A00]" />
              Popular Restaurants
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-foodie-charcoal transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => navigate("/restaurant")}
                className="text-foodie-orange flex items-center hover:underline font-medium text-sm group"
              >
                See all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 flex flex-wrap gap-2 animate-[fadeIn_0.3s_ease-out]">
              {cuisineFilters.map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter ? "bg-[#FF7A00] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <FoodieCard
                key={restaurant.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="relative h-48 -mx-5 -mt-5 mb-4">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {restaurant.discount && (
                    <div className="absolute top-4 left-4 bg-[#FF7A00] px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                      {restaurant.discount}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-xs font-medium flex items-center text-foodie-orange shadow-md">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {restaurant.deliveryTime} min
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-foodie-charcoal">{restaurant.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-foodie-orange mr-2">
                      <Star className="w-4 h-4 fill-foodie-orange text-foodie-orange" />
                      <span className="ml-1 font-semibold text-sm">{restaurant.rating}</span>
                      <span className="text-foodie-gray-dark text-xs ml-1">({restaurant.reviewCount})</span>
                    </div>
                    <div className="text-foodie-gray-dark text-xs flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {restaurant.distance}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-foodie-gray-light px-2 py-0.5 rounded-md text-xs text-foodie-charcoal border border-gray-100"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-foodie-gray-dark">
                      Delivery: <span className="text-foodie-charcoal font-semibold">${restaurant.deliveryFee}</span>
                    </span>
                    <FoodieButton size="sm">Order Now</FoodieButton>
                  </div>
                </div>
              </FoodieCard>
            ))}
          </div>
        </div>

        {/* App Download Section */}
        <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF9E00] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Get the EasyEats App</h2>
              <p className="text-white text-lg mb-6">
                Download our mobile app for a better experience, faster ordering, and exclusive mobile-only deals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center hover:bg-gray-900 transition-colors">
                  <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="white">
                    <path d="M17.5,2H8.5C6.5,2,5,3.5,5,5.5v13C5,20.5,6.5,22,8.5,22h9c2,0,3.5-1.5,3.5-3.5v-13C21,3.5,19.5,2,17.5,2z M13,20.5h-2v-1h2V20.5z M18,17.5H8V5h10V17.5z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-xl font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center hover:bg-gray-900 transition-colors">
                  <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="white">
                    <path d="M3,20.5V3.5C3,2.9,3.9,2.5,4.4,2.9l12,8.5c0.5,0.4,0.5,1.1,0,1.4l-12,8.5C3.9,21.7,3,21.3,3,20.5z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-xl font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://res.cloudinary.com/denqj4zdy/image/upload/v1745936824/original-378754e0ebbae9c4f837971106630f72_ovi9jn.webp"
                alt="Mobile App"
                className="w-96 h-auto rounded-3xl shadow-2xl border-4 border-white transform -rotate-6"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </UserLayout>
  )
}

export default Home
