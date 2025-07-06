import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ornaments = [
  {
    title: "Tayo",
    description:
      "Large, crescent- or heart-shaped central gold pendant with intricate filigree work, attached to a thick red thread or gold chain.",
    mainImage: "src/assets/images/tayo1.png",
    smallImage: "src/assets/images/tayo.png",
  },
  {
    title: "Kalachha",
    description:
      "Made of gold or sometimes gilded copper. Shaped like a flower or sunburst, typically with a central stud and ornate detailing.",
    mainImage: "src/assets/images/kalachha.png",
    smallImage: "src/assets/images/kalachha1.png",
  },
  {
    title: "Chandrama",
    description:
      "Traditionally made of gold and inlaid pearls, or precious stones. Reserved for women in the center parting of the hair during special festivals.",
    mainImage: "src/assets/images/chandrama.png",
    smallImage: "src/assets/images/chandrama1.png",
  },
  {
    title: "Makasi",
    description:
      "Large, round drop-shaped earrings made of gold, worn through stretched earlobes.",
    mainImage: "src/assets/images/makasi3.png",
    smallImage: "src/assets/images/makasi4.png",
  },
  {
    title: "Nyapu Sikha",
    description:
      "Bold or gold-plated decorative piece worn in the center parting of the hair, often lotus-shaped.",
    mainImage: "src/assets/images/Nyapushikha2.png",
    smallImage: "src/assets/images/NyapuShikhasilver.jpg",
  },
];

// Array of bag images that will rotate
const bagImages = [
  "src/assets/images/bag/bag1.png",
  "src/assets/images/bag/bag3.png",
  "src/assets/images/bag/bag4.png",
  "src/assets/images/bag/bag5.png",
  "src/assets/images/bag/bag6.png",
];

const OrnamentShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBagIndex, setCurrentBagIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ornaments.length);
    }, 4000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bagInterval = setInterval(() => {
      setCurrentBagIndex((prevIndex) => (prevIndex + 1) % bagImages.length);
    }, 2500); // Change bag every 2.5 seconds (slightly different timing)

    return () => clearInterval(bagInterval);
  }, []);

  const item = ornaments[currentIndex];
  const currentBag = bagImages[currentBagIndex];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Section: Text */}
      <div className="w-[50%] flex flex-col justify-center px-16 transform -translate-y-40">
        <div className="px-12 mb-20 ">
          <h1 className="text-[44px] font-dosis font-semibold text-black mb-4 leading-tight">
            {item.title}
          </h1>
          <p className="text-gray-700 text-[20px] font-dosis font-medium mb-8 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Fixed-position button inside the left section */}
        <div className="absolute bottom-60 left-16">
          <button className="bg-[#4a2c2a] text-[18px] text-white px-8 py-3 rounded-lg hover:bg-[#FAC71E] hover:text-black font-dosis font-semibold transition duration-300"
          onClick={() => navigate("/ornamentDisplay")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Middle Section: Images */}
      <div className="w-[30%] relative flex items-center justify-center bg-white transform -translate-y-40">
        {/* Wrapper to allow overlay to show */}
        <div className="relative">
          {/* Main image container */}
          <div className="w-[260px] h-[360px] bg-[#f8f4f0] rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
            <img
              src={item.mainImage}
              alt="Main Ornament"
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          </div>

          {/* Overlay image — now visible because parent isn't clipped */}
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-[10px] overflow-hidden shadow-md">
            <img
              src={item.smallImage}
              alt="Overlay"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Section: Rotating Bag images */}
      <div className="w-[25%] bg-[#a08080] flex items-center justify-center transform -translate-y-10">
        <img
          src={currentBag}
          alt="Bag"
          className="h-64 w-auto object-contain transition-opacity duration-300"
          key={currentBagIndex} // Force re-render for smooth transition
        />
      </div>
    </div>
  );
};

export default OrnamentShowcase;
