import axios from "axios";
import {
  Calendar,
  Camera,
  Clock,
  Edit3,
  Home,
  LogOut,
  Mail,
  Package,
  Save,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { userId, token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [rentOrders, setRentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [userRes, purchaseRes, rentRes] = await Promise.all([
          axios.get(`/api/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/order/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/rentorder/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setFormData({
          username: userRes.data.username,
          email: userRes.data.email,
          image: userRes.data.image,
        });
        setPurchaseOrders(purchaseRes.data);
        setRentOrders(rentRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId, token]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      username: user.username,
      email: user.email,
      image: user.image,
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (imageFile) {
        // If image is selected, upload using multipart
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("image", imageFile);

        const { data } = await axios.post(
          `/api/auth/imageupload`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUser(data.user);
      } else {
        // If no image selected, send a normal JSON update
        const { data } = await axios.put(
          `/api/user/${userId}`,
          {
            username: formData.username,
            email: formData.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(data.user);
      }
      window.location.reload();
      setEditing(false);
      setImageFile(null);
      setImagePreview(null);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    try {
      await axios.delete(`/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully.");
      logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
      case "pending":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mt-20 mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-32 translate-x-32 opacity-30"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow-xl ring-4 ring-white">
                    {imagePreview || user?.image ? (
                      <img
                        src={
                          imagePreview || `http://localhost:3000/${user.image}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>

                  {editing && (
                    <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* User Stats */}
                <div className="flex gap-6 mt-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="font-bold text-lg">
                        {purchaseOrders.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Purchases</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600">
                      <Home className="w-4 h-4" />
                      <span className="font-bold text-lg">
                        {rentOrders.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Rentals</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 w-full">
                {editing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {user?.username}
                      </h1>
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md border border-gray-200 hover:border-blue-300 group"
                      >
                        <Edit3 className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                        <span className="font-medium">Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-lg">{user?.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <span>Member since {new Date().getFullYear()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Purchase Orders */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Purchase Orders
                  </h2>
                  <p className="text-gray-600">Your shopping history</p>
                </div>
              </div>

              <div className="space-y-4">
                {purchaseOrders.length ? (
                  <div className="space-y-4">
                    {purchaseOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-lg block">
                                Order #{order._id.slice(-8)}
                              </span>
                              {order.title && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {order.title}
                                </p>
                              )}
                              {order.total && (
                                <p className="text-sm font-medium text-green-600 mt-1">
                                  ${order.total}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mt-1">
                                {order.items?.length || 0} items
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No purchase orders yet
                    </h3>
                    <p className="text-gray-600">
                      Start shopping to see your orders here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rent Orders */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Rent Orders
                  </h2>
                  <p className="text-gray-600">Your rental history</p>
                </div>
              </div>

              <div className="space-y-4">
                {rentOrders.length ? (
                  <div className="space-y-4">
                    {rentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                              <Home className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-lg block">
                                Rent #{order._id.slice(-8)}
                              </span>
                              {order.title && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {order.title}
                                </p>
                              )}
                              {order.total && (
                                <p className="text-sm font-medium text-green-600 mt-1">
                                  Rs.{order.total}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mt-1">
                                Duration: {order.duration || "N/A"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No rent orders yet
                    </h3>
                    <p className="text-gray-600">
                      Start renting to see your orders here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
