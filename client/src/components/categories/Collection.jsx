import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useVideo } from "../../store/VideoStore";
import CategoryCard from "./CategoryCard";

function Collection() {
  const { getAllCategories, categories } = useVideo();
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <Navbar />
      <div className="">
        <div className=""></div>
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
