import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { userId, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`/api/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch Wishlist. Please try again.", error);
      setError("Failed to fetch Wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  // Add to Wishlist
  const addToWishlist = async (ornamentId) => {
  try {
    console.log("Adding to wishlist:", {
      userId,
      ornamentId
    });

    const response = await axios.post(
      "/api/wishlist/save",
      {
        userId,
        items: [{ ornament: ornamentId }],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Wishlist updated successfully:", response.data);

    setWishlist(response.data?.items);
  } catch (err) {
    console.error(" Add to Wishlist failed:", err.response?.data || err.message);
    setError("Failed to add item to Wishlist.");
  }
};

  // Remove from Wishlist
  const removeFromWishlist = async (ornamentId) => {
    try {
      const response = await axios.delete(`/api/wishlist/${userId}/${ornamentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data:{ornamentId}
      });
      // Update local wishlist by filtering out removed ornament
      setWishlist(response.data?.items || []);
    } catch (error) {
      console.error("Error deleting wishlist item", error);
      setError("Failed to remove item from wishlist.");
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (ornamentId) => {
    const isWishlisted = wishlist.some(
      (item) => item.ornament?._id === ornamentId || item._id ===ornamentId
    );
    if (isWishlisted) {
      await removeFromWishlist(ornamentId);
    } else {
      await addToWishlist(ornamentId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
