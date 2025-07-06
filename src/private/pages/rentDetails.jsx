import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/footer";

const RentDetailsPage = () => {
  const { id } = useParams();
  const [rent, setRent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/rent/${id}`);
        const ornamentsRes = await axios.get(
          "http://localhost:3000/api/rentornament"
        ); // Fetch all ornaments
        const includedOrnaments = ornamentsRes.data.filter((o) =>
          rent?.RentOrnamentId?.includes(o._id)
        );
        setRent({ ...res.data, includedOrnaments });
      } catch (err) {
        console.error("Error loading rent package", err);
      }
    };
    fetchRent();
  }, [id]);

  if (!rent) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 mt-28 mb-12 grid md:grid-cols-2 gap-8">
        {/* Left - Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src={
                rent.image
                  ? `http://localhost:3000/uploads/${rent.image}`
                  : "https://via.placeholder.com/400"
              }
              alt={rent.title}
              className="w-[430px] h-[480px] rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Right - Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-dosis font-bold mb-4">{rent.title}</h1>

          {/* Included Items */}
          <div className="space-y-4 mb-6">
            {rent.RentOrnamentId?.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border p-2 rounded"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      item.image
                        ? `http://localhost:3000/uploads/${item.image}`
                        : "https://via.placeholder.com/280x360?text=No+Image"
                    }
                    className="w-16 h-14 object-cover rounded"
                    alt={item.title}
                  />
                  <span className="font-medium font-dosis text-lg">
                    {item.title}
                  </span>
                </div>
                <span className="flex items-center text-red-500 font-dosis font-semibold">
                  Rs. {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Price + Button */}
          <div className="border-t pt-4">
            <p className="text-lg font-semibold font-dosis text-red-600 mb-4">
              Bundle Price : Rs. {rent.totalprice}
            </p>
            <div className=" flex justify-center mt-16">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-lg font-dosis text-black py-3 px-6 rounded-[6px] w-[300px] font-semibold"
                onClick={() =>
                  navigate("/rentorder", { state: { rentData: rent } })
                }
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-10">
        <div className="max-w-full mx-auto bg-white rounded-lg shadow p-6 mb-16">
          <h2 className="text-2xl font-dosis font-semibold mb-4">
            Description
          </h2>
          <p className="text-gray-700 text-lg font-dosis leading-relaxed">
            {rent.description}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RentDetailsPage;
