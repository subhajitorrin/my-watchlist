import React, { useEffect, useState } from "react";
import QueueCard from "./QueueCard";
import { useVideo } from "../../store/VideoStore";

function QueueRight() {
  const { queue, getQueue } = useVideo();

  if (queue.length === 0) {
    return (
      <div className="h-[120px] w-[25%] rounded-[10px] flex justify-center items-center bg-[#111827]">
        <p className="text-[#ffffff8a]">Queue is empty</p>
      </div>
    );
  }

  return (
    <div className="h-full w-[25%] flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Current Queue</h2>
      <div className="h-[94.8%] overflow-y-auto scrollNone flex flex-col gap-[10px]">
        {queue.map((item, index) => {
          return <QueueCard key={index} item={item} />;
        })}
      </div>
    </div>
  );
}

export default QueueRight;
