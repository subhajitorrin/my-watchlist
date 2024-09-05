import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { useVideo } from "../../store/VideoStore";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";

function VideoCard({ item }) {
  const { formatTime, getISTdate,getISTtime } = useVideo();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success("Link copied");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className=" flex gap-[10px] rounded-[7px] h-[150px] w-full bg-[#111827] p-[10px]">
      <div className="h-full w-[35%]">
        <img
          className="h-full w-full object-cover rounded-[7px]"
          src={item.thumbnail}
        />
      </div>
      <div className="w-[75%] flex flex-col justify-between py-[10px]">
        <div className="">
          <h2 className="text-[16px] font-[500] text-[#ffffffba]">
            {item.title.length > 115 ? (
              <>
                {item.title.slice(0, 115)}
                <span>...</span>
              </>
            ) : (
              item.title
            )}
          </h2>
          <div className="flex gap-[10px]">
            <p className="text-[13px] ">{formatTime(item.duration)}</p>
            <p className="text-[13px] text-[#ffffff96]">
              Added {getISTdate(item.createdAt)}, <span>{getISTtime(item.createdAt)}</span>
              {/* Added 05-09-2024, <span></span> */}
            </p>
          </div>
        </div>
        <div className="flex gap-[7px] items-center ">
          <button className="bg-[#7e22ce] font-[500] hover:bg-[#6018a0] transition-all ease-linear duration-200 py-[2px] px-[10px] rounded-[4px] text-[12px]">
            Add to queue
          </button>
          <button className="bg-[#4ca8af] font-[500] hover:bg-[#3a8186] transition-all ease-linear duration-200 py-[2px] px-[10px] rounded-[4px] text-[12px]">
            Reminder
          </button>
          <button className="bg-[#f44336] font-[500] hover:bg-[#b42828] transition-all ease-linear duration-200 py-[2px] px-[10px] rounded-[4px] text-[12px]">
            Delete
          </button>
          <div className="">
            {/* <MdContentCopy
              onClick={copyToClipboard}
              className="text-[15px] cursor-pointer"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
