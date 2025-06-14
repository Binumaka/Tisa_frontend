import axios from "axios";
import { useEffect, useState } from "react";
import PackageCards from "./PackageCard";

const Packages = () => {
  const [ornaments, setOrnaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrnaments = async () => {
      try {
        const response = await axios.get(`/api/package/find`);
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
      <PackageCards section="Packages" ornaments={ornaments} />
    </div>
  );
};

export default Packages;
