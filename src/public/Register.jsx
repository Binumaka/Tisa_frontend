import axios from "axios";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formValues.username.trim())
      newErrors.username = "Username is required";
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formValues.confirmPassword !== formValues.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await axios.post("/api/auth/register", {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-400 shadow-2xl overflow-hidden max-w-6xl w-full mx-4 flex h-[750px]">
        {/* Left */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <h1 className="text-[42px] font-dosis font-medium text-gray-800 mb-12 text-center">
              Create an account
            </h1>

            {/* Username */}
            <div className="pr-6">
              <label className="block text-md font-dosis font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder="yourusername"
                  className={`w-full h-12 pl-10 font-dosis border rounded-lg text-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="pr-6">
              <label className="block text-md font-dosis font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                  className={`w-full h-12 pl-10 font-dosis border rounded-lg text-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="pr-6">
              <label className="block text-md font-dosis font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full h-12 pl-10 border rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword.password ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="pr-6">
              <label className="block text-md font-dosis font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full h-12 pl-10 border rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword.confirmPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-80 h-12 bg-[#4B2E2E] text-white mt-4 font-dosis rounded-lg text-[20px] font-medium flex items-center justify-center transition-all ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    creating account...
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            {/* Link to Login */}
            <p className="text-sm text-center transform -translate-y-4 font-dosis text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#6646F6] hover:text-blue-500 hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </form>
        </div>
        {/* Right */}
        <div className="w-1/2 h-full">
          <img
            src="src/assets/images/register.png"
            alt="Register Visual"
            className="w-full h-full object-cover rounded-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
