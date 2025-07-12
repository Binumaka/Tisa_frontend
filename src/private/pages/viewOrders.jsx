import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const OrderList = () => {
  const { userId, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/order/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders.", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.patch(`/api/order/${orderId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert(err.response?.data?.message || "Error cancelling order");
    }
  };

  const getStepNumber = (status) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "CONFIRMED":
        return 2;
      case "PROCESSING":
        return 3;
      case "SHIPPED":
        return 4;
      case "DELIVERED":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen font-dosis">
      <NavBar />
      <div className="mt-20 mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <div
            className="text-white font-dosis w-[160px] text-2xl py-2 px-6"
            style={{
              backgroundColor: "#9f7878",
              clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
            }}
          >
            My Orders
          </div>
          <p className="text-gray-600 font-dosis text-lg">
            Review your recent purchases and order status
          </p>
        </div>

        {loading ? (
          <p className="text-center text-xl text-gray-700">Loading your orders...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No orders found.</p>
        ) : (
          <div className="flex flex-col gap-8 px-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-lg p-6 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-md font-dosis font-semibold text-gray-500">Order ID:</p>
                    <p className="text-md font-dosis font-medium text-[#4B2E2E]">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-dosis font-medium text-gray-500">Placed On:</p>
                    <p className="text-md font-dosis">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-[6px] text-md font-dosis font-semibold ${
                      order.status === "CANCELLED"
                        ? "bg-red-100 text-red-500"
                        : order.status === "PENDING"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-lg font-dosis font-bold text-red-600">Total: Rs. {order.total}</p>
                </div>

                <div>
                  <h3 className="font-semibold font-dosis text-[#4B2E2E] mb-2">Items Ordered:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between border-b pb-1 text-gray-700">
                        <span className="font-dosis text-md font-semibold">
                          {item.ornament?.title ||
                            item.ornamentId?.title ||
                            (typeof item.ornamentId === "string"
                              ? item.ornamentId
                              : "Unnamed Item")}
                        </span>
                        <span className="font-dosis text-md font-semibold">x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step Progress Bar */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-20">
                    {["Pending", "Confirmed", "Processing", "Shipping", "Delivered"].map(
                      (label, index) => {
                        const stepNumber = index + 1;
                        const currentStep = getStepNumber(order.status);
                        const isCompleted = currentStep > stepNumber;
                        const isActive = currentStep === stepNumber;

                        return (
                          <div
                            key={label}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold mb-2 ${
                                isCompleted || isActive
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              {isCompleted ? "✓" : stepNumber}
                            </div>
                            <p
                              className={`text-sm ${
                                isCompleted || isActive
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {label}
                            </p>
                            {index < 4 && (
                              <div
                                className={`w-full h-1 mt-2 ${
                                  currentStep > stepNumber
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {order.status === "PENDING" && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-dosis font-semibold px-5 py-2 rounded-md transition"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
