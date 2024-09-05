import React, { useState } from "react";
import VideoCard from "./VideoCard";

function HomeLeft() {
  const [myList, setMyList] = useState(Array.from({ length: 10 }).fill(""));
  return (
    <div className="h-full w-[50%] gap-[10px] flex flex-col">
      <h2 className="text-[20px] font-[500]">My Library</h2>
      <div className="flex flex-col gap-[10px] h-[100%] overflow-y-auto scrollNone">
        {myList.length === 0 ? (
          <div className="flex justify-center items-center rounded-[7px] h-[150px] w-full bg-[#111827]">
            <p className="text-[#ffffff8a]">No video in library</p>
          </div>
        ) : (
          myList.map((item, index) => {
            return <VideoCard key={index} />;
          })
        )}
      </div>
    </div>
  );
}

export default HomeLeft;
