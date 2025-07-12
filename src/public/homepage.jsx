import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // State for carousel index
  const navigate = useNavigate();
  const currentimage = ["/src/assets/images/firstSlider.png"];

  // Destinations data
  const ornaments = [
    {
      id: 1,
      title: "What is wore in Ihi ceremony",
      image: "/src/assets/images/ihi.png",
    },
    {
      id: 2,
      title: "Discover the best ornament",
      image: "/src/assets/images/gufa.png",
    },
    {
      id: 3,
      title: "What is wore in Gufa ceremony",
      image: "/src/assets/images/mariage.png",
    },
    {
      id: 4,
      title: "Discover the jewellery wore in janku",
      image: "/src/assets/images/janku.png",
    },
  ];

  // Featured properties data
  const Topdestination = [
    {
      id: 1,
      image: "/src/assets/images/marwari.png",
    },
    {
      id: 2,
      image: "/src/assets/images/makasi.png",
    },
    {
      id: 3,
      image: "/src/assets/images/tayo.png",
    },
    {
      id: 4,
      image: "/src/assets/images/Nyapushikha2.png",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <header
        className={`fixed w-full z-20 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-black bg-opacity-10"
        }`}
      >
        <div className="flex items-center justify-between px-10 py-4">
          <img
            src="/src/assets/images/logo.png"
            alt="Logo"
            className="h-[60px] w-[114px]"
          />
          <button
            onClick={() => navigate("/login")}
            className="bg-[#4B2E2E] w-[130px] text-[20px] text-white font-dosis font-semibold px-6 py-2 rounded-[6px] shadow hover:bg-[#FAC71E] hover:text-black font-dosis font-semibold transition duration-300"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[840px] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${currentimage[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 bg-transparent flex flex-col justify-center items-start px-16">
          <h1 className="text-[48px] font-semibold font-dosis text-gray-300 w-2/6 mb-20">
            "Wearing heritage with pride, every jewel tells a story."
          </h1>
          <button className="bg-[#4B2E2E] w-[200px] text-[20px] text-white font-dosis font-semibold px-6 py-2 rounded-[6px] shadow hover:bg-[#FAC71E] hover:text-black font-dosis font-semibold transition duration-300">
            Shop Now
          </button>
        </div>
      </div>

      {/* Jewelry Highlights */}
      <div className="pt-12 bg-[#F5F5F5] border-b ">
        <div className="max-w-full mx-auto px-12 py-6">
          <div className="relative">
            <div className="flex overflow-x-auto gap-14 pb-3 scrollbar-hide">
              {ornaments.map((ornament) => (
                <div key={ornament.id} className="flex flex-col w-full">
                  <div className="relative h-[300px] rounded-lg overflow-hidden">
                    <img
                      src={ornament.image}
                      alt={ornament.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-[16px] font-dosis font-medium text-center">
                    {ornament.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Best sellers */}
      <div className="py-16 bg-white">
        <div className="max-w-full mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Text Section */}
          <div className=" relative flex-col space-y-4">
            <h2 className="text-4xl px-10 font-bold font-dosis">
              Best Sellers !!
            </h2>
            <p className="text-gray-500 max-w-sm font-semibold font-dosis">
              It's a celebration of identity, craftsmanship, and generations of
              cultural pride.
            </p>
            <button className="bg-[#4B2E2E] w-[200px] text-[20px] text-white font-dosis font-semibold px-6 py-2 rounded-[6px] shadow hover:bg-[#FAC71E] hover:text-black font-dosis font-semibold transition duration-300">
              Buy Now
            </button>
          </div>

          {/* Right Image Section */}
          <div className="flex-1 grid grid-cols-3 gap-28">
            {[
              { src: "/src/assets/images/tayo2.png" },
              { src: "/src/assets/images/makasi1.png" },
              { src: "/src/assets/images/nyapushikha1.png" },
            ].map((item, index) => (
              <div
                key={index}
                className="relative h-60 rounded-lg overflow-hidden"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peace of Mind Section */}
      <div className="p-12 bg-[#F5F5F5] border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Peace of mind guaranteed with every purchase
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
            {Topdestination.map((destination) => (
              <div key={destination.id} className="group cursor-pointer">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="mt-2 font-medium">{destination.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              {
                title: "Expert Artisans",
                description:
                  "Our jewelry is lovingly crafted by skilled artisans who have inherited traditional techniques passed down through generations.",
              },
              {
                title: "Seamless Purchase",
                description:
                  "Whether it’s for Ihi, Gufa, weddings, festivals, or daily wear, our collection blends ceremonial importance with modern comfort and elegance.",
              },
              {
                title: "Purchase Packages",
                description:
                  "Choose from our culturally rich sets ideal for birthdays, weddings, and coming-of-age ceremonies like Bel Bibaha or Barha Tayegu.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#B67D7D] to-[#9C5F5F] text-white text-center p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              >
                <h1 className="text-[20px] text-black font-medium font-dosis">{feature.title}</h1>
                <p className="text-[16px] font-dosis">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
