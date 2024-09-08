import React from "react";
import { useVideo } from "../../store/VideoStore";
import { SyncLoader } from "react-spinners";
import { CgSearch } from "react-icons/cg";

function Search() {
  const { searchLoading, searchedList } = useVideo((state) => ({
    searchLoading: state.searchLoading,
    searchedList: state.searchedList
  }));
  return (
    <div className="absolute  w-full bg-[rgb(10,10,10)] z-[12] rounded-[7px]">
      {!searchLoading ? (
        <div className=" h-[200px] flex flex-col gap-[20px] items-center justify-center">
          <SyncLoader color="#ffffff" size={5} />
          <p className="text-[13px] font-[500] flex items-center gap-[3px]">
            Searching <CgSearch className="text-[15px] relative top-[2px]" />
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Search;
