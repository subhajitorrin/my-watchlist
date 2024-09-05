import React from "react";

function AddVideo() {
  return (
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Add a video</h2>
      <input
        className="bg-[#111827] outline-none py-[7px] px-[20px]"
        type="text"
        placeholder="Paste youtube link here..."
      />
      <button className="bg-[#7e22ce] hover:bg-[#6018a0] font-[500] transition-all ease-linear duration-200 py-[7px] px-[10px] rounded-[5px]">
        Add to list
      </button>
    </div>
  );
}

export default AddVideo;
