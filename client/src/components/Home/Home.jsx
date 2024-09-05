import React from "react";
import HomeLeft from "./HomeLeft";
import HomeRight from "./HomeRight";
import Navbar from "../Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <div className="h-[calc(100%-60px)] justify-center flex gap-[20px] px-[3%] py-[20px]">
        <HomeLeft />
        <HomeRight />
      </div>
    </>
  );
}

export default Home;
