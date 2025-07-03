import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useCart } from "../context/cartContext";

const CartScreen = () => {
  const { cart, setCart, loading, error, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty < 1) return;
    updated[index].quantity = newQty;
    setCart(updated);
  };

  const handleRemove = (CartId) => {
    removeFromCart(CartId);
    toast.success("Item removed from cart!");
  };

  const getTotal = () => {
    return cart.reduce(
      (sum, item) => sum + (item?.ornament?.price || 0) * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-red-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfafa] min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-20 py-8">
        <div className="flex justify-between items-center mb-10">
          <div className="relative">
            <div
              className="text-white text-2xl font-dosis py-3 px-8 w-[200px]"
              style={{
                backgroundColor: "#9f7878",
                clipPath:
                  "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
              }}
            >
              Your Cart
            </div>
          </div>
          <div className="pr-12">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#9f7878] hover:bg-[#7a5e5e] font-dosis font-medium text-white px-4 py-2 rounded-md shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 font-dosis text-center mb-6">{error}</div>}

        <div className="flex flex-col md:flex-row gap-8 px-12">
          {/* Left: Cart Items */}
          <div className="flex-1 md:max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="hidden md:grid grid-cols-5  gap-16 border-b pb-4">
              <div className="font-dosis text-[20px] font-bold">Product</div>
              <div className="font-dosis text-[20px] font-bold">Product Name</div>
              <div className="font-dosis text-[20px] font-bold">Quantity</div>
              <div className="font-dosis text-[20px] font-bold">Price</div>
              <div className="font-dosis text-[20px] font-bold">Remove</div>
            </div>

            {cart.length === 0 ? (
              <div className="text-gray-500 font-dosis text-center col-span-5 mt-10">
                Your cart is empty.
              </div>
            ) : (
              cart.map((item, index) => {
                const ornament = item.ornament;
                if (!ornament) return null;

                return (
                  <div
                    key={item._id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center border-b pb-4"
                  >
                    <div className="mt-2">
                      <img
                        src={
                          ornament.image
                            ? `http://localhost:3000/ornaments_image/${ornament.image}`
                            : "https://via.placeholder.com/100"
                        }
                        alt={ornament.title}
                        className="w-[160px] h-[140px] object-cover rounded"
                      />
                    </div>
                    <div className="text-[18px] font-dosis font-semibold pl-8">
                      {ornament.title}
                    </div>
                    <div className="flex items-center pl-4 gap-2">
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-black font-dosis pl-6">Rs. {ornament.price}</div>
                    <div className="text-center pr-7">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Cart Total */}
          <div className="md:w-[400px] sticky top-28 self-start">
            <div className="bg-white p-6 rounded shadow-md border space-y-4">
              <div className="flex justify-center text-2xl font-dosis font-bold border-b pb-2">
                Cart Total
              </div>
              <div className="flex justify-between ">
                <span className="font-dosis text-lg font-semibold">Sub Total</span>
                <span className="text-red-600 font-dosis font-semibold">Rs. {getTotal()}</span>
              </div>
              <div className="flex justify-between gap-8 text-sm text-gray-500">
                <span className="font-dosis text-lg font-semibold ">Shipping</span>
                <span className="font-dosis text-lg font-medium">Shipping costs are calculated during checkout</span>
              </div>
              <div className="flex justify-between  font-semibold text-black border-t pt-2">
                <span className="font-dosis">Total</span>
                <span className="text-red-600 font-dosis">Rs. {getTotal()}</span>
              </div>
              <div className="flex justify-center">
                <button
                  className="w-[250px] bg-[#9f7878] font-dosis text-[18px] text-white py-2 mt-4 rounded hover:bg-[#7a5e5e]"
                  onClick={() => navigate("/checkout")}
                  disabled={cart.length === 0}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
