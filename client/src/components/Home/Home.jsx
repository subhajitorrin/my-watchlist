import React from "react";
import HomeLeft from "./HomeLeft";
import HomeRight from "./HomeRight";

function Home() {
  return (
    <div className="h-[calc(100%-60px)] flex gap-[20px] px-[3%] py-[15px]">
      <HomeLeft />
      <HomeRight />
    </div>
  );
}

export default Home;
