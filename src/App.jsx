import axios from "axios";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SplashPage from './public/homepage';
import RegisterPage from './public/Register';
import LoginScreen from './public/Login';
import Dashboard from "./private/pages/dashboard";
import OrnamentStore from "./private/pages/packagesdetail";
import OrnamentDetails from "./private/pages/ornamentDetail";

// Axios config
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/packageDetail" element={<OrnamentStore />} />
        <Route path="/ornamentDetail" element={<OrnamentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
