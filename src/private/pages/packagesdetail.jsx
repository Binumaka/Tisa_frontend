import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/footer";

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single package and its ornaments
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data } = await axios.get(`/api/package/${id}`);
        setPkg(data);

        const responses = await Promise.all(
          data.ornamentId.map((oid) => axios.get(`/api/ornament/${oid}`))
        );

        const ornamentData = responses.map((res) => res.data);
        setProducts(ornamentData);

        // Set initial quantities
        const initialQuantities = {};
        ornamentData.forEach((prod) => {
          initialQuantities[prod._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError("Failed to load package.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const updateQuantity = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = async () => {
    try {
      for (const prod of products) {
        await addToCart(prod, quantities[prod._id] || 1);
      }
      toast.success("Bundle added to cart");
    } catch (err) {
      toast.error("Failed to add bundle to cart");
    }
  };

  const handleBuyNow = () => {
    const bundleItems = products.map((prod) => ({
      ...prod,
      quantity: quantities[prod._id] || 1,
    }));
    navigate("/checkout", { state: { bundle: bundleItems } });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  if (error || !pkg)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "Package not found."}
      </div>
    );

  const bundlePrice = products.reduce(
    (sum, prod) => sum + prod.price * (quantities[prod._id] || 1),
    0
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-full mx-auto mt-24 px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Package Image */}
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

          {/* Right: Package Details */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-dosis font-bold">{pkg.title}</h1>

            {/* List of Ornaments */}
            <div className="space-y-4">
              {products.map((prod) => (
                <div
                  key={prod._id}
                  className="flex justify-between items-center rounded-md border bg-white p-3"
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

            {/* Total Price */}
            <div className="flex justify-between pt-4 border-t">
              <span className="text-lg font-dosis font-semibold">Bundle Price:</span>
              <span className="text-2xl font-dosis font-bold text-red-600">
                Rs. {bundlePrice}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-400 font-dosis text-lg hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-amber-800 font-dosis text-lg hover:bg-amber-900 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Package Description */}
        <div className="mt-12 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-dosis font-bold mb-2">Description</h2>
          <p className="text-gray-700 font-dosis text-lg whitespace-pre-line">
            {pkg.description}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageDetails;
