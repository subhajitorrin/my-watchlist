import React from "react";
import Navbar from "../Navbar";
import QueueLeft from "./QueueLeft";
import QueueRight from "./QueueRight";

function Queue() {
  return (
    <>
      <Navbar />
      <div className="h-[calc(100%-60px)] justify-center flex gap-[20px] px-[3%] py-[20px]">
        <QueueLeft />
        <QueueRight />
      </div>
    </>
  );
}

export default Queue;
