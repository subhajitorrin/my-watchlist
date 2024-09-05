import React from "react";
import { FaRegUser } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="flex items-center justify-between h-[60px] px-[3%] text-white border-b border-[#ffffff41]">
      {/* Left Side: Logo and Title */}
      <div className="flex items-center space-x-2">
        {/* <img src="your-logo.png" alt="Logo" className="w-10 h-10" /> */}
        <h2 className="text-xl font-bold">MyWatchlist</h2>
      </div>

      {/* Right Side: Navigation Links */}
      <div className="flex items-center space-x-6 font-[500]">
        <a href="#home" className="hover:text-gray-400">
          Home
        </a>
        <a href="#current-video" className="hover:text-gray-400">
          Player
        </a>
        <a href="#queue" className="hover:text-gray-400">
          Queue
        </a>
        <div className="flex gap-[7px] items-center">
          <span className="font-semibold">Subhajit Ghosh</span>
          <FaRegUser />
        </div>
        <button className="bg-[#7e22ce] hover:bg-[#6018a0] transition-all ease-linear duration-200 py-[5px] px-[10px] rounded-[5px]">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
