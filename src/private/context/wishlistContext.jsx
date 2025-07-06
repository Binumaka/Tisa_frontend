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
      const response = await axios.get(`/api/Wishlist/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (error) {
      console.error("Failed to fetch Wishlist. Please try again.", error);
      setError("Failed to fetch Wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Wishlist when token or userId changes
  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  //  Add to Wishlist
  const addToWishlist = async (ornamentId) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/wishlist/",
        { userId,ornamentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlist((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Add to wishlist failed", err);
      setError("Failed to add item to wishlist.");
    }
  };

  //  Remove from Wishlist
  const removeFromWishlist = async (WishlistId) => {
    try {
      await axios.delete(`/api/wishlist/${WishlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist((prev) => prev.filter((wishlist) => wishlist._id !== WishlistId));
    } catch (error) {
      console.error("Error deleting wishlist item", error);
    }
  };

  const toggleWishlist = async (ornamentId) => {
    const isWishlisted = wishlist.some(
      (item) => item.ornament?._id === ornamentId || item._id === ornamentId
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
