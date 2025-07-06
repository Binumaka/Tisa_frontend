import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const WishListScreen = () => {
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId, token } = useAuth();
  const navigate = useNavigate();

  const gotoOrnamentDetails = (id) => {
    navigate(`/ornamentDetail/${id}`);
  };

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing. Unable to fetch wishlist.");
      setLoading(false);
      return;
    }

    const fetchWishList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found. Redirecting to login.");
          return;
        }

        const response = await axios.get(`/api/wishlist/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishList(response.data);
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Failed to fetch wishlist. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishList();
  }, [userId]);

  const handleDelete = async (WishlistId) => {
    try {
      await axios.delete(`/api/wishlist/${WishlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishList((prev) =>
        prev.filter((wishlist) => wishlist._id !== WishlistId)
      );
    } catch (error) {
      console.error("Error deleting wishlist item", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfafa]">
      <Navbar />
      <div className="container mx-auto mt-20 py-8">
        <div className="flex justify-between items-center mb-10">
          <div className="relative">
            <div
              className="text-white text-2xl font-dosis py-3 px-6 w-[200px]"
              style={{
                backgroundColor: "#9f7878",
                clipPath:
                  "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
              }}
            >
              Your Wishlist
            </div>
          </div>
          <div className="pr-10">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#9f7878] hover:bg-[#7a5e5e] font-dosis font-semibold text-white px-4 py-2 rounded-md shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {wishList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
            <p className="text-gray-500">
              Start adding ornaments you want to purchase!
            </p>
          </div>
        ) : (
          <div className="space-y-6 px-8 pr-6">
            {wishList.map((item) => {
              const ornament = item.ornamentId; // populated data

              return (
                <div
                  key={item._id}
                  className="bg-[#f4f4f4] p-4 rounded-md border border-gray-200 shadow-md flex items-center justify-between"
                  onClick={() => gotoOrnamentDetails(ornament._id)}
                >
                  <img
                    src={
                      ornament?.image
                        ? `http://localhost:3000/ornaments_image/${ornament.image}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={ornament?.title}
                    className="w-[250px] h-[200px] object-cover rounded-md"
                  />
                  <div className="flex-1 ml-6">
                    <h3 className="text-[24px] font-dosis font-semibold mb-1">
                      {ornament?.title}
                    </h3>
                    <p className="text-gray-600 font-dosis text-[16px] mt-2 pr-8">
                      {ornament?.description?.slice(0, 270)}...
                      <span className="text-black font-dosis font-medium cursor-pointer hover:underline hover:text-blue-600">
                        {" "}
                        Read more
                      </span>
                    </p>
                    <p className="text-red-600 font-dosis font-semibold mt-6">
                      Rs. {ornament?.price || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                    title="Remove"
                    className="text-red-500 hover:text-red-700 pr-[50px] text-xl"
                  >
                    <Trash />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListScreen;
