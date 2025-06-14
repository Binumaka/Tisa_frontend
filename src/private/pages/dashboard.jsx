import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import TopDestination from "../components/newArrival";
import FeaturedOrnament from "../components/FeaturedOrnament";
import Packages from "../components/package";
import Footer from "../components/footer";

function Home() {
  const heroImage = "/src/images/image.png";
  const navigate = useNavigate();

  return (
    <div className="p-2">
      <Navbar />
      
      {/* Hero Section - Enhanced with gradient overlay and better spacing */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-inriaSans font-bold leading-tight text-white mb-6">
              Travelers' Choice, Best of the Best
            </h1>
            <p className="text-xl font-inriaSans text-gray-200 mb-8 max-w-xl">
              Discover our curated selection of the top 1% destinations, stays, and experiences—all decided by travelers like you.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-black hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                onClick={() => navigate("/destinations")}
              >
                Explore Destinations
              </button>
              <button
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all"
                onClick={() => navigate("/tourpackagelist")}
              >
                View Packages
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Destination Section - Now in a dedicated container */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">New Arrival</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Unique experiences and hidden gems waiting to be discovered</p>
          </div>
          <TopDestination />
        </div>
      </section>
      
      {/* More To Explore Section with background */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">More To Explore</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Unique experiences and hidden gems waiting to be discovered</p>
          </div>
          <FeaturedOrnament />
        </div>
      </section>
      
      {/* Tour Packages Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">LIMITED TIME OFFERS</span>
            <h2 className="text-3xl font-serif font-bold mt-4 mb-4">Tour Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">All-inclusive packages with incredible savings and unforgettable experiences</p>
          </div>
          <Packages />
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-blue-400 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-inriaSans font-medium mb-4">Get Travel Inspiration</h2>
            <p className="mb-8">Sign up for our newsletter and receive exclusive offers on new destinations</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow p-3 rounded-lg focus:outline-none text-gray-800"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default Home;