import React from "react";
import { useVideo } from "../../store/VideoStore";

function CategoryCard({ item }) {
  const { getISTdate } = useVideo();
  return (
    <div className="w-[300px]">
      <img
        src={item.image}
        className="w-[300px] h-[169.3px] object-cover rounded-[10px]"
      />
      <div className="px-[5px]">
        <div className="flex justify-between items-center mt-[3px]">
          <p className="text-[14px] font-[500]">{item.name}</p>
          <p className="text-[12px] font-[500] text-[#ffffff8a]">
            Last updated {getISTdate(item.updatedAt)}
          </p>
        </div>
        <div className="text-[12px] flex gap-[10px] mt-[3px] flex-wrap">
          {item.tags.slice(0, 3).map((item, index) => {
            return (
              <div className="text-[11px] bg-[#374f86] inline-block rounded-[5px] px-[7px] py-[2px]">
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
