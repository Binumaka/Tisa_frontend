import axios from "axios";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrnamentCard = ({ ornaments, wishList = [], setWishList }) => {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 4;
  const endIndex = startIndex + itemsPerPage;

  const handlePrev = () => {
    setStartIndex(Math.max(startIndex - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex(
      Math.min(startIndex + itemsPerPage, ornaments.length - itemsPerPage)
    );
  };

  const gotoOrnamentDetails = (id) => {
    navigate(`/ornamentDetail/${id}`);
  };

  const toggleWishList = async (ornament) => {
    try {
      const isAlreadyInWishList = wishList.some(
        (item) => item._id === ornament._id
      );

      if (isAlreadyInWishList) {
        // Remove from wishlist
        const updatedWishList = wishList.filter(
          (item) => item._id !== ornament._id
        );
        setWishList(updatedWishList);
      } else {
        // Add to wishlist
        const updatedWishList = [...wishList, ornament];
        setWishList(updatedWishList);
        await axios.post("http://localhost:3000/api/wishlist/", ornament);
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-white/5">
      <div className="flex items-center justify-center mb-12 w-full rounded-[20px]">
        {/* Pagination buttons */}
        <div className="flex items-center space-x-4">
          {startIndex > 0 && (
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-black/3"
            >
              <img
                src="/src/images/left-chevron.png"
                alt="Previous"
                className="w-6 h-6"
              />
            </button>
          )}
          <div className="flex flex-wrap justify-between gap-8">
            {Array.isArray(ornaments) && ornaments.length > 0 ? (
              ornaments.slice(startIndex, endIndex).map((ornament) => (
                <div
                  key={ornament._id}
                  className="relative w-[320px] h-[300px] rounded-[12px] overflow-hidden
                  shadow-md hover:transform hover:scale-105 hover:shadow-lg
                  transition-transform duration-300 cursor-pointer"
                >
                  <img
                    src={
                      ornament.image
                        ? `http://localhost:3000/ornaments_image/${ornament.image}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={ornament.title}
                    className="w-full h-full object-cover"
                    onClick={() => gotoOrnamentDetails(ornament._id)}
                  />
                  {/* Favorite button */}
                  <FaHeart
                    className={`absolute top-4 right-4 cursor-pointer text-2xl ${
                      wishList.some((item) => item._id === ornament._id)
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-600"
                    }`}
                    onClick={() => toggleWishList(ornament)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-black/40">
                    <h2 className="m-0 text-white text-lg">{ornament.title}</h2>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No ornament available.</p>
            )}
          </div>
          {endIndex < ornaments.length && (
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-black/3"
            >
              <img
                src="/src/images/chevron.png"
                alt="Next"
                className="w-6 h-6"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrnamentCard;
