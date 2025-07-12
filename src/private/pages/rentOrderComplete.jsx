import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/Navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";

const RentOrderCompletePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { orderData, items } = state || {};
  const [saving, setSaving] = useState(false);

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
      await axios.post("/api/rentorder/create", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Rent order successfully placed!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save rent order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mt-20 mx-auto py-6">
        <div
          className="text-white text-2xl font-dosis font-medium py-3 px-3 w-[290px] mb-4"
          style={{
            backgroundColor: "#9f7878",
            clipPath:
              "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
          }}
        >
          Rent Order Confirmation
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8">
          {/* Billing Details & Items */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold font-dosis text-[#4B2E2E] mb-4 border-b pb-2 text-center">
              Billing Details
            </h2>
            <div className="text-gray-700 text-base space-y-2">
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Name: </strong>
                {orderData.shipping.firstName} {orderData.shipping.lastName}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Email: </strong> {orderData.shipping.email}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Phone: </strong> {orderData.shipping.phone}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Address: </strong> {orderData.shipping.address}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Province: </strong> {orderData.shipping.province}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Rent Start: </strong> {orderData.rentStartDate}
              </p>
              <p className="font-dosis font-medium text-lg">
                <strong className="font-dosis font-semibold text-lg">Rent End: </strong> {orderData.rentEndDate}
              </p>
            </div>

            {/* Rented Items */}
            <h2 className=" flex justify-center text-2xl font-dosis font-semibold text-[#4B2E2E] mb-4 mt-8">
              Rented Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items?.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border rounded p-4 bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.image
                          ? `http://localhost:3000/uploads/${item.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={item.title}
                      className="w-[80px] h-[70px] object-cover rounded"
                    />
                    <div>
                      <p className="text-xl font-dosis font-semibold text-gray-800">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-md font-dosis font-medium text-red-600">
                    Rs. {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info & Confirm Button */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-dosis font-semibold text-[#4B2E2E] mb-4 border-b pb-2">
                Payment & Total
              </h2>
              <div className="text-gray-700 text-base space-y-2">
                <p className="font-dosis font-medium text-lg">
                  <strong>Payment Method: </strong>
                  {orderData.payment?.method}
                </p>
                <p className="text-xl font-dosis font-bold text-red-600">
                  Total: Rs.{orderData.total}
                </p>
              </div>
            </div>

            {paymentImage && (
              <div className="flex justify-center mt-6 mb-12">
                <img
                  src={paymentImage}
                  alt={`${orderData.payment?.method} QR`}
                  className="w-60 h-60 object-contain border border-gray-300 rounded"
                />
              </div>
            )}

            <div className="flex justify-center mb-6">
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

export default RentOrderCompletePage;
