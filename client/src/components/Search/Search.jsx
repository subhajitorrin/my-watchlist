import React from "react";
import { useVideo } from "../../store/VideoStore";

function Search() {
  const { searchLoading, searchedList } = useVideo((state) => ({
    searchLoading: state.searchLoading,
    searchedList: state.searchedList
  }));
  return (
    <div className="absolute h-full w-full bg-[rgb(10,10,10)] z-[12] rounded-[7px]"></div>
  );
}

export default Search;
