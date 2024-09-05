import React, { useState } from "react";
import { useVideo } from "../../store/VideoStore";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

function AddVideo() {
  const [url, seturl] = useState("");
  const { addVideoToLibrary, isLoading } = useVideo();
  async function handleAddVideo() {
    if (url === "") {
      return;
    }
    try {
      await addVideoToLibrary(url);
      seturl("");
      toast.success("Video added");
    } catch (error) {
      toast.warn(error.response?.data?.message || error.message);
    }
  }
  return (
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Add a video</h2>
      <input
        onChange={(e) => {
          seturl(e.target.value);
        }}
        className="bg-[#111827] outline-none py-[7px] px-[20px] rounded-[5px]"
        type="text"
        value={url}
        placeholder="Paste youtube link here..."
      />
      <button
        onClick={handleAddVideo}
        style={{ pointerEvents: isLoading ? "none" : "auto" }}
        className="bg-[#7e22ce] hover:bg-[#6018a0] font-[500] transition-all ease-linear duration-200 py-[7px] px-[10px] rounded-[5px]"
      >
        {isLoading ? <BeatLoader color="#ffffff" size={5} /> : "Add to list"}
      </button>
    </div>
  );
}

export default AddVideo;
