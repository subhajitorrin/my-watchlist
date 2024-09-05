import React from "react";
import { useVideo } from "../../store/VideoStore";

function QueueCard({ item }) {
  const { formatTime } = useVideo();
  return (
    <div className="flex gap-[10px] w-full min-h-[120px] rounded-[7px] cursor-pointer bg-[#111827] p-[10px] bg-[]">
      <img
        className="w-[170px] h-full object-cover rounded-[5px]"
        src={item.thumbnail}
      />
      <div className="text-[13px] font-[500] flex flex-col justify-between">
        <div className="">
          <p>
            {item.title.length > 45 ? (
              <span>{item.title.slice(0, 45)}...</span>
            ) : (
              item.title
            )}
          </p>
          <p>{formatTime(item.duration)}</p>
        </div>
        <div className="w-full flex justify-center gap-[10px]">
          <button className="bg-[#4ca8af] font-[500] hover:bg-[#3a8186] transition-all ease-linear duration-200 py-[2px] px-[10px] rounded-[4px] text-[12px]">
            Remove
          </button>
          <button className="bg-[#af4c7c] font-[500] hover:bg-[#8b3b62] transition-all ease-linear duration-200 py-[2px] px-[10px] rounded-[4px] text-[12px]">
            Revert
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueueCard;
