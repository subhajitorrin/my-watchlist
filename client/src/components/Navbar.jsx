import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useUser } from "../store/UserStore";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useLocation, Link } from "react-router-dom";
import { useVideo } from "../store/VideoStore";
import Search from "./Search/Search";
import useDebounce from "../hook/useDebounce";
import { RxCross2 } from "react-icons/rx";
import { IoMdSearch } from "react-icons/io";
import { useWidth } from "../store/useWIdth";
import { RiMenu3Fill } from "react-icons/ri";

const navList = [
  { name: "Home", path: "/" },
  { name: "Collection", path: "/collection" },
  { name: "Queue", path: "/queue" }
];

function Navbar() {
  const [search, setSearch] = useState("");
  const [toggleSideNavMobile, setToggleSideNavMobile] = useState(false);
  const location = useLocation();
  const { logout, isLoading, user } = useUser((state) => ({
    logout: state.logout,
    isLoading: state.isLoading,
    user: state.user
  }));
  const { searchVideo, setIsActiveSearch, isActiveSearch } = useVideo(
    (state) => ({
      searchVideo: state.searchVideo,
      setIsActiveSearch: state.setIsActiveSearch,
      isActiveSearch: state.isActiveSearch
    })
  );
  const { innerWidth } = useWidth((state) => ({
    innerWidth: state.innerWidth
  }));
  const debouncedSearch = useDebounce(search);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
    } catch (error) {
      toast.warn(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    async function handleSearch() {
      await searchVideo(debouncedSearch);
    }
    handleSearch();
  }, [debouncedSearch]);

  if (innerWidth < 768) {
    return (
      <nav className="relative flex items-center justify-between h-[60px] px-[3%] text-white border-b border-[#ffffff41]">
        <h2 className="text-xl font-bold">
          <Link to="/">MyWatchlist</Link>
        </h2>
        <div className="relative flex gap-[10px] items-center">
          <RiMenu3Fill
            className="text-[22px] cursor-pointer"
            onClick={() => {
              setToggleSideNavMobile(true);
            }}
          />
        </div>
        {toggleSideNavMobile && (
          <div className=" pt-[15%] absolute h-screen w-[60%] bg-[#111827] right-0 top-0 z-[10]">
            <RxCross2
              className="text-[22px] cursor-pointer absolute right-[13px] top-[18px] "
              onClick={() => {
                setToggleSideNavMobile(false);
              }}
            />
            <div className="flex gap-[7px] items-center flex-col">
              <div className="flex justify-center w-full">
                <FaRegUser className="text-[25px]" />
              </div>
              <span className="font-semibold text-center text-[20px]">
                {user.name}
              </span>
            </div>
            <div className="flex flex-col gap-[20px] mt-[30%]">
              {navList.map((item, index) => {
                return (
                  <Link
                    className="text-[18px] font-[500] text-center"
                    key={index}
                    to={item.path}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="px-[20px] absolute bottom-[20px] w-full">
              <button
                disabled={isLoading}
                onClick={handleLogout}
                className="bg-[#7e22ce] w-full hover:bg-[#6018a0] transition-all ease-linear duration-200 py-[5px] rounded-[5px]"
              >
                {isLoading ? <BeatLoader color="#ffffff" size={5} /> : "Logout"}
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }

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
        <div className="relative">
          <input
            onChange={(e) => {
              const inputValue = e.target.value.trim();
              setIsActiveSearch(inputValue !== "");
              setSearch(inputValue);
            }}
            value={search}
            type="text"
            className="text-[14px] font-[500] w-[500px] px-[20px] py-[7px] outline-none rounded-[7px] bg-[#111827]"
            placeholder="Search collection or video"
          />
          <IoMdSearch className="absolute top-[20%] right-[10px] text-[20px] text-[#ffffff8f]" />
          {isActiveSearch && (
            <RxCross2
              onClick={() => {
                setSearch("");
                setIsActiveSearch(false);
              }}
              className="cursor-pointer absolute top-[20%] right-[35px] text-[20px] text-[#ffffff8f]"
            />
          )}
          {isActiveSearch && <Search />}
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
