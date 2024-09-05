import express from "express";
import authToken from "../middleware/authToken.js";
import {
  addVideoToLibrary,
  getLibrary
} from "../controllers/VideoController.js";
const VideoRouter = express.Router();
VideoRouter.post("/add-video-to-library", authToken, addVideoToLibrary);
VideoRouter.get("/get-library", authToken, getLibrary);
export default VideoRouter;
