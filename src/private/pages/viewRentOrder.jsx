import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import NavBar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const RentOrderList = () => {
  const { userId, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/rentorder/${userId}`, {
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
      await axios.patch(`/api/rentorder/${orderId}`, null, {
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
    <div className="min-h-screen">
      <NavBar />
      <div className="container mt-20 mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <div
            className="text-white text-2xl font-dosis py-4 px-6 w-[200px]"
            style={{
              backgroundColor: "#9f7878",
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
            }}
          >
            Rental Orders
          </div>
          <p className="text-gray-600 text-lg">
            Track and manage your rented bundles
          </p>
        </div>

        {loading ? (
          <p className="text-center text-xl text-gray-700">
            Loading your rental orders...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No rental orders found.
          </p>
        ) : (
          <div className="flex flex-col gap-6 px-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-lg p-6 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID:</p>
                    <p className="text-md font-semibold text-[#4B2E2E]">
                      {order._id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Rented On:</p>
                    <p className="text-md">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-lg font-bold text-red-600">
                    Total: Rs. {order.total}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#4B2E2E] mb-2">
                    Included Ornaments:
                  </h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => {
                      const ornament = item?.RentornamentId;
                      return (
                        <li key={index} className="text-gray-700">
                          <span className="font-medium">
                            {ornament?.title || "Unnamed Item"}
                          </span>
                          {ornament?.price && (
                            <span className="ml-2 text-sm text-red-500">
                              Rs. {ornament.price}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Step Progress Bar */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mt-4 px-4 relative">
                    {[
                      "Pending",
                      "Confirmed",
                      "Processing",
                      "Shipping",
                      "Delivered",
                    ].map((label, index, arr) => {
                      const stepNumber = index + 1;
                      const currentStep = getStepNumber(order.status);
                      const isCompleted = currentStep > stepNumber;
                      const isActive = currentStep === stepNumber;

                      return (
                        <div
                          key={label}
                          className="flex flex-col items-center relative z-10 w-[60px]"
                        >
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold mb-1 ${
                              isCompleted || isActive
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {isCompleted ? "✓" : stepNumber}
                          </div>
                          <p
                            className={`text-[12px] text-center ${
                              isCompleted || isActive
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {label}
                          </p>
                          {/* Connector line */}
                          {index < arr.length - 1 && (
                            <div
                              className={`absolute top-4 left-[50%] w-[100%] h-1 z-[-1] ${
                                currentStep > stepNumber
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                              style={{
                                width: "100px",
                                transform: "translateX(40%)",
                              }}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {order.status === "PENDING" && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-md transition"
                    >
                      Cancel Rental
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RentOrderList;
