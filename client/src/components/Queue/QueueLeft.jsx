import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import ReactPlayer from "react-player";
import { useVideo } from "../../store/VideoStore";
import { toast } from "react-toastify";

function QueueLeft() {
  const {
    updateProgress,
    currnetVideo,
    revertFromQueue,
    removeVideoFromQueue
  } = useVideo();

  const [toggleChecked, settoggleChecked] = useState(
    JSON.parse(sessionStorage.getItem("isRevert")) || false
  );

  const [progress, setProgress] = useState(0);

  async function handleVideoEnd() {
    try {
      if (toggleChecked) {
        await revertFromQueue(currnetVideo);
      } else {
        await removeVideoFromQueue(currnetVideo._id);
      }
    } catch (error) {
      console.log(error);
      toast.warn(error.response?.data?.message || error.message);
    }
  }

  function handleStateChange(e) {
    setProgress(parseInt(e.playedSeconds));
  }

  async function handleUpdateProgress() {
    try {
      await updateProgress(currnetVideo, progress);
    } catch (error) {
      console.log(error);
      toast.warn(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="h-full w-[70%] gap-[10px] flex flex-col">
      {currnetVideo !== null && (
        <div className="">
          <ReactPlayer
            url={`${currnetVideo.url}&start=${currnetVideo.playback}`}
            controls={true}
            height={550}
            width={"100%"}
            onEnded={handleVideoEnd}
            onProgress={handleStateChange}
          />
          <div className="flex justify-between">
            <p className="text-[17px] font-[500] mt-[10px]">
              {currnetVideo.title}
            </p>
            <div className="flex gap-[5px] items-center">
              <input
                type="checkbox"
                className="relative top-[2px]"
                checked={toggleChecked}
                onChange={() => {
                  settoggleChecked((prev) => {
                    sessionStorage.setItem("isRevert", !prev);
                    return !prev;
                  });
                }}
              />
              <p>Revert video after end</p>
            </div>
          </div>
        </div>
      )}
      <button className="bg-[red] p-[10px]" onClick={handleUpdateProgress}>
        Update progress
      </button>
    </div>
  );
}

export default QueueLeft;
