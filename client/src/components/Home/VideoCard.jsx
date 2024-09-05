import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";

function VideoCard() {
  const [title, settitle] = useState(
    "Coding a SAAS platform in 6 hours - NextJS, Tailwind, Prisma,Postgres Coding a SAAS platform in 6 hours - NextJS, Tailwind, Prisma,Postgres"
  );
  return (
    <div className=" flex gap-[10px] rounded-[7px] h-[150px] w-full bg-[#111827] p-[10px]">
      <div className="h-full w-[35%]">
        <img
          className="h-full w-full object-cover rounded-[7px]"
          src="https://media.istockphoto.com/id/1337232523/photo/high-angle-view-of-a-lake-and-forest.jpg?s=1024x1024&w=is&k=20&c=EPh5_6vL4mywUc3AfLRKJCChgAs41oI9nMveOInep_0="
        />
      </div>
      <div className="w-[75%] flex flex-col justify-between py-[10px]">
        <div className="">
          <h2 className="text-[16px] font-[500] text-[#ffffffba]">
            {title.length > 115 ? (
              <>
                {title.slice(0, 115)}
                <span>...</span>
              </>
            ) : (
              title
            )}
          </h2>
          <div className="flex gap-[10px]">
            <p className="text-[13px] ">6:34 min</p>
            <p className="text-[13px] text-[#ffffff96]">
              Added 05-09-2024, 10:24 AM
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
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
