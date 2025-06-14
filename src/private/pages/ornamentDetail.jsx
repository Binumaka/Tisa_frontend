import React, { useState } from 'react';
import { Heart, Star, Minus, Plus, ShoppingCart, CreditCard, Tag, Package } from 'lucide-react';

const OrnamentDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [rating, setRating] = useState(0);

  // Sample ornament data - in real app, this would come from props or API
  const ornament = {
    id: 1,
    title: "Moo (Traditional bangle)",
    price: 1000,
    rating: 3.6,
    weight: "25 gm",
    category: "Ihi (Bel bibaha) and Gufa (Bara Tayegu)",
    tags: ["Bangles"],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    description: "Moo is a traditional Newari bangle worn by young girls during important life rituals such as Ihi (Bel Bibaha) and Barha Tayegu (Gufa). Made typically of silver or silver-plated metal, the Moo is a thick, rounded bangle that may feature simple designs or traditional motifs symbolizing purity and protection. During these ceremonies, which mark the symbolic marriage to the bel fruit and the girl's transition into womanhood, the Moo serves not only as an ornament but also as a spiritual symbol of blessings, cultural identity, and sacred transformation. Often gifted by elders, it holds emotional and cultural significance, sometimes passed down through generations as a cherished heirloom."
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleRating = (starIndex) => {
    setRating(starIndex + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Image Section */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-red-900 to-red-700 p-6 shadow-lg">
                <img
                  src={ornament.image}
                  alt={ornament.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {ornament.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">{ornament.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                  />
                </button>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-red-600">
                Rs. {ornament.price.toLocaleString()}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Weight:</span>
                  <span>{ornament.weight}</span>
                </div>
                
                <div className="flex items-start gap-2 text-gray-600">
                  <Tag className="w-5 h-5 mt-0.5" />
                  <div>
                    <span className="font-medium">Category:</span>
                    <span className="ml-2">{ornament.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="w-5 h-5" />
                  <span className="font-medium">Tags:</span>
                  <div className="flex gap-2">
                    {ornament.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  <ShoppingCart className="w-5 h-5" />
                  Add to cart
                </button>
                <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  <CreditCard className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Rating Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Description */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p>{ornament.description}</p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Rate us now !!</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2, 3, 4].map((starIndex) => (
                <button
                  key={starIndex}
                  onClick={() => handleRating(starIndex)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      starIndex < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {rating > 0 ? `You rated: ${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrnamentDetails;