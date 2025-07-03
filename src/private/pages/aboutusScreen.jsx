import { useEffect, useState } from "react";
import { MdCall, MdEmail } from "react-icons/md";
import NavBar from "../components/Navbar";
import Footer from "../components/footer";

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/src/assets/images/tayo.png",
    "/src/assets/images/marwari.png",
    "/src/assets/images/makasi4.png",
    "/src/assets/images/tayo1.png",
    "/src/assets/images/makasi3.png",
    "/src/assets/images/chandrama.png",
    "/src/assets/images/ihi.png",
  ];

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Header */}
      <div className="container mx-auto mt-20 py-8">
        <div
          className="text-white text-2xl font-junge py-3 px-4 w-[200px]"
          style={{
            backgroundColor: "#9f7878",
            clipPath:
              "polygon(0 0, calc(100% - 30px) 0, 100% 50%, calc(100% - 30px) 100%, 0 100%)",
          }}
        >
          About Us
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 w-ful p-12">
          {/* Left side - Slideshow */}
          <div className="flex relative pr-20">
            <img
              src={images[currentImageIndex]}
              alt="Slideshow"
              className="rounded-lg w-[500px] h-[500px] object-cover transition duration-500"
            />
          </div>

          {/* Right side - Text box with image */}
          <div className="flex-1 flex flex-col justify-between">
            <div
              className="relative flex item-center justify-between w-full  p-6 rounded-lg shadow-md"
              style={{
                background: "linear-gradient(135deg, #9f7878, #a88383)",
              }}
            >
              {/* Text */}
              <p className="text-white text-[28px] leading-relaxed font-dosis">
                Choose Tisa for renting and selling traditional Newa ornaments
                used in various cultural and ceremonial occasions. It aims to
                preserve heritage while offering users easy online access to
                authentic jewelry.
              </p>

              {/* Character Image */}
              <img
                src="/src/assets/images/Tisa.png"
                alt="Smiling Character"
                className="w-28 h-28 object-contain mr-2"
              />
            </div> {/* Contact */}
        <div className="mb-40 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <MdEmail className="text-red-500" />
            <span>Email: tisa@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MdCall className="text-green-500" />
            <span>Call: 9876543210</span>
          </div>
        </div>
          </div>
        </div>

       
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
