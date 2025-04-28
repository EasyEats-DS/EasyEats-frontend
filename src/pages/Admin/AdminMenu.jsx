import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash, Search, X, Upload, ChevronDown, CheckCircle, AlertCircle 
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieButton from '../../components/FoodieButton';
import FoodieCard from '../../components/FoodieCard';
import FoodieInput from '../../components/FoodieInput';
import { getUserFromToken } from '../../lib/auth';
import { restaurantService } from '../../lib/api/resturants';

const AdminMenu = () => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    available: true,
    image: null,
  });
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const user = getUserFromToken();
        if (!user || !user.id) {
          throw new Error('No valid user token found');
        }
        const ownerId = user.id;
        const restaurants = await restaurantService.getRestaurantsByOwnerId(ownerId);
        if (!restaurants || restaurants.length === 0) {
          throw new Error('No restaurant found for this user');
        }
        const restaurant = restaurants[0]; // Assuming one restaurant per user
        setRestaurantId(restaurant._id); // Add this line
        const menuResponse = await restaurantService.getRestaurantMenu(restaurant._id);

        
        
        if (menuResponse && menuResponse.menu) {
          const menuItems = menuResponse.menu;
          const categories = [...new Set(menuItems.map(item => item.category))];
          
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
                image: item.imageUrl || 'https://source.unsplash.com/random/400x300/?food',
                available: item.isAvailable,
              })),
          }));
          
          setMenuCategories(formattedCategories);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load menu data');
        setLoading(false);
        console.error('Error fetching menu data:', err);
      }
    };
  
    fetchMenuData();
  }, []);

  const handleAddItem = async () => {
    if (!newItemData.name || !newItemData.price || !newItemData.categoryId) {
      return;
    }
    const selectedCategory = menuCategories.find(cat => cat.id === parseInt(newItemData.categoryId));
    if (!selectedCategory) {
      return;
    }
    const categoryName = selectedCategory.name;
    const newMenuItem = {
      name: newItemData.name,
      description: newItemData.description,
      price: parseFloat(newItemData.price),
      category: categoryName,
      isAvailable: newItemData.available,
      imageUrl: newItemData.image || 'https://source.unsplash.com/random/400x300/?food',
    };
    try {
      const createdItem = await restaurantService.addMenuItem(restaurantId, newMenuItem);
      const newLocalItem = {
        id: createdItem._id,
        name: createdItem.name,
        description: createdItem.description,
        price: createdItem.price,
        image: createdItem.imageUrl || 'https://source.unsplash.com/random/400x300/?food',
        available: createdItem.isAvailable,
      };
      setMenuCategories((prev) =>
        prev.map((category) =>
          category.id === parseInt(newItemData.categoryId)
            ? { ...category, items: [...category.items, newLocalItem] }
            : category
        )
      );
      setNewItemData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        available: true,
        image: null,
      });
      setShowNewItemModal(false);
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };
  

  const handleAddCategory = () => {
    if (!newCategory) {
      return;
    }

    const newCategoryObj = {
      id: Date.now(),
      name: newCategory,
      items: [],
    };

    setMenuCategories((prev) => [...prev, newCategoryObj]);
    setNewCategory('');
    setShowNewCategoryModal(false);
  };

  const handleDeleteItem = (categoryId, itemId) => {
    setMenuCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          };
        }
        return category;
      })
    );
  };

  const handleToggleAvailability = (categoryId, itemId) => {
    setMenuCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map((item) =>
              item.id === itemId ? { ...item, available: !item.available } : item
            ),
          };
        }
        return category;
      })
    );
  };

  const filteredCategories = menuCategories.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  if (loading) {
    return (
      <AdminLayout title="Menu Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse">
            <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Menu Management">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 text-xl">{error}</p>
          <FoodieButton className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </FoodieButton>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Menu Management">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative">
            <FoodieInput
              placeholder="Search menu items..."
              icon={<Search className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
            {searchQuery && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4 text-foodie-gray-dark" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <FoodieButton
              onClick={() => setShowNewItemModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Menu Item
            </FoodieButton>
          </div>
        </div>
        
        {/* Categories and Items */}
        <div className="space-y-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-foodie-gray-light rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-foodie-gray-dark" />
              </div>
              <h3 className="text-lg font-medium mb-2">No menu items found</h3>
              <p className="text-foodie-gray-dark mb-4">
                {searchQuery
                  ? "Try adjusting your search term"
                  : "Start by adding categories and items to your menu"}
              </p>
              <FoodieButton
                onClick={() => {
                  setSearchQuery('');
                  setShowNewItemModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Menu Item
              </FoodieButton>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <div className="text-sm text-foodie-gray-dark">
                    {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <FoodieCard key={item.id} className="relative overflow-hidden group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button 
                            className="p-2 bg-white rounded-full shadow-md text-foodie-orange hover:bg-foodie-orange hover:text-white transition-colors"
                            onClick={() => {}}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 bg-white rounded-full shadow-md text-foodie-red hover:bg-foodie-red hover:text-white transition-colors"
                            onClick={() => handleDeleteItem(category.id, item.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div 
                        className="w-full h-32 -mx-5 -mt-5 mb-3 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      
                      <p className="text-foodie-gray-dark text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <button 
                          className={`flex items-center text-sm ${
                            item.available 
                              ? 'text-foodie-green' 
                              : 'text-foodie-gray-dark'
                          }`}
                          onClick={() => handleToggleAvailability(category.id, item.id)}
                        >
                          {item.available ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" /> Available
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 mr-1" /> Unavailable
                            </>
                          )}
                        </button>
                      </div>
                    </FoodieCard>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* New Item Modal */}
      {showNewItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in h-[500px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Item</h3>
              <button onClick={() => setShowNewItemModal(false)}>
                <X className="w-6 h-6 text-foodie-gray-dark hover:text-foodie-charcoal" />
              </button>
            </div>
            
            <div className="space-y-4">
              <FoodieInput
                label="Name"
                placeholder="Item name"
                value={newItemData.name}
                onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
              />
              
              <div>
                <label className="block text-foodie-charcoal font-medium mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 border appearance-none focus:outline-none focus:ring-2 focus:ring-foodie-orange/50 focus:border-foodie-orange transition-all"
                    value={newItemData.categoryId}
                    onChange={(e) => setNewItemData({...newItemData, categoryId: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {menuCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foodie-gray-dark pointer-events-none" />
                </div>
              </div>
              
              <FoodieInput
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newItemData.price}
                onChange={(e) => setNewItemData({...newItemData, price: e.target.value})}
              />
              
              <div>
                <label className="block text-foodie-charcoal font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-foodie-orange/50 focus:border-foodie-orange transition-all"
                  rows={3}
                  placeholder="Item description..."
                  value={newItemData.description}
                  onChange={(e) => setNewItemData({...newItemData, description: e.target.value})}
                />
              </div>
              
              <div>
                <FoodieInput
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={newItemData.image}
                  onChange={(e) => setNewItemData({ ...newItemData, image: e.target.value })}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="available"
                  type="checkbox"
                  className="h-4 w-4 text-foodie-orange focus:ring-foodie-orange border-foodie-gray rounded"
                  checked={newItemData.available}
                  onChange={(e) => setNewItemData({...newItemData, available: e.target.checked})}
                />
                <label htmlFor="available" className="ml-2 block text-foodie-charcoal">
                  Item is available
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <FoodieButton
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewItemModal(false)}
              >
                Cancel
              </FoodieButton>
              <FoodieButton
                className="flex-1"
                onClick={handleAddItem}
              >
                Add Item
              </FoodieButton>
            </div>
          </div>
        </div>
      )}
      
      {/* New Category Modal */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Category</h3>
              <button onClick={() => setShowNewCategoryModal(false)}>
                <X className="w-6 h-6 text-foodie-gray-dark hover:text-foodie-charcoal" />
              </button>
            </div>
            
            <FoodieInput
              label="Category Name"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            
            <div className="mt-6 flex gap-4">
              <FoodieButton
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewCategoryModal(false)}
              >
                Cancel
              </FoodieButton>
              <FoodieButton
                className="flex-1"
                onClick={handleAddCategory}
              >
                Add Category
              </FoodieButton>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMenu;