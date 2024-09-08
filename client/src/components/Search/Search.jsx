import React from "react";
import { useVideo } from "../../store/VideoStore";
import {SyncLoader} from "react-spinners"

function Search() {
  const { searchLoading, searchedList } = useVideo((state) => ({
    searchLoading: state.searchLoading,
    searchedList: state.searchedList
  }));
  return (
    <div className="absolute h-full w-full bg-[rgb(10,10,10)] z-[12] rounded-[7px]">
      {searchLoading ? (
        <div className="">
          <SyncLoader color="#ffffff" size={5} />
          <p>Searching ...</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Search;
