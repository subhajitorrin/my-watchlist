import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { useVideo } from "../../store/VideoStore";
import { toast } from "react-toastify";

const opts = {
  height: "550",
  width: "100%",
  playerVars: {
    autoplay: 0
  }
};

function QueueLeft() {
  const {
    currnetVideo,
    revertFromQueue,
    removeVideoFromQueue,
    revertAfterEnd
  } = useVideo();

  const [toggleChecked, settoggleChecked] = useState(
    JSON.parse(sessionStorage.getItem("isRevert")) || false
  );

  async function handleVideoEnd() {
    try {
      console.log("video ended");
    } catch (error) {
      console.log(error);
      toast.warn(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="h-full w-[70%] gap-[10px] flex flex-col">
      {currnetVideo !== null && (
        <div className="">
          <YouTube
            videoId={currnetVideo.videoId}
            opts={opts}
            onEnd={handleVideoEnd}
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
