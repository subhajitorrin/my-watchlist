import React, { useEffect } from "react";
import VideoCard from "./VideoCard";
import { useVideo } from "../../store/VideoStore";
import { useWidth } from "../../store/useWIdth";

function HomeLeft() {
  const { isMobile } = useWidth((state) => ({
    isMobile: state.isMobile
  }));
  const {
    library,
    setDropDownIndex,
    homeDropDownValue,
    homeDropDownList,
    getLibrary
  } = useVideo((state) => ({
    library: state.library,
    setDropDownIndex: state.setDropDownIndex,
    homeDropDownValue: state.homeDropDownValue,
    homeDropDownList: state.homeDropDownList,
    getLibrary: state.getLibrary
  }));

  useEffect(() => {
    getLibrary();
  }, [homeDropDownValue]);

  if (isMobile) {
    return (
      <div className="h-full w-full gap-[10px] flex flex-col pb-[100px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-[500]">My Library</h2>
          <select
            onChange={(e) => {
              setDropDownIndex(e.target.value);
            }}
            value={homeDropDownValue}
            className="text-white bg-[#111827] relative text-[14px] font-[500] outline-none w-[150px] py-[3px] rounded-[5px] px-[5px]"
          >
            {homeDropDownList.map((item, index) => {
              return (
                <option
                  className="font-[500] cursor-pointer"
                  value={item.value}
                  key={index}
                >
                  {item.name}
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

  return (
    <div className="h-full w-[50%] gap-[10px] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-[500]">My Library</h2>
        <select
          onChange={(e) => {
            setDropDownIndex(e.target.value);
          }}
          value={homeDropDownValue}
          className="text-white bg-[#111827] text-[14px] font-[500] outline-none w-[200px] py-[3px] rounded-[5px] px-[5px]"
        >
          {homeDropDownList.map((item, index) => {
            return (
              <option
                className="font-[500] cursor-pointer"
                value={item.value}
                key={index}
              >
                {item.name}
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
