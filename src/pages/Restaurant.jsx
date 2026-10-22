"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Search,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  Filter,
  Sparkles,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Heart,
  Store,
  Tag,
  ArrowUpDown,
  UtensilsCrossed,
  RotateCcw,
} from "lucide-react"
import UserLayout from "../components/UserLayout"
import FoodieCard from "../components/FoodieCard"
import FoodieButton from "../components/FoodieButton"
import Footer from "../components/Footer"
import { restaurantService } from "../lib/api/resturants"

const CUISINES = [
  { id: "all", name: "All Cuisines", icon: "🍽️" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burger", name: "Burger", icon: "🍔" },
  { id: "sushi", name: "Sushi / Asian", icon: "🍣" },
  { id: "italian", name: "Italian", icon: "🍝" },
  { id: "mexican", name: "Mexican", icon: "🌮" },
  { id: "healthy", name: "Healthy & Salad", icon: "🥗" },
  { id: "dessert", name: "Dessert & Bakery", icon: "🧁" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "local", name: "Local Cuisine", icon: "🥘" },
]

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "time-asc", label: "Fastest Delivery" },
  { value: "fee-asc", label: "Lowest Delivery Fee" },
  { value: "name-asc", label: "Name (A-Z)" },
]

const Restaurant = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get("category") || "all")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState("grid") // 'grid' | 'list'

  // Quick filter toggles
  const [onlyTopRated, setOnlyTopRated] = useState(false)
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false)
  const [onlyFastDelivery, setOnlyFastDelivery] = useState(false)
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [onlyOpenNow, setOnlyOpenNow] = useState(false)

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favoriteRestaurants") || "[]")
    } catch {
      return []
    }
  })

  // Listen to searchParams updates (e.g. from Home page link clicks)
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const searchParam = searchParams.get("search")
    if (categoryParam) {
      const match = CUISINES.find(
        (c) => c.name.toLowerCase().includes(categoryParam.toLowerCase()) || categoryParam.toLowerCase().includes(c.id)
      )
      if (match) setSelectedCuisine(match.name)
      else setSelectedCuisine(categoryParam)
    }
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [searchParams])

  // Fetch restaurants from backend API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const data = await restaurantService.getAllRestaurants()
        const transformedData = data.map((restaurant, index) => {
          const ratingVal = Number((4.3 + ((index * 3) % 7) * 0.1).toFixed(1))
          const deliveryMin = 20 + ((index * 7) % 25)
          const feeVal = index % 3 === 0 ? 0 : Number((1.5 + (index % 4) * 0.75).toFixed(2))

          // Extract tags from description or name
          let catTags = []
          if (restaurant.description) {
            catTags = restaurant.description
              .replace(/[^a-zA-Z\s]/g, "")
              .split(/\s+/)
              .filter((w) => w.length > 3)
              .slice(0, 3)
          }
          if (catTags.length === 0) {
            catTags = ["Dine-In", "Takeout", "Gourmet"]
          }

          const hasDiscount = index % 2 === 0
          const discountText = index % 4 === 0 ? "20% OFF" : (hasDiscount ? "Free Delivery" : undefined)

          return {
            id: restaurant._id,
            name: restaurant.name || "Untitled Restaurant",
            description: restaurant.description || "Authentic freshly prepared delicious meals.",
            image:
              restaurant.ResturantCoverImageUrl ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            address: restaurant.address
              ? `${restaurant.address.street || ""}, ${restaurant.address.city || ""}`.replace(/^,\s*|,\s*$/g, "")
              : "Colombo, Sri Lanka",
            city: restaurant.address?.city || "Colombo",
            openingHours: restaurant.openingHours || "8:00 AM - 10:00 PM",
            isOpen: restaurant.isActive !== false,
            rating: ratingVal,
            reviewCount: 45 + (index * 29),
            deliveryMinutes: deliveryMin,
            deliveryTime: `${deliveryMin}-${deliveryMin + 15} min`,
            deliveryFee: feeVal,
            formattedFee: feeVal === 0 ? "Free" : `$${feeVal.toFixed(2)}`,
            categories: catTags,
            featured: index < 2,
            discount: discountText,
            menuCount: restaurant.menu?.length || 0,
          }
        })
        setRestaurants(transformedData)
        setError(null)
      } catch (err) {
        console.error("Error loading restaurants:", err)
        setError("Could not load restaurants. Please check your connection and try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Toggle favorite
  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      localStorage.setItem("favoriteRestaurants", JSON.stringify(updated))
      return updated
    })
  }

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCuisine("all")
    setOnlyTopRated(false)
    setOnlyFreeDelivery(false)
    setOnlyFastDelivery(false)
    setOnlyOffers(false)
    setOnlyOpenNow(false)
    setSortBy("recommended")
    setSearchParams({})
  }

  // Filtered & Sorted restaurants
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants]

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.categories.some((c) => c.toLowerCase().includes(q))
      )
    }

    // Cuisine filter
    if (selectedCuisine && selectedCuisine !== "all") {
      const cLower = selectedCuisine.toLowerCase()
      result = result.filter((r) => {
        return (
          r.name.toLowerCase().includes(cLower) ||
          r.description.toLowerCase().includes(cLower) ||
          r.categories.some((cat) => cat.toLowerCase().includes(cLower))
        )
      })
    }

    // Quick filters
    if (onlyTopRated) {
      result = result.filter((r) => r.rating >= 4.5)
    }
    if (onlyFreeDelivery) {
      result = result.filter((r) => r.deliveryFee === 0)
    }
    if (onlyFastDelivery) {
      result = result.filter((r) => r.deliveryMinutes <= 30)
    }
    if (onlyOffers) {
      result = result.filter((r) => Boolean(r.discount))
    }
    if (onlyOpenNow) {
      result = result.filter((r) => r.isOpen)
    }

    // Sorting
    switch (sortBy) {
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "time-asc":
        result.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes)
        break
      case "fee-asc":
        result.sort((a, b) => a.deliveryFee - b.deliveryFee)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Recommended
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return result
  }, [
    restaurants,
    searchQuery,
    selectedCuisine,
    onlyTopRated,
    onlyFreeDelivery,
    onlyFastDelivery,
    onlyOffers,
    onlyOpenNow,
    sortBy,
  ])

  const activeFiltersCount =
    (selectedCuisine !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (onlyTopRated ? 1 : 0) +
    (onlyFreeDelivery ? 1 : 0) +
    (onlyFastDelivery ? 1 : 0) +
    (onlyOffers ? 1 : 0) +
    (onlyOpenNow ? 1 : 0)

  return (
    <UserLayout title="Restaurants">
      <div className="space-y-8 pb-16 animate-[fadeIn_0.3s_ease-out]">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 pt-2">
          <button
            onClick={() => navigate("/")}
            className="hover:text-foodie-orange transition-colors font-medium"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-foodie-charcoal font-semibold">Restaurants Directory</span>
        </nav>

        {/* Directory Header Banner */}
        <div className="relative bg-gradient-to-r from-orange-500 via-[#FF7A00] to-[#FF9E00] rounded-3xl p-8 md:p-10 text-white shadow-lg overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Top Cuisines & Eateries</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
              Discover All Restaurants
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
              Explore local dining favorites, browse delicious menus, and order your favorite dishes
              with lightning-fast delivery to your door.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <Store className="w-4 h-4 text-yellow-300" />
                <span>{restaurants.length} Registered Restaurants</span>
              </div>
              <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>Top Customer Ratings</span>
              </div>
              <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span>Avg. 25-35 Min Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter Bar & Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          {/* Top Bar: Search Input, Sort & View Mode */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants by name, cuisine, city, or dish..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-sm placeholder:text-gray-400 transition-all bg-gray-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & View Modes */}
            <div className="flex items-center gap-3 self-end lg:self-auto">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 hidden sm:inline text-xs font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer text-xs sm:text-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-[#FF7A00] shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-[#FF7A00] shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cuisine Categories Pill Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Filter By Cuisine
              </span>
              {selectedCuisine !== "all" && (
                <button
                  onClick={() => setSelectedCuisine("all")}
                  className="text-xs text-[#FF7A00] hover:underline font-medium"
                >
                  Reset Cuisine
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CUISINES.map((cuisine) => {
                const isActive =
                  selectedCuisine.toLowerCase() === cuisine.name.toLowerCase() ||
                  (cuisine.id === "all" && selectedCuisine === "all")
                return (
                  <button
                    key={cuisine.id}
                    onClick={() => setSelectedCuisine(cuisine.id === "all" ? "all" : cuisine.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-md shadow-orange-500/20"
                        : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                    }`}
                  >
                    <span>{cuisine.icon}</span>
                    <span>{cuisine.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Quick Filters:
            </span>

            <button
              onClick={() => setOnlyTopRated(!onlyTopRated)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                onlyTopRated
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyTopRated ? "fill-white" : "text-yellow-500"}`} />
              <span>4.5+ Rating</span>
            </button>

            <button
              onClick={() => setOnlyFreeDelivery(!onlyFreeDelivery)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                onlyFreeDelivery
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>🛵 Free Delivery</span>
            </button>

            <button
              onClick={() => setOnlyFastDelivery(!onlyFastDelivery)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                onlyFastDelivery
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Under 30 Min</span>
            </button>

            <button
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                onlyOffers
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Special Offers</span>
            </button>

            <button
              onClick={() => setOnlyOpenNow(!onlyOpenNow)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                onlyOpenNow
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open Now</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium hover:underline px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between text-sm text-gray-600 px-1">
          <div>
            Showing <strong className="text-gray-900">{filteredRestaurants.length}</strong> of{" "}
            <strong>{restaurants.length}</strong> restaurants
            {selectedCuisine !== "all" && (
              <span>
                {" "}
                in <span className="text-[#FF7A00] font-semibold">{selectedCuisine}</span>
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="bg-gray-200 h-48 rounded-2xl w-full"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl w-full mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-8 text-center max-w-lg mx-auto">
            <p className="font-semibold text-lg mb-2">Oops! Something went wrong</p>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <FoodieButton onClick={() => window.location.reload()}>Try Again</FoodieButton>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#FF7A00] mb-5 shadow-inner">
              <UtensilsCrossed className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Restaurants Found</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              We couldn't find any restaurants matching your current search or filter criteria. Try
              adjusting your keywords or reset your filters.
            </p>
            <FoodieButton onClick={resetFilters} className="px-6 py-2.5">
              Clear All Filters
            </FoodieButton>
          </div>
        )}

        {/* Restaurant Cards: Grid View */}
        {!loading && !error && filteredRestaurants.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const isFav = favorites.includes(restaurant.id)
              return (
                <FoodieCard
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="group overflow-hidden cursor-pointer bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-52 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-3xl bg-gray-100">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src =
                            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                      {/* Discount Badge */}
                      {restaurant.discount && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{restaurant.discount}</span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, restaurant.id)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all ${
                          isFav
                            ? "bg-red-500 text-white"
                            : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
                        }`}
                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
                      </button>

                      {/* Bottom Image Stats (Delivery time & status) */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                        <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              restaurant.isOpen ? "bg-emerald-400" : "bg-gray-400"
                            }`}
                          ></span>
                          <span>{restaurant.isOpen ? "Open Now" : "Closed"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF7A00] transition-colors line-clamp-1">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center bg-orange-50 text-[#FF7A00] px-2 py-0.5 rounded-md text-xs font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#FF7A00] mr-1" />
                          <span>{restaurant.rating}</span>
                          <span className="text-gray-400 font-normal ml-0.5">
                            ({restaurant.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Address / Location */}
                      <div className="flex items-center text-gray-500 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1 shrink-0" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>

                      {/* Category Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {restaurant.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg text-xs text-gray-600 font-medium transition-colors"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Delivery Fee & Order CTA */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-xs text-gray-400 block">Delivery</span>
                      <span className="text-xs font-bold text-gray-900">
                        {restaurant.formattedFee}
                      </span>
                    </div>

                    <FoodieButton size="sm" className="px-4 py-2 text-xs flex items-center gap-1">
                      <span>View Menu</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </FoodieButton>
                  </div>
                </FoodieCard>
              )
            })}
          </div>
        )}

        {/* Restaurant Cards: List View */}
        {!loading && !error && filteredRestaurants.length > 0 && viewMode === "list" && (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => {
              const isFav = favorites.includes(restaurant.id)
              return (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="group bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center gap-5 transform hover:-translate-y-1"
                >
                  {/* List View Image */}
                  <div className="relative w-full md:w-56 h-48 md:h-36 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60"
                      }}
                    />
                    {restaurant.discount && (
                      <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-md">
                        {restaurant.discount}
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, restaurant.id)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
                        isFav
                          ? "bg-red-500 text-white"
                          : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  {/* List View Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF7A00] transition-colors truncate">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center bg-orange-50 text-[#FF7A00] px-2 py-0.5 rounded-md text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#FF7A00] mr-1" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs mb-2 line-clamp-1">{restaurant.description}</p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[200px]">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            restaurant.isOpen ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        ></span>
                        <span>{restaurant.isOpen ? "Open" : "Closed"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {restaurant.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 px-2.5 py-0.5 rounded-md text-xs text-gray-600 font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* List View CTA */}
                  <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-gray-400 block">Delivery Fee</span>
                      <span className="text-sm font-bold text-gray-900">
                        {restaurant.formattedFee}
                      </span>
                    </div>

                    <FoodieButton size="sm" className="px-5 py-2.5 text-xs whitespace-nowrap">
                      <span>View Menu</span>
                    </FoodieButton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </UserLayout>
  )
}

export default Restaurant
