import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/footer";
import NavBar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";

const OrderCompletePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { removeFromCart } = useCart();
  const [saving, setSaving] = useState(false);

  const { orderData, fromCart = false } = state || {};
  const checkoutItems = orderData?.items || [];

  if (!orderData || checkoutItems.length === 0) {
    return <p className="mt-20 text-center font-dosis">No order data found.</p>;
  }

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

      if (fromCart) {
        for (const item of checkoutItems) {
          await removeFromCart(item.ornamentId);
        }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8">
          {/* Billing Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="flex justify-center text-2xl font-semibold font-dosis text-[#4B2E2E] mb-4 border-b pb-2">
              Billing Details
            </h2>
            <div className="text-gray-700 text-base space-y-2">
              <p>
                <strong>Name:</strong> {orderData.shipping?.firstName}{" "}
                {orderData.shipping?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {orderData.shipping?.email}
              </p>
              <p>
                <strong>Phone:</strong> {orderData.shipping?.phone}
              </p>
              <p>
                <strong>Address:</strong> {orderData.shipping?.address}
              </p>
              <p>
                <strong>Province:</strong> {orderData.shipping?.province}
              </p>
              <p>
                <strong>Shipping:</strong>{" "}
                {orderData.shipping?.method?.replace(/_/g, " ")}
              </p>
            </div>

            {/* Purchased Items */}
            <h2 className="text-2xl font-dosis font-semibold text-[#4B2E2E] mb-4 mt-8">
              Purchased Items
            </h2>
            <div className="flex flex-col gap-6">
              {checkoutItems.map((item, index) => {
                const image = item?.image
                  ? `http://localhost:3000/ornaments_image/${item.image}`
                  : "/fallback-image.png";

                return (
                  <div
                    key={item.ornamentId || index}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={image}
                        alt={item?.title || "Item"}
                        className="w-[80px] h-[80px] object-cover rounded"
                      />
                      <div className="text-lg font-dosis font-semibold text-gray-700">
                        {item?.title || "Unnamed Item"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-md font-dosis font-medium text-red-600">
                      Rs. {(item?.price || 0) * (item?.quantity || 1)} 
                      <p className="font-dosis text-md text-black">x {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Total */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-dosis font-semibold text-[#4B2E2E] mb-4 border-b pb-2">
                Payment & Total
              </h2>
              <div className="text-gray-700 text-base space-y-2">
                <p>
                  <strong>Payment Method:</strong> {orderData.payment?.method}
                </p>
                <p className="text-xl font-dosis font-bold text-red-600">
                  Total: Rs. {orderData.total}
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
      <Footer />
    </div>
  );
};

export default OrderCompletePage;
