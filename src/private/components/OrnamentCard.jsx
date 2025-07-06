import { ShoppingCart } from "lucide-react";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWishlist } from "../context/wishlistContext";
import { useCart } from "../context/cartContext";

const OrnamentCard = ({ ornaments = [] }) => {
  const [loading, setLoading] = React.useState(false);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const {addToCart } = useCart();
  const navigate = useNavigate();

  const gotoOrnamentDetails = (id) => {
    navigate(`/ornamentDetail/${id}`);
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
            item.ornamentId === ornamentId ||
            item.ornament?._id === ornamentId
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

  const addtoCart = async (ornament, quantity) => {
    try {
      await addToCart(ornament, quantity);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  const goToCheckout = (ornament) => {
    if (!ornament || !ornament._id) return;
    navigate("/checkout", { state: { ornament } });
  };

  if (!Array.isArray(ornaments)) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-red-500">Invalid ornaments data provided</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
      {ornaments.length > 0 ? (
        ornaments.map((ornament) => {
          if (!ornament || !ornament._id) return null;

          return (
            <div
              key={ornament._id}
              className="relative w-[280px] h-[360px] rounded-[12px] overflow-hidden shadow-md group hover:shadow-lg transition-transform duration-300 cursor-pointer"
              onClick={() => gotoOrnamentDetails(ornament._id)}
            >
              <img
                src={
                  ornament.image
                    ? `http://localhost:3000/ornaments_image/${ornament.image}`
                    : "https://via.placeholder.com/280x360?text=No+Image"
                }
                alt={ornament.title || "Ornament"}
                className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
              />

              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/50">
                <h2 className="text-white text-[20px] font-dosis font-semibold truncate">
                  {ornament.title || "Untitled"}
                </h2>
                <p className="text-white font-dosis text-sm">
                  Rs. {ornament.price || "N/A"}
                </p>
              </div>

              <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between pointer-events-none group-hover:pointer-events-auto">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={(e) => handleWishlist(e, ornament._id)}
                    className="p-2 bg-transparent transition-colors"
                  >
                    {isInWishlist(ornament._id) ? (
                      <FaHeart className="w-5 h-5 text-red-500" />
                    ) : (
                      <FaHeart className="w-5 h-5 text-gray-200 hover:text-red-600" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addtoCart(ornament);
                    }}
                    disabled={loading}
                    className="p-2 rounded-full bg-transparent"
                  >
                    <ShoppingCart className="text-xl text-white hover:text-yellow-400" />
                  </button>
                </div>

                <div className="flex justify-center pl-36">
                  <button
                    className="px-4 py-2 bg-[#4B2E2E] text-white font-dosis font-semibold rounded hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCheckout(ornament);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center w-full h-64">
          <p className="text-gray-500 text-lg">No ornaments available.</p>
        </div>
      )}
    </div>
  );
};

export default OrnamentCard;
