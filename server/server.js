import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

app.get("/",(req,res)=>{
    res.send("Hello, world!");
})

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Sever is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.log("Error while connecting to MongoDB", error);
  });
