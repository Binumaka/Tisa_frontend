import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import OrnamentCard from "../components/OrnamentCard";
import Footer from "../components/footer";

const OrnamentDisplay = () => {
  const [ornaments, setOrnaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrnaments = async () => {
      try {
        const response = await axios.get(`/api/ornament/`);
        setOrnaments(response.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrnaments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto mt-20 py-8">
        <div
          className="text-white text-2xl font-dosis py-3 px-4 w-[200px]"
          style={{
            backgroundColor: "#9f7878",
            clipPath:
              "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
          }}
        >
          All Ornaments
        </div>
        <div className="mt-8 pl-10">
          <OrnamentCard ornaments={ornaments} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrnamentDisplay;
