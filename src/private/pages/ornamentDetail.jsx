import axios from "axios";
import { Minus, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";

const OrnamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [ornament, setOrnament] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchOrnament = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/ornament/${id}`
        );
        setOrnament(response.data);
      } catch (error) {
        console.error("Failed to fetch ornament:", error);
      }
    };
    fetchOrnament();
  }, [id]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) =>
      action === "increase" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleRating = (starIndex) => {
    setRating(starIndex + 1);
  };
  const isInWishlist = (ornamentId) =>
    wishlist?.some(
      (item) =>
        item.ornamentId === ornamentId || item.ornament?._id === ornamentId
    );

  const handleWishlist = async (e, ornamentId) => {
    e.preventDefault();
    e.stopPropagation();

    const itemInWishlist = isInWishlist(ornamentId);

    try {
      if (itemInWishlist) {
        const wishlistItem = wishlist.find(
          (item) =>
            item.ornamentId === ornamentId || item.ornament?._id === ornamentId
        );
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem._id);
          toast.info("Removed from wishlist");
        }
      } else {
        await addToWishlist(ornamentId);
        toast.success("Added to wishlist successfully");
      }
    } catch (err) {
      console.error("Wishlist action failed:", err);
      toast.error("Wishlist action failed");
    }
  };
  const handleAddToCart = async () => {
    try {
      await addToCart(ornament, quantity);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleBuyNow = async () => {
    navigate("/checkout", { state: { ornament: { ...ornament, quantity } } });
  };

  if (!ornament) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading ornament details...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-20 bg-gray-50">
        <div className="max-w-full mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={
                    ornament.image
                      ? `http://localhost:3000/ornaments_image/${ornament.image}`
                      : "https://via.placeholder.com/400"
                  }
                  alt={ornament.title}
                  className="w-[430px] h-[480px] rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="bg-white w-[600px] rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-dosis font-semibold text-gray-900">
                  {ornament.title}
                </h1>
                <button
                  onClick={(e) => handleWishlist(e, ornament._id)}
                  className="p-2 bg-transparent transition-colors"
                >
                  {isInWishlist(ornament._id) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaHeart className="w-6 h-6  text-gray-400 hover:text-red-600" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-dosis font-medium text-gray-600">
                  {ornament.rating || "4.2"}
                </span>
              </div>

              <div className="text-2xl font-dosis font-bold text-red-500 mb-6">
                Rs. {ornament.price}
              </div>

              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="font-dosis text-[15px]">
                  <strong className="font-dosis">Weight:</strong> {ornament.weight || "N/A"}
                </div>
                <div className="font-dosis text-[15px]">
                  <strong className="font-dosis">Category:</strong> {ornament.category || "N/A"}
                </div>
                <div className="font-dosis text-[15px]">
                  <strong className="font-dosis">Tags:</strong> {ornament.tags || "N/A"}
                </div>
              </div>

              <div className="flex items-center gap-14 mb-6">
                <div className="flex w-[150px] h-[45px] px-2 rounded-lg items-center mt-6 gap-6 mb-6 border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-dosis font-medium px-4">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-[200px] font-dosis text-lg bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Add to cart
                </button>
              </div>

              <div className="px-14 space-y-3">
                <button
                  onClick={handleBuyNow}
                  className=" w-1/2 bg-[#4B2E2E] font-dosis hover:bg-amber-900 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="px-10 max-w-full">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm mb-6">
                <h2 className="flex justify-center text-2xl border-b font-dosis font-semibold mb-4">Description</h2>
                <p className="text-gray-700 font-dosis text-[18px] leading-relaxed">
                  {ornament.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Floating Rating Box */}
            <div className="hidden lg:block fixed top-96 right-0 w-[280px]">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Rate us now !!
                </h3>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleRating(i)}
                      className="hover:scale-110 transition-all"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center text-gray-600 text-sm mb-2">
                  {rating > 0
                    ? `You rated: ${rating} star${rating > 1 ? "s" : ""}`
                    : "Click to rate"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrnamentDetails;
