import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import { useVideo } from "../../store/VideoStore";
import CategoryCard from "./CategoryCard";
import { RiArrowDropLeftLine } from "react-icons/ri";
import Search from "../Search/Search";

function Collection() {
  const { getAllCategories, categories, getAllTags, tags, searchQuery } =
    useVideo((state) => ({
      getAllCategories: state.getAllCategories,
      categories: state.categories,
      getAllTags: state.getAllTags,
      tags: state.tags,
      searchQuery: state.searchQuery
    }));
  const container = useRef(null);

  useEffect(() => {
    getAllCategories();
  }, []);
  useEffect(() => {
    getAllTags();
  }, []);

  function slideRight() {
    if (container.current) {
      container.current.scrollTo({
        left: container.current.scrollLeft + 300,
        behavior: "smooth"
      });
    }
  }
  function slideLeft() {
    if (container.current) {
      container.current.scrollTo({
        left: container.current.scrollLeft - 300,
        behavior: "smooth"
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="flex justify-center relative">
          <div
            onClick={slideLeft}
            className="absolute cursor-pointer left-[6.5%] top-[11px] bg-[#272727] text-[white] p-[5px] rounded-[100%] z-[10]"
          >
            <RiArrowDropLeftLine />
          </div>
          <div
            onClick={slideRight}
            className="absolute cursor-pointer right-[6.5%] top-[11px] bg-[#272727] text-[white] p-[5px] rounded-[100%] z-[10]"
          >
            <RiArrowDropLeftLine className="rotate-180" />
          </div>
          <div
            ref={container}
            className="relative w-[82%] flex gap-[10px] mt-[10px] mb-[20px] overflow-x-auto scrollNone"
          >
            {tags.map((item, index) => {
              return (
                <div
                  key={index}
                  className="hover:bg-[#1d1c1c] transition-all ease-linear duration-200 min-w-fit text-[13px] cursor-pointer font-[500] bg-[#272727] inline-block rounded-[5px] px-[10px] py-[5px]"
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
