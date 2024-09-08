import React from "react";
import VideoCard from "./VideoCard";
import { useVideo } from "../../store/VideoStore";

function HomeLeft() {
  const { library, setDropDownIndex, homeDropDownInex, homeDropDownList } =
    useVideo((state) => ({
      library: state.library,
      setDropDownIndex: state.setDropDownIndex,
      homeDropDownInex: state.homeDropDownInex,
      homeDropDownList: state.homeDropDownList
    }));

  return (
    <div className="h-full w-[50%] gap-[10px] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-[500]">My Library</h2>
        <select
          onChange={(e) => {
            setDropDownIndex(e.target.value);
          }}
          value={homeDropDownInex}
          className="text-white bg-[#111827] text-[14px] font-[500] outline-none w-[200px] py-[3px] rounded-[5px] px-[5px]"
        >
          {homeDropDownList.map((item, index) => {
            return (
              <option
                className="font-[500] cursor-pointer"
                value={index}
                key={index}
              >
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex flex-col gap-[10px] h-[100%] overflow-y-auto scrollNone">
        {library.length === 0 ? (
          <div className="flex justify-center items-center rounded-[7px] h-[150px] w-full bg-[#111827]">
            <p className="text-[#ffffff8a]">No video in library</p>
          </div>
        ) : (
          library.map((item, index) => {
            return <VideoCard key={index} item={item} />;
          })
        )}
      </div>
    </div>
  );
}

export default HomeLeft;
