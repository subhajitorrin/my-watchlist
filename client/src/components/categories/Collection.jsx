import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useVideo } from "../../store/VideoStore";
import CategoryCard from "./CategoryCard";

function Collection() {
  const { getAllCategories, categories, getAllTags, tags } = useVideo();
  useEffect(() => {
    getAllCategories();
  }, []);
  useEffect(() => {
    getAllTags();
  }, []);
  return (
    <>
      <Navbar />
      <div className="">
        <div className="flex justify-center">
          <div className="w-[82%] flex gap-[10px] mt-[10px] mb-[20px] overflow-x-auto scrollNone">
            {tags.map((item, index) => {
              return (
                <div
                  key={index}
                  className="min-w-fit text-[13px] cursor-pointer font-[500] bg-[#272727] inline-block rounded-[5px] px-[10px] py-[5px]"
                >
                  <p className="relative top-[-2px]">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-[20px] justify-center">
          {categories.map((item, index) => {
            return <CategoryCard key={index} item={item} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Collection;
