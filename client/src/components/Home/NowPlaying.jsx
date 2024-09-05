import React from "react";
import { GrCaretNext } from "react-icons/gr";

function NowPlaying() {
  return (
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Now Playing</h2>
      <div className="w-full min-h-[150px] bg-[#111827] flex items-center justify-center rounded-[7px]">
        <p className="text-[#ffffff8a]">No video playing</p>
      </div>
      <button className="bg-[#7e22ce] justify-center hover:bg-[#6018a0] flex font-[500] transition-all ease-linear duration-200 py-[7px] px-[10px] rounded-[5px]">
        <span className="flex gap-[3px] items-center">
          <GrCaretNext />
          Play next
        </span>
      </button>
    </div>
  );
}

export default NowPlaying;
