import { useNavigate } from "react-router-dom";

const PackageCard = ({ ornaments }) => {
  const navigate = useNavigate();

  const gotoPackagesDetails = (id) => {
    navigate(`/packageDetail/${id}`);
  };

  return (
    <div className="w-full py-4 bg-gradient-to-b from-white to-gray-50">
      <div className="pl-8 max-w-full mx-auto px-4">
        <div className="relative">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(ornaments) && ornaments.length > 0 ? (
              ornaments.map((ornament) => (
                <div
                  key={ornament._id}
                  className="group relative w-full max-w-[280px] h-[360px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer mx-auto"
                  onClick={() => gotoPackagesDetails(ornament._id)}
                >
                  {/* Image Container */}
                  <div className="w-full h-full relative">
                    {ornament.image ? (
                      <img
                        src={`http://localhost:3000/ornaments_image/${ornament.image}`}
                        alt={ornament.title || "Ornament"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center text-gray-600">
                        <div className="text-6xl mb-4">💍</div>
                        <p className="text-lg font-semibold">No Image</p>
                        <p className="text-sm">Available</p>
                      </div>
                    )}

                    {/* Overlay with text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white text-lg font-dosis font-semibold mb-1 truncate">
                        {ornament.title || "Untitled Ornament"}
                      </h3>
                      <p className="text-white font-dosis text-sm">
                        Rs.{" "}
                        {ornament.totalprice ||
                          ornament.price ||
                          "Price not available"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500 text-lg">No ornaments available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
