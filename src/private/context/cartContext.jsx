import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userId, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart. Please try again.", error);
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when token or userId changes
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Add to Cart
const addToCart = async (ornament, quantity = 1) => {
  if (!userId || !ornament) {
    console.error("Missing userId or ornament object");
    setError("Invalid user or ornament");
    return;
  }

  try {
    console.log("Adding to cart:", {
      userId,
      ornamentId: ornament._id || ornament,
      quantity,
    });

    const response = await axios.post(
      "/api/cart/save",
      {
        userId,
        ornamentId: ornament._id || ornament, // handles if it's full object or just ID
        quantity,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Cart updated successfully:", response.data);

    setCart(response.data?.items);
  } catch (err) {
    console.error(" Add to cart failed:", err.response?.data || err.message);
    setError("Failed to add item to cart.");
  }
};

const removeFromCart = async (ornamentId) => {
  try {
    await axios.delete(`/api/cart/${userId}/${ornamentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart((prev) => prev.filter((item) => item.ornament._id !== ornamentId));
  } catch (error) {
    console.error("Error deleting cart item", error);
  }
};

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart, // Important for updating cart quantity manually
        loading,
        error,
        addToCart,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
