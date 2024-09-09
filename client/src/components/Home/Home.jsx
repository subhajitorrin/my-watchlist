import React, { useEffect } from "react";
import HomeLeft from "./HomeLeft";
import HomeRight from "./HomeRight";
import Navbar from "../Navbar";
import { useWidth } from "../../store/useWIdth";

function Home() {
  const { isMobile } = useWidth((state) => ({
    isMobile: state.isMobile
  }));
  return (
    <>
      <Navbar />
      <div
        style={{ flexDirection: isMobile ? "column-reverse" : "row" }}
        className="h-[calc(100%-60px)] justify-center flex gap-[20px] px-[3%] py-[20px]"
      >
        <HomeLeft />
        <HomeRight />
      </div>
    </>
  );
}

export default Home;
