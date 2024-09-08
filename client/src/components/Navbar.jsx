import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useUser } from "../store/UserStore";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useLocation, Link } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const { logout, isLoading, user } = useUser((state)=>({
    logout:state.logout,
    
  }));
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
    } catch (error) {
      toast.warn(error.response?.data?.message || error.message);
    }
  };

  return (
    <nav className="flex items-center justify-between h-[60px] px-[3%] text-white border-b border-[#ffffff41]">
      {/* Left Side: Logo and Title */}
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-bold">
          <Link to="/">MyWatchlist</Link>
        </h2>
      </div>

      {/* Middle section (Search Bar only on /collection) */}
      {location.pathname === "/collection" && (
        <div>
          <input
            type="text"
            className="text-[14px] font-[500] w-[500px] px-[20px] py-[7px] outline-none rounded-[7px] bg-[#111827]"
            placeholder="Search collection or video"
          />
        </div>
      )}

      {/* Right Side: Navigation Links */}
      <div className="flex items-center space-x-6 font-[500]">
        <Link to="/home" className="hover:text-gray-400">
          Home
        </Link>
        <Link to="/collection" className="hover:text-gray-400">
          Collection
        </Link>
        <Link to="/queue" className="hover:text-gray-400">
          Queue
        </Link>
        <div className="flex gap-[7px] items-center">
          <span className="font-semibold">- {user.name}</span>
          <FaRegUser />
        </div>
        <button
          disabled={isLoading}
          onClick={handleLogout}
          className="bg-[#7e22ce] w-[100px] hover:bg-[#6018a0] transition-all ease-linear duration-200 py-[5px] rounded-[5px]"
        >
          {isLoading ? <BeatLoader color="#ffffff" size={5} /> : "Logout"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
