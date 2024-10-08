import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useVideo } from "../../store/VideoStore";
import { toast } from "react-toastify";

function QueueLeft() {
  const {
    currnetVideo,
    revertFromQueue,
    removeVideoFromQueue,
    getPlayback,
    setCurrentProgress
  } = useVideo();
  const [playback, setPlayback] = useState(null);
  const [toggleChecked, settoggleChecked] = useState(
    JSON.parse(sessionStorage.getItem("isRevert")) || false
  );

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
    setCurrentProgress(parseInt(e.playedSeconds));
    sessionStorage.setItem("progress", parseInt(e.playedSeconds));
  }

  useEffect(() => {
    async function handleGetPlayback() {
      const res = await getPlayback(currnetVideo._id);
      setPlayback(res);
    }
    if (currnetVideo !== null) handleGetPlayback();
  }, [currnetVideo]);

  if (currnetVideo === null) {
    return (
      <div className="h-[550px] w-[70%] rounded-[10px] flex justify-center items-center bg-[#111827]">
        <p className="text-[#ffffff8a]">Add video in queue to play</p>
      </div>
    );
  }

  return (
    <div className="h-full w-[70%] gap-[10px] flex flex-col">
      {currnetVideo !== null && playback !== null && (
        <div className="">
          <ReactPlayer
            url={`${currnetVideo.url}&start=${playback}`}
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
    </div>
  );
}

export default QueueLeft;
