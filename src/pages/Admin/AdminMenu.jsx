
import React, { useState } from 'react';
import { 
  Plus, Edit, Trash, Search, X, Upload, ChevronDown, CheckCircle, AlertCircle 
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieButton from '../../components/FoodieButton';
import FoodieCard from '../../components/FoodieCard';
import FoodieInput from '../../components/FoodieInput';


// Sample menu categories and items
const initialMenuCategories = [
  {
    id: 1,
    name: 'Burgers',
    items: [
      {
        id: 101,
        name: 'Classic Cheeseburger',
        description: 'Beef patty, cheddar cheese, lettuce, tomato, and our special sauce',
        price: 8.99,
        image: 'https://source.unsplash.com/random/400x300/?cheeseburger',
        available: true,
      },
      {
        id: 102,
        name: 'Bacon Deluxe',
        description: 'Beef patty, bacon, cheddar cheese, caramelized onions, and BBQ sauce',
        price: 10.99,
        image: 'https://source.unsplash.com/random/400x300/?bacon-burger',
        available: true,
      },
      {
        id: 103,
        name: 'Mushroom Swiss',
        description: 'Beef patty, swiss cheese, sautéed mushrooms, and truffle aioli',
        price: 11.99,
        image: 'https://source.unsplash.com/random/400x300/?mushroom-burger',
        available: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Sides',
    items: [
      {
        id: 201,
        name: 'French Fries',
        description: 'Crispy golden fries with sea salt',
        price: 3.99,
        image: 'https://source.unsplash.com/random/400x300/?french-fries',
        available: true,
      },
      {
        id: 202,
        name: 'Onion Rings',
        description: 'Crispy battered onion rings with dipping sauce',
        price: 4.99,
        image: 'https://source.unsplash.com/random/400x300/?onion-rings',
        available: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Beverages',
    items: [
      {
        id: 301,
        name: 'Soft Drinks',
        description: 'Cola, Diet Cola, Lemon-Lime, or Root Beer',
        price: 2.49,
        image: 'https://source.unsplash.com/random/400x300/?soft-drink',
        available: true,
      },
      {
        id: 302,
        name: 'Milkshake',
        description: 'Vanilla, Chocolate, or Strawberry',
        price: 4.99,
        image: 'https://source.unsplash.com/random/400x300/?milkshake',
        available: true,
      },
    ],
  },
];

const AdminMenu = () => {
  const [menuCategories, setMenuCategories] = useState(initialMenuCategories);
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


  const handleAddItem = () => {
    // Validation
    if (!newItemData.name || !newItemData.price || !newItemData.categoryId) {

      return;
    }

    // Create new item
    const newItem = {
      id: Date.now(),
      name: newItemData.name,
      description: newItemData.description,
      price: parseFloat(newItemData.price),
      image: newItemData.image || 'https://source.unsplash.com/random/400x300/?food',
      available: newItemData.available,
    };

    // Add item to category
    setMenuCategories((prev) => 
      prev.map((category) =>
        category.id === parseInt(newItemData.categoryId)
          ? { ...category, items: [...category.items, newItem] }
          : category
      )
    );

    // Reset and close modal
    setNewItemData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      available: true,
      image: null,
    });
    setShowNewItemModal(false);

    // toast({
    //   title: "Success",
    //   description: "Item added successfully",
    // });
  };

  const handleAddCategory = () => {
    if (!newCategory) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Please enter a category name",
    //   });
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

    // toast({
    //   title: "Success",
    //   description: "Category added successfully",
    // });
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

    // toast({
    //   title: "Success",
    //   description: "Item deleted successfully",
    // });
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
              onClick={() => setShowNewCategoryModal(true)}
              variant="secondary"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </FoodieButton>
            <FoodieButton
              onClick={() => setShowNewItemModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
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
                <Plus className="w-4 h-4 mr-1" /> Add Item
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in">
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
                <label className="block text-foodie-charcoal font-medium mb-2">
                  Image
                </label>
                <div className="bg-foodie-gray-light rounded-lg border border-foodie-gray p-4 flex flex-col items-center">
                  <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-foodie-gray rounded-lg mb-2">
                    {newItemData.image ? (
                      <img
                        src={typeof newItemData.image === 'string' ? newItemData.image : URL.createObjectURL(newItemData.image)}
                        alt="Preview"
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-foodie-gray-dark">
                        <Upload className="w-8 h-8 mx-auto mb-1" />
                        <p>Upload image</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="item-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewItemData({...newItemData, image: e.target.files[0]});
                      }
                    }}
                  />
                  <label
                    htmlFor="item-image"
                    className="cursor-pointer text-foodie-orange hover:underline text-sm"
                  >
                    Choose file
                  </label>
                </div>
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