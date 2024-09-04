import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import UserRouter from "./routers/UserRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

app.use(express.json());
app.use(
  cors({
    origin: "*"
  })
);

app.use("/", UserRouter);

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
