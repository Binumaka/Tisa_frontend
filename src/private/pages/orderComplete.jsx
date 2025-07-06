import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";
import Footer from "../components/footer";

const OrderCompletePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { orderData } = state || {};
  const { cart, removeFromCart } = useCart();
  const [saving, setSaving] = useState(false);

  let checkoutItems = [];

  if (state?.bundle) {
    checkoutItems = state.bundle.map((item) => ({
      ornament: item,
      quantity: item.quantity || 1,
    }));
  } else if (state?.ornament) {
    checkoutItems = [
      {
        ornament: state.ornament,
        quantity: 1,
      },
    ];
  } else {
    checkoutItems = cart;
  }

  if (!orderData)
    return <p className="mt-20 text-center font-dosis">No order data found.</p>;

  let paymentImage = "";
  if (orderData.payment?.method === "ESEWA") {
    paymentImage = "/src/assets/images/Esewa.png";
  } else if (orderData.payment?.method === "KHALTI") {
    paymentImage = "/src/assets/images/Khalti.png";
  }

  const handleConfirmOrder = async () => {
    setSaving(true);
    try {
      await axios.post("/api/order/create", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      for (const item of cart) {
        if (item._id) await removeFromCart(item._id);
      }
      toast.success("Order placed successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mt-20 mx-auto py-6">
        <div
          className="text-white text-2xl font-dosis font-medium py-3 px-3 w-[230px] mb-4"
          style={{
            backgroundColor: "#9f7878",
            clipPath:
              "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
          }}
        >
          Order Confirmation
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
          {/* Billing Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="flex justify-center text-2xl font-semibold font-dosis text-[#4B2E2E] mb-4 border-b pb-2">
              Billing Details
            </h2>
            <div className="text-gray-700 text-base space-y-2">
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Name: </strong> 
                {orderData.shipping?.firstName}{" "}
                {orderData.shipping?.lastName}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Email: </strong> {orderData.shipping?.email}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Phone: </strong> {orderData.shipping?.phone}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Address: </strong> {orderData.shipping?.address}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Province: </strong> {orderData.shipping?.province}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Shipping: </strong>{" "}
                {orderData.shipping?.method.replace(/_/g, " ")}
              </p>
            </div>
            {/* Purchased Items */}
            <h2 className="text-2xl font-dosis font-semibold text-[#4B2E2E] mb-4 mt-8">
              Purchased Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {checkoutItems.map((item) => (
                <div
                  key={item.ornament._id}
                  className="flex justify-between items-center border rounded p-4 bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.ornament?.image
                          ? `http://localhost:3000/ornaments_image/${item.ornament?.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={item.ornament?.title}
                      className="w-[80px] h-[80px] object-cover rounded"
                    />
                    <div>
                      <p className="text-xl font-dosis font-semibold text-gray-800">
                        {item.ornament?.title}
                      </p>
                      <p className="text-md font-dosis text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-md font-dosis font-medium text-red-600">
                    Rs. {item.ornament?.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-dosis font-semibold text-[#4B2E2E] mb-4 border-b pb-2">
                Payment & Total
              </h2>
              <div className="text-gray-700 text-base space-y-2">
                <p className="font-dosis font-medium text-lg">
                  <strong className="font-dosis font-semibold text-lg">Payment Method:</strong> {orderData.payment?.method}
                </p>
                <p className="text-xl font-dosis font-bold text-red-600">
                  Total: Rs.{orderData.total}
                </p>
              </div>
            </div>
            {paymentImage && (
              <div className="flex justify-center mb-20">
                <img
                  src={paymentImage}
                  alt="Payment QR"
                  className="w-60 h-60 object-contain border rounded"
                />
              </div>
            )}
            {/* Confirm Button */}
            <div className="flex justify-center mb-12">
              <button
                onClick={handleConfirmOrder}
                disabled={saving}
                className="bg-[#4B2E2E] hover:bg-[#3c2424] font-dosis text-white text-lg font-semibold px-10 py-3 rounded-[6px] transition"
              >
                {saving ? "Saving..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default OrderCompletePage;
