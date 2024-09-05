import React, { useState } from "react";
import QueueCard from "./QueueCard";
import { useVideo } from "../../store/VideoStore";

function QueueRight() {
  const { library } = useVideo();
  const [queueList, setQueueList] = useState(
    Array.from({ length: 20 }).fill("")
  );
  return (
    <div className="h-full w-[25%] flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Current Queue</h2>
      <div className="h-[94.8%] overflow-y-auto scrollNone flex flex-col gap-[10px]">
        {queueList.map((item, index) => {
          return <QueueCard key={index} item={item} />;
        })}
      </div>
    </div>
  );
}

export default QueueRight;
