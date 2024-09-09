import React, { useState } from "react";
import { useVideo } from "../../store/VideoStore";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { MdContentPaste } from "react-icons/md";
import { useWidth } from "../../store/useWIdth";

function AddVideo() {
  const { isMobile } = useWidth((state) => ({
    isMobile: state.isMobile
  }));
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

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      seturl(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }

  if (isMobile) {
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Add a video</h2>
      <div className="relative">
        <input
          onChange={(e) => {
            seturl(e.target.value);
          }}
          className="bg-[#111827] pr-[40px] w-full outline-none py-[7px] px-[20px] rounded-[5px]"
          type="text"
          value={url}
          placeholder="Paste youtube link here..."
        />
        <MdContentPaste
          onClick={handlePaste}
          className="text-[22px] absolute right-[2%] top-[20%] cursor-pointer"
        />
      </div>
      <button
        onClick={handleAddVideo}
        style={{ pointerEvents: isLoading ? "none" : "auto" }}
        className="bg-[#7e22ce] hover:bg-[#6018a0] font-[500] transition-all ease-linear duration-200 py-[7px] px-[10px] rounded-[5px]"
      >
        {isLoading ? <BeatLoader color="#ffffff" size={5} /> : "Add to list"}
      </button>
    </div>;
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-[20px] font-[500]">Add a video</h2>
      <div className="relative">
        <input
          onChange={(e) => {
            seturl(e.target.value);
          }}
          className="bg-[#111827] pr-[40px] w-full outline-none py-[7px] px-[20px] rounded-[5px]"
          type="text"
          value={url}
          placeholder="Paste youtube link here..."
        />
        <MdContentPaste
          onClick={handlePaste}
          className="text-[22px] absolute right-[2%] top-[20%] cursor-pointer"
        />
      </div>
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
