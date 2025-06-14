import React, { useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const PackageCard = ({ornaments }) => {
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

  const gotoPackagesDetails = (id) => {
    navigate(`/packageDetail/${id}`);
  };

  return (
    <div className="w-full py-4 bg-gradient-to-b from-white to-gray-50">
      <div className="pl-8 max-w-full mx-auto px-4">
        
        <div className="relative">
          {/* Previous Button */}
          {startIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(ornaments) && ornaments.length > 0 ? (
              ornaments.slice(startIndex, endIndex).map((ornament) => (
                <div
                  key={ornament._id}
                  className="group relative w-full max-w-[320px] h-[300px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer mx-auto"
                  onClick={() => gotoPackagesDetails(ornament._id)}
                >
                  {/* Image Container */}
                  <div className="w-full h-full relative">
                    {ornament.image ? (
                      <img
                        src={"http://localhost:3000/ornaments_image/" +
                        ornament.image || "https://via.placeholder.com/150"}
                        alt={ornament.title || "Ornament"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          // Hide the image and show placeholder div instead
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Placeholder div for when image is missing or fails to load */}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center text-gray-600 ${ornament.image ? 'hidden' : 'flex'}`}
                      style={{ display: ornament.image ? 'none' : 'flex' }}
                    >
                      <div className="text-6xl mb-4">💍</div>
                      <p className="text-lg font-semibold">No Image</p>
                      <p className="text-sm">Available</p>
                    </div>
                    
                    {/* Overlay with text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white text-lg font-semibold mb-1 truncate">
                        {ornament.title || "Untitled Ornament"}
                      </h3>
                      <p className="text-white text-sm font-bold">
                        Rs. {ornament.totalprice || ornament.price || "Price not available"}
                      </p>
                    </div>
                  </div>

                  {/* Duration badge (if ornament has duration property) */}
                  {ornament.duration && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-white rounded-full px-3 py-1 shadow-md flex items-center">
                        <Clock className="w-4 h-4 text-red-600 mr-1" />
                        <span className="text-sm font-medium">{ornament.duration}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500 text-lg">No ornaments available.</p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {ornaments && endIndex < ornaments.length && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;