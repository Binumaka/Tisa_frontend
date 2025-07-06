import { useEffect, useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";

const RentCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth();

  const rentDataFromState = location.state?.rentData;

  useEffect(() => {
    if (!rentDataFromState) {
      navigate("/rent");
    }
  }, [rentDataFromState, navigate]);

  if (!rentDataFromState) return null;

  const [rentData, setRentData] = useState(rentDataFromState);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    country: "Nepal",
    phone: "",
    email: "",
    rentStartDate: "",
    rentEndDate: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRemoveItem = (ornamentId) => {
    setRentData((prev) => ({
      ...prev,
      RentOrnamentId: prev.RentOrnamentId.filter(
        (item) => item._id !== ornamentId
      ),
    }));
  };

  const startDate = formData.rentStartDate
    ? new Date(formData.rentStartDate)
    : null;
  const endDate = formData.rentEndDate ? new Date(formData.rentEndDate) : null;

  let extraCharge = 0;
  let rentalDays = 0;

  if (startDate && endDate) {
    const diffMs = endDate - startDate;
    rentalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (rentalDays > 5) {
      const extraBlocks = Math.floor((rentalDays - 1) / 5);
      extraCharge = extraBlocks * 50;
    }
  }

  const baseTotal = rentData?.totalprice || 0;

  const shippingCost = useMemo(() => {
    if (selectedShipping === "INSIDE_THE_VALLEY") return 100;
    if (selectedShipping === "OUTSIDE_THE_VALLEY") return 300;
    return 0;
  }, [selectedShipping]);

  const finalTotal = useMemo(() => {
    return baseTotal + extraCharge + shippingCost;
  }, [baseTotal, extraCharge, shippingCost]);

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

    const orderData = {
      userId,
      items: rentData.RentOrnamentId.map((orn) => ({
        RentornamentId: orn._id,
      })),
      shipping: {
        method: selectedShipping,
        cost: shippingCost,
        ...formData,
      },
      payment: {
        method: paymentMethod,
        status: paymentStatus,
      },
      subtotal: baseTotal,
      shippingCost: shippingCost,
      total: finalTotal,
      rentStartDate: formData.rentStartDate,
      rentEndDate: formData.rentEndDate,
      status: "PENDING",
    };

    navigate("/rentorderconfirmation", {
      state: { orderData, items: rentData.RentOrnamentId },
    });
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 mt-20 flex flex-col">
        <div className="relative mb-8">
          <div
            className="text-white text-2xl font-dosis py-3 px-4 w-[200px]"
            style={{
              backgroundColor: "#9f7878",
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
            }}
          >
            Rent Checkout
          </div>
        </div>

        <div className="container mx-auto px-8 flex flex-col lg:flex-row gap-16">
          {/* Renting Details */}
          <div className="w-full lg:w-1/2 rounded">
            <h2 className="flex justify-center text-2xl font-dosis font-semibold mb-6">
              Renting Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="border w-full px-4 py-2 mt-4 text-lg font-dosis font-medium"
            />
            <select
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleInputChange}
              className="border w-full px-4 mt-4 py-2"
            >
              <option value="" className="text-lg font-dosis font-medium">
                Province
              </option>
              <option
                value="Province 1"
                className="text-lg font-dosis font-medium"
              >
                Province 1
              </option>
              <option
                value="Province 2"
                className="text-lg font-dosis font-medium"
              >
                Province 2
              </option>
              <option
                value="Province 3"
                className="text-lg font-dosis font-medium"
              >
                Province 3
              </option>
              <option
                value="Province 4"
                className="text-lg font-dosis font-medium"
              >
                Province 4
              </option>
              <option
                value="Province 5"
                className="text-lg font-dosis font-medium"
              >
                Province 5
              </option>
              <option
                value="Province 6"
                className="text-lg font-dosis font-medium"
              >
                Province 6
              </option>
              <option
                value="Province 7"
                className="text-lg font-dosis font-medium"
              >
                Province 7
              </option>
              \
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="date"
                name="rentStartDate"
                value={formData.rentStartDate}
                onChange={handleInputChange}
                className="border px-4 py-2 text-lg font-dosis font-medium"
              />
              <input
                type="date"
                name="rentEndDate"
                value={formData.rentEndDate}
                onChange={handleInputChange}
                className="border px-4 py-2 text-lg font-dosis font-medium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                name="phone"
                placeholder="Phone No."
                value={formData.phone}
                onChange={handleInputChange}
                className="border px-4 py-2 text-lg font-dosis font-medium"
              />
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="border px-4 py-2 text-lg font-dosis font-medium"
              />
            </div>
            {rentalDays > 0 && (
              <p className="mt-4 text-sm text-gray-500">
                Rental Duration: {rentalDays} day{rentalDays > 1 ? "s" : ""}{" "}
                {extraCharge > 0 && (
                  <span className="text-red-500">(+ extra charge)</span>
                )}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/2 border p-6 rounded">
            <h2 className="flex justify-center text-2xl font-dosis font-semibold mb-4">
              Your Rent Order
            </h2>
            {rentData.RentOrnamentId.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between mb-4 bg-white shadow-sm rounded p-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:3000/uploads/${item.image}`
                    }
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium font-dosis">{item.title}</p>
                    <p className="text-red-500 font-dosis text-sm">
                      Rs. {item.price}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item._id)}>
                  <FiTrash2 className="text-red-500" />
                </button>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <p className="flex justify-between mb-2">
                <span className="font-dosis text-lg font-medium">
                  Sub Total
                </span>
                <span className="font-dosis text-lg font-medium">
                  Rs. {baseTotal}
                </span>
              </p>
              {extraCharge > 0 && (
                <p className="flex justify-between mb-2 text-red-500">
                  <span className="font-dosis text-lg font-medium">
                    Extra Charge
                  </span>
                  <span className="font-dosis text-lg font-medium">
                    + Rs. {extraCharge}
                  </span>
                </p>
              )}
              {shippingCost > 0 && (
                <p className="flex justify-between mb-2 text-red-500">
                  <span className="font-dosis text-lg font-medium">
                    Shipping
                  </span>
                  <span className="font-dosis text-lg font-medium">
                    + Rs. {shippingCost}
                  </span>
                </p>
              )}
              <p className="flex justify-between font-bold text-red-500">
                <span className="font-dosis text-lg font-medium">
                  Grand Total
                </span>
                <span className="font-dosis text-lg font-medium">
                  Rs. {finalTotal}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-dosis text-lg font-semibold">
                Shipping Method
              </h3>
              {[
                "IN_STORE_PICKUP",
                "INSIDE_THE_VALLEY",
                "OUTSIDE_THE_VALLEY",
              ].map((method) => (
                <label
                  key={method}
                  className="block font-dosis text-lg font-medium"
                >
                  <input
                    type="radio"
                    value={method}
                    checked={selectedShipping === method}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="mr-2"
                  />
                  {method.replace(/_/g, " ")}
                </label>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-dosis text-lg font-semibold">
                Payment Method
              </h3>
              {["cod", "esewa", "khalti"].map((method) => (
                <label
                  key={method}
                  className="block font-dosis text-lg font-medium"
                >
                  <input
                    type="radio"
                    value={method}
                    checked={selectedPayment === method}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mr-2"
                  />
                  {method.toUpperCase()}
                </label>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="mt-6 w-[350px] bg-[#4B2E2E] hover:bg-[#B38686] text-white px-4 py-3 rounded-[6px] text-center"
              >
                Pay with{" "}
                {selectedPayment ? selectedPayment.toUpperCase() : "METHOD"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RentCheckoutPage;
