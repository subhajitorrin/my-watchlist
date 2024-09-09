import React from "react";
import AddVideo from "./AddVideo";
import NowPlaying from "./NowPlaying";
import { useWidth } from "../../store/useWIdth";

function HomeRight() {
  const { isMobile } = useWidth((state) => ({
    isMobile: state.isMobile
  }));
  if (isMobile) {
    return (
      <div className="h-full w-[30%] flex flex-col gap-[20px]">
        <AddVideo />
      </div>
    );
  }
  return (
    <div className="h-full w-[30%] flex flex-col gap-[20px]">
      <AddVideo />
      <NowPlaying />
    </div>
  );
}

export default HomeRight;
