import React from "react";

function QueueCard() {
  return (
    <div className="flex gap-[10px] w-full min-h-[120px] rounded-[7px] cursor-pointer bg-[#111827] p-[10px] bg-[]">
      <img
        className="w-[170px] h-full object-cover rounded-[5px]"
        src="https://i.ytimg.com/vi/gUiR617nQws/maxresdefault.jpg"
      />
      <div className="text-[13px] font-[500] flex flex-col justify-between">
        <div className="">
          <p>Lorem ipsum dolor sit amet consectetur.</p>
          <p>14:54 min</p>
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
