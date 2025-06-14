import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Heart, Star, ArrowLeft } from 'lucide-react';

const PackageDetails = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - adjust this to match your backend
  const API_BASE = 'http://localhost:3000/api';

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch products when package is selected
  useEffect(() => {
    if (selectedPackage) {
      fetchProductsByPackage(selectedPackage._id);
    }
  }, [selectedPackage]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/package/find`);
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      setPackages(data);
      if (data.length > 0) {
        setSelectedPackage(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByPackage = async (packageId) => {
    try {
      const response = await fetch(`${API_BASE}/product/packages/${packageId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      
      // Initialize quantities
      const initialQuantities = {};
      data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    const cartItem = {
      ...product,
      quantity,
      totalPrice: product.price * quantity
    };
    
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * product.price }
            : item
        );
      }
      return [...prev, cartItem];
    });
  };

  const calculateBundlePrice = () => {
    return products.reduce((total, product) => {
      return total + (product.price * (quantities[product._id] || 1));
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading ornaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">श्री</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Traditional Ornaments
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Package Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-amber-800 mb-4">Select Collection</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {packages.map(pkg => (
              <button
                key={pkg._id}
                onClick={() => setSelectedPackage(pkg)}
                className={`flex-shrink-0 px-6 py-3 rounded-full border-2 transition-all ${
                  selectedPackage?._id === pkg._id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg'
                    : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
                }`}
              >
                {pkg.title}
              </button>
            ))}
          </div>
        </div>

        {selectedPackage && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                {selectedPackage.image ? (
                  <img 
                    src={`${API_BASE.replace('/api', '')}/ornaments_image/${selectedPackage.image}`}
                    alt={selectedPackage.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="w-32 h-32 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">💍</span>
                    </div>
                    <p>Package Image</p>
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedPackage.title}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8 rating)</span>
                </div>
              </div>

              {/* Individual Products */}
              <div className="space-y-4 mb-6">
                {products.map(product => (
                  <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img 
                            src={`${API_BASE.replace('/api', '')}/uploads/${product.image}`}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-amber-600">💎</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.title}</h3>
                        <p className="text-amber-600 font-bold">Rs. {product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(product._id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {quantities[product._id] || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, 1)}
                        className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="ml-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bundle Price */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Bundle Price:</span>
                  <span className="text-2xl font-bold text-amber-600">Rs. {calculateBundlePrice()}</span>
                </div>
                <p className="text-sm text-green-600">Save Rs. {Math.max(0, selectedPackage.totalprice - calculateBundlePrice())} with bundle!</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    products.forEach(product => addToCart(product));
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Add Bundle to Cart
                </button>
                <button className="w-full bg-amber-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-amber-800 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {selectedPackage && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Description</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-4">{selectedPackage.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-semibold text-amber-700 mb-3">Traditional Significance</h3>
                  <p className="text-sm">These ornaments carry deep cultural meaning and are essential for various ceremonies and festivals in Newar culture.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-700 mb-3">Craftsmanship</h3>
                  <p className="text-sm">Hand-crafted by skilled artisans using traditional techniques passed down through generations.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Summary (if items in cart) */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-4 border-2 border-amber-200 max-w-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart Summary
            </h3>
            <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.title} x{item.quantity}</span>
                  <span className="font-semibold">Rs. {item.totalPrice}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-amber-600">
                Rs. {cart.reduce((sum, item) => sum + item.totalPrice, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;