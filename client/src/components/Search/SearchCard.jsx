import React, { useState } from "react";
import { useVideo } from "../../store/VideoStore";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

function SearchCard({ item }) {
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [addQueueLoad, setAddQueueLoad] = useState(false);
  const { formatTime, getISTdate, getISTtime, deleteVideo, addVideoToQueue } =
    useVideo();

  async function handleAddVideoToQueue() {
    setAddQueueLoad(true);
    try {
      await addVideoToQueue(item._id);
      toast.success("Added to queue");
    } catch (error) {
      console.log(error);
      toast.warn(error.response?.data?.message || error.message);
    } finally {
      setAddQueueLoad(false);
    }
  }

  async function handleDeleteVideo() {
    setDeleteLoad(true);
    try {
      await deleteVideo(item._id);
      toast.success("Video deleted");
    } catch (error) {
      toast.warn(error.response?.data?.message || error.message);
    } finally {
      setDeleteLoad(false);
    }
  }

  return (
    <div className=" flex gap-[10px] rounded-[7px]  w-full bg-[#111827] p-[10px]">
      <div className="h-full w-[35%]">
        <img
          className="h-full w-full object-cover rounded-[7px]"
          src={item.thumbnail}
        />
      </div>
      <div className="w-[75%] flex flex-col justify-between">
        <div className="">
          <h2 className="text-[14px] font-[500] text-[#ffffffba]">
            {item.title.length > 70 ? (
              <>
                {item.title.slice(0, 70)}
                <span>...</span>
              </>
            ) : (
              item.title
            )}
          </h2>
          <div className="flex gap-[10px] my-[5px]">
            <p className="text-[13px] ">{formatTime(item.duration)}</p>
            <p className="text-[13px] text-[#ffffff96]">
              Added {getISTdate(item.createdAt)},{" "}
              <span>{getISTtime(item.createdAt)}</span>
              {/* Added 05-09-2024, <span></span> */}
            </p>
          </div>
        </div>

        <div className="flex gap-[7px] items-center ">
          <button
            style={{ addQueueLoad: deleteLoad ? "none" : "auto" }}
            onClick={handleAddVideoToQueue}
            className="bg-[#7e22ce] font-[500] hover:bg-[#6018a0] transition-all ease-linear duration-200 py-[3px] px-[10px] rounded-[4px] text-[12px]"
          >
            {addQueueLoad ? (
              <BeatLoader color="#ffffff" size={5} />
            ) : (
              "Add to queue"
            )}
          </button>
          <button className="bg-[#4ca8af] font-[500] hover:bg-[#3a8186] transition-all ease-linear duration-200 py-[3px] px-[10px] rounded-[4px] text-[12px]">
            Reminder
          </button>
          <button
            onClick={handleDeleteVideo}
            style={{ pointerEvents: deleteLoad ? "none" : "auto" }}
            className="bg-[#f44336] font-[500] hover:bg-[#b42828] transition-all ease-linear duration-200 py-[3px] w-[60px] rounded-[4px] text-[12px]"
          >
            {deleteLoad ? <BeatLoader color="#ffffff" size={5} /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
