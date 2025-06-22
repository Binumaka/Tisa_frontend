import { Heart, Search, User, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("Navbar Rendered - isLoggedIn:", isLoggedIn, "UserId:", userId);
  }, [isLoggedIn, userId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log("Searching for:", searchQuery);
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="flex items-center">
              <img 
                src="src/images/logo.png" 
                alt="Logo" 
                className="h-14 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Fallback text logo */}
              <span className="text-2xl font-serif text-gray-900 hidden">
                Your Logo
              </span>
            </Link>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-[450px]">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 py-2 border font-medium font-dosis border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
                />
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-20">
            <Link
              to="/rent"
              className="text-gray-700 text-[20px] font-dosis hover:text-gray-900 font-medium transition-colors"
            >
              Rent
            </Link>
            <Link
              to="/packages"
              className="text-gray-700 text-[20px] font-dosis hover:text-gray-900 font-medium transition-colors"
            >
              Packages
            </Link>
            <Link
              to="/about"
              className="text-gray-700 text-[20px] font-dosis hover:text-gray-900 font-medium transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-14 ml-8">
            {/* Shopping Cart */}
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-8 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Heart/Wishlist */}
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-8 w-6" />
            </button>

            {/* User Profile */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none"
                >
                  <User className="h-10 w-7" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 border">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        navigate("/");
                        setDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-4">
            <button
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                // Add mobile menu toggle logic here
                console.log("Mobile menu clicked");
              }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;