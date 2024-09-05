import React from "react";
import VideoCard from "./VideoCard";
import { useVideo } from "../../store/VideoStore";

function HomeLeft() {
  const {  library } = useVideo();
  return (
    <div className="h-full w-[50%] gap-[10px] flex flex-col">
      <h2 className="text-[20px] font-[500]">My Library</h2>
      <div className="flex flex-col gap-[10px] h-[100%] overflow-y-auto scrollNone">
        {library.length === 0 ? (
          <div className="flex justify-center items-center rounded-[7px] h-[150px] w-full bg-[#111827]">
            <p className="text-[#ffffff8a]">No video in library</p>
          </div>
        ) : (
          library.map((item, index) => {
            return <VideoCard key={index} item={item}/>;
          })
        )}
      </div>
    </div>
  );
}

export default HomeLeft;
