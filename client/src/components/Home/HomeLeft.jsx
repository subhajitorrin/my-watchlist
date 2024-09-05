import React from "react";
import VideoCard from "./VideoCard";

function HomeLeft() {
  return (
    <div className="h-full w-[50%] gap-[10px] flex flex-col">
      <h2 className="text-[20px] font-[500]">My Library</h2>
      <div className="">
        <VideoCard />
      </div>
    </div>
  );
}

export default HomeLeft;
