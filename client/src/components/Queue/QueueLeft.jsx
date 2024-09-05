import React, { useEffect } from "react";
import YouTube from "react-youtube";
import { useVideo } from "../../store/VideoStore";

const opts = {
  height: "550",
  width: "100%",
  playerVars: {
    autoplay: 0
  }
};

function QueueLeft() {
  const { currnetVideo } = useVideo();
  return (
    <div className="h-full w-[70%] gap-[10px] flex flex-col">
      {currnetVideo !== null && (
        <div className="">
          <YouTube videoId={currnetVideo.videoId} opts={opts} />
          <p className="text-[17px] font-[500] mt-[10px]">
            {currnetVideo.title}
          </p>
        </div>
      )}
    </div>
  );
}

export default QueueLeft;
