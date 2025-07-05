import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

const PackageDetails = () => {
  const [packages, setPackages] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch packages & ornaments
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get(`api/package/find`);
        setPackages(data);

        const ornamentsData = {};
        for (const pkg of data) {
          const responses = await Promise.all(
            pkg.ornamentId.map((id) => axios.get(`api/ornament/${id}`))
          );
          responses.forEach((res) => {
            setQuantities((prev) => ({
              ...prev,
              [res.data._id]: 1,
            }));
          });
          ornamentsData[pkg._id] = responses.map((r) => r.data);
        }
        setProductsMap(ornamentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const updateQuantity = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = async (pkg) => {
    try {
      for (const ornament of productsMap[pkg._id] || []) {
        await addToCart(ornament, quantities[ornament._id] || 1);
      }
      toast.success("Bundle added to cart");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add bundle to cart");
    }
  };

  const handleBuyNow = (pkg) => {
    const bundleItems = (productsMap[pkg._id] || []).map((ornament) => ({
      ...ornament,
      quantity: quantities[ornament._id] || 1,
    }));
    navigate("/checkout", { state: { bundle: bundleItems } });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-full mx-auto mt-24 px-4 py-8">
        {packages.map((pkg) => {
          const bundlePrice = (productsMap[pkg._id] || []).reduce(
            (sum, prod) => sum + prod.price * (quantities[prod._id] || 1),
            0
          );

          return (
            <div key={pkg._id} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Left: Image */}
              <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={
                    pkg.image
                      ? `http://localhost:3000/ornaments_image/${pkg.image}`
                      : "https://via.placeholder.com/400"
                  }
                  alt={pkg.title}
                  className="w-[430px] h-[480px] rounded-lg shadow-lg"
                />
              </div>
            </div>

              {/* Right: Details */}
              <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-dosis font-bold">{pkg.title}</h1>

                <div className="space-y-4">
                  {(productsMap[pkg._id] || []).map((prod) => (
                    <div
                      key={prod._id}
                      className="flex justify-between items-center rounded-md border bg-white p-3 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.image
                              ? `http://localhost:3000/ornaments_image/${prod.image}`
                              : "https://via.placeholder.com/100"
                          }
                          alt={prod.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-dosis font-semibold">{prod.title}</p>
                          <p className="text-red-500 font-dosis">Rs. {prod.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(prod._id, -1)}
                          className="bg-white border px-2 py-1 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-dosis">{quantities[prod._id] || 1}</span>
                        <button
                          onClick={() => updateQuantity(prod._id, 1)}
                          className="bg-white border px-2 py-1 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <span className="text-lg font-dosis font-semibold">Bundle Price:</span>
                  <span className="text-2xl font-dosis font-bold text-red-600">
                    Rs. {bundlePrice}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(pkg)}
                    className="flex-1 bg-yellow-400 font-dosis text-lg hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(pkg)}
                    className="flex-1 bg-amber-800 font-dosis text-lg hover:bg-amber-900 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Description */}
        {packages.map((pkg) => (
          <div key={pkg._id} className="mt-12 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-dosis font-bold mb-2">Description</h2>
            <p className="text-gray-700 font-dosis text-lg whitespace-pre-line">{pkg.description}</p>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default PackageDetails;
