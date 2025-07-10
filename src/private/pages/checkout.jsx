import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import NavBar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const { cart } = useCart();

  let checkoutItems = [];

  if (location.state?.bundle) {
    checkoutItems = location.state.bundle.map((item) => ({
      ornament: item,
      quantity: item.quantity || 1,
    }));
  } else if (location.state?.ornament) {
    checkoutItems = [
      {
        ornament: location.state.ornament,
        quantity: 1,
      },
    ];
  } else {
    checkoutItems = cart;
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    province: "",
    phone: "",
    email: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");

  // Fetch email from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData((prev) => ({
          ...prev,
          email: res.data.email,
        }));
      } catch (error) {
        console.error("Failed to fetch user email", error);
      }
    };

    if (userId && token) {
      fetchUser();
    }
  }, [userId, token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateSubtotal = () =>
    checkoutItems.reduce((total, item) => {
      const price = item.ornament?.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);

  const shippingCost =
    selectedShipping === "INSIDE_THE_VALLEY"
      ? 100
      : selectedShipping === "OUTSIDE_THE_VALLEY"
      ? 300
      : 0;

  const total = calculateSubtotal() + shippingCost;

  const handleSubmit = () => {
    if (!selectedPayment || !selectedShipping) {
      alert("Please select payment and shipping methods.");
      return;
    }

    let paymentMethod;
    let paymentStatus;

    if (selectedPayment === "cod") {
      paymentMethod = "CASH_ON_DELIVERY";
      paymentStatus = "PENDING";
    } else if (selectedPayment === "esewa") {
      paymentMethod = "ESEWA";
      paymentStatus = "PAID";
    } else if (selectedPayment === "khalti") {
      paymentMethod = "KHALTI";
      paymentStatus = "PAID";
    }

    const items = checkoutItems.map((item) => {
      const ornament = item.ornament || item;
      return {
        ornamentId: ornament._id,
        title: ornament.title,
        price: ornament.price,
        image: ornament.image,
        quantity: item.quantity,
      };
    });

    const orderData = {
      userId,
      items,
      shipping: {
        method: selectedShipping,
        cost: shippingCost,
        ...formData,
      },
      payment: {
        method: paymentMethod,
        status: paymentStatus,
      },
      subtotal: calculateSubtotal(),
      shippingCost,
      total,
      status: "PENDING",
      orderDate: new Date(),
    };

    navigate("/order", {
      state: {
        orderData,
        fromCart: !location.state?.ornament && !location.state?.bundle,
      },
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <div className="container mt-20 mx-auto py-6 flex flex-col">
        <div className="relative">
          <div
            className="text-white text-2xl font-dosis py-3 px-8 w-[200px]"
            style={{
              backgroundColor: "#9f7878",
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
            }}
          >
            Checkout
          </div>
        </div>
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row gap-8">
          {/* Billing Details */}
          <div className="w-full lg:w-1/2">
            <h2 className="flex justify-center text-2xl font-dosis font-semibold mb-4">
              Billing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border px-4 py-2 text-lg font-dosis font-medium"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border px-4 py-2 text-lg font-dosis font-medium"
              />
            </div>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="border w-full px-4 py-2 mb-6 text-lg font-dosis font-medium"
            >
              <option value="">Country</option>
              <option value="Nepal">Nepal</option>
              <option value="India">India</option>
              <option value="China">China</option>
              <option value="Austrila">Austrila</option>
            </select>
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="border w-full px-4 py-2 mb-6 text-lg font-dosis font-medium"
            />
            <select
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleInputChange}
              className="border w-full px-4 py-2 mb-6"
            >
              <option value="">Province</option>
              <option value="Province 1">Province 1</option>
              <option value="Province 2">Province 2</option>
              <option value="Province 3">Province 3</option>
              <option value="Province 4">Province 4</option>
              <option value="Province 5">Province 5</option>
              <option value="Province 6">Province 6</option>
              <option value="Province 7">Province 7</option>
            </select>
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="border w-full px-4 py-2 mb-6 text-lg font-dosis font-medium"
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              readOnly
              className="border w-full px-4 py-2 mb-6 text-lg font-dosis font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/2 border p-6 rounded">
            <h2 className="flex justify-center text-2xl font-dosis font-semibold border-b border-gray-100 mb-4">
              Your Order
            </h2>
            {checkoutItems.map((item) => (
              <div
                key={item.ornament._id}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center gap-8">
                  <img
                    src={
                      item.ornament?.image
                        ? `http://localhost:3000/ornaments_image/${item.ornament?.image}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={item.ornament?.title}
                    className="w-[80px] h-[80px] object-cover rounded"
                  />
                  <div className="text-lg font-dosis font-semibold text-gray-700">
                    {item.ornament?.title}
                  </div>
                </div>
                <div className="flex gap-24 text-md font-dosis font-medium text-red-600">
                  <p className="text-md font-dosis font-medium text-gray-600">
                    Quantity: x {item.quantity}
                  </p>
                  Rs. {item.ornament?.price * item.quantity}
                </div>
              </div>
            ))}
            <hr className="my-4" />
            <p>Subtotal: Rs. {calculateSubtotal()}</p>
            <p>Shipping: Rs. {shippingCost}</p>
            <p className="font-bold">Total: Rs. {total}</p>

            <div className="mt-4">
              <h3 className="mb-2">Shipping Method</h3>
              {["INSIDE_THE_VALLEY", "OUTSIDE_THE_VALLEY", "IN_STORE_PICKUP"].map((s) => (
                <label key={s} className="block">
                  <input
                    type="radio"
                    value={s}
                    checked={selectedShipping === s}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="mr-2"
                  />
                  {s.replace(/_/g, " ")}
                </label>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="mb-2">Payment Method</h3>
              {["cod", "esewa", "khalti"].map((p) => (
                <label key={p} className="block">
                  <input
                    type="radio"
                    value={p}
                    checked={selectedPayment === p}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mr-2"
                  />
                  {p.toUpperCase()}
                </label>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="mt-6 bg-[#4B2E2E] font-dosis font-semibold text-white w-[300px] px-4 py-2 rounded"
              >
                {selectedPayment
                  ? `Pay with ${selectedPayment.toUpperCase()}`
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
