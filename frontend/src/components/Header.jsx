import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Side - Logo / Title */}
        <h1 className="text-white text-2xl font-bold tracking-wide">
          Nagori Bajar
        </h1>

        {/* Right Side - Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl shadow-md hover:bg-indigo-100 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;