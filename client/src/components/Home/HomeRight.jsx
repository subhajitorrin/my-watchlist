import React from "react";
import AddVideo from "./AddVideo";
import NowPlaying from "./NowPlaying";

function HomeRight() {
  return (
    <div className="h-full w-[30%] flex flex-col gap-[20px]">
      <AddVideo />
      <NowPlaying/>
    </div>
  );
}

export default HomeRight;
