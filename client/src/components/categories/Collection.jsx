import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useVideo } from "../../store/VideoStore";

function Collection() {
  const [categoriesList, setCategoriesList] = useState([]);
  const { getAllCategories } = useVideo();
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <Navbar />
      <div className=""></div>
    </>
  );
}

export default Collection;
