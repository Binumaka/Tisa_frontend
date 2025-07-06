import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AboutUs from "./private/pages/aboutusScreen";
import CheckoutPage from "./private/pages/checkout";
import Dashboard from "./private/pages/dashboard";
import OrderComplete from "./private/pages/orderComplete";
import OrnamentDisplay from "./private/pages/ornament";
import OrnamentDetails from "./private/pages/ornamentDetail";
import OrnamentStore from "./private/pages/packagesdetail";
import PackageDisplay from "./private/pages/packagesDisplay";
import ProfilePage from "./private/pages/profileScreen";
import RentListPage from "./private/pages/rentDetails";
import RentDisplay from "./private/pages/rentlist";
import RentCheckoutPage from "./private/pages/rentOrder";
import RentOrderCompletePage from "./private/pages/rentOrderComplete";
import CartScreen from "./private/pages/shoppingCart";
import OrderList from "./private/pages/viewOrders";
import WishListScreen from "./private/pages/wishlistDisplay";
import SplashPage from "./public/homepage";
import LoginScreen from "./public/Login";
import RegisterPage from "./public/Register";
import ForgotPassword from "./private/Auth/forgetPassword";
import SetNewPassword from "./private/Auth/resetpassword";
import VerificationCode from "./private/Auth/pin";
import RentOrderList from "./private/pages/viewRentOrder";

// Axios config
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        style={{ zIndex: 1000 }}
      />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/setNewPassword" element={<SetNewPassword />} />
        <Route path="/pin" element={<VerificationCode />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/packageDetail/:id" element={<OrnamentStore />} />
        <Route path="/ornamentDetail/:id" element={<OrnamentDetails />} />
        <Route path="/wishlist" element={<WishListScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/ornamentDisplay" element={<OrnamentDisplay />} />
        <Route path="/packageDisplay" element={<PackageDisplay />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order" element={<OrderComplete />} />
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/rent" element={<RentDisplay />} />
        <Route path="/rentdetails/:id" element={<RentListPage />} />
        <Route path="/rentorder" element={<RentCheckoutPage />} />
        <Route path="/rentOrderlist" element={<RentOrderList />} />
        <Route
          path="/rentorderconfirmation"
          element={<RentOrderCompletePage />}
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
