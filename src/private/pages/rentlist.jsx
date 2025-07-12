import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import RentCard from "../components/card";
import Footer from "../components/footer";

const RentDisplay = () => {
  const [ornaments, setOrnaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRent = async () => {
      try {
        const response = await axios.get(`/api/rent/`);
        setOrnaments(response.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="mx-auto mt-20 py-8">
        <div
        className="text-white text-2xl font-junge py-3 px-4 w-[250px]"
        style={{
          backgroundColor: "#9f7878",
          clipPath:
            "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
        }}
      >
        Rent Ornaments
      </div>
        <RentCard ornaments={ornaments} />
      </div>
      <Footer/>
    </div>
  );
};

export default RentDisplay;
