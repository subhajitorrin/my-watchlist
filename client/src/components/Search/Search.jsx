import React from "react";
import { useVideo } from "../../store/VideoStore";
import { SyncLoader } from "react-spinners";
import { CgSearch } from "react-icons/cg";
import SearchCard from "./SearchCard";
import { IoMdSearch } from "react-icons/io";

function Search() {
  const { searchedList } = useVideo((state) => ({
    searchedList: state.searchedList
  }));
  return (
    <div className="p-[10px] absolute  w-full bg-[rgb(10,10,10)] z-[12] rounded-[7px]">
      {searchedList.length === 0 ? (
        <div className=" h-[200px] flex flex-col gap-[20px] items-center justify-center">
          <SyncLoader color="#ffffff" size={5} />
          <p className="text-[13px] font-[500] flex items-center gap-[3px]">
            Searching <CgSearch className="text-[15px] relative top-[2px]" />
          </p>
        </div>
      ) : (
        <div className="max-h-[80vh] flex flex-col gap-[10px] overflow-y-auto scrollNone">
          {searchedList.map((item, index) => {
            return <SearchCard key={index} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Search;
