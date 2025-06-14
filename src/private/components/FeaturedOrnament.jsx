import axios from "axios";
import { useEffect, useState } from "react";
import OrnamentCard from "./OrnamentCard";

const FeaturedOrnament = () => {
  const [ornaments, setOrnaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrnaments = async () => {
      try {
        const response = await axios.get(
          `/api/ornament/section/FeaturedOrnament`
        );
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
      <OrnamentCard section="FeaturedOrnament" ornaments={ornaments} />
    </div>
  );
};

export default FeaturedOrnament;
