import axios from "axios";
import { useEffect, useState } from "react";
import OrnamentCard from "./OrnamentCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

const FeaturedOrnament = () => {
  const [ornaments, setOrnaments] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
    <div className="flex items-center space-x-4 justify-center">
      {startIndex > 0 && (
        <button onClick={handlePrev} className="pagination-button">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}
      <OrnamentCard ornaments={ornaments.slice(startIndex, endIndex)} />
      {endIndex < ornaments.length && (
        <button onClick={handleNext} className="pagination-button">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default FeaturedOrnament;
