import express from "express";
import authToken from "../middleware/authToken.js";
import {
  addToQueue,
  addVideoToLibrary,
  deleteVideo,
  getLibrary
} from "../controllers/VideoController.js";
const VideoRouter = express.Router();
VideoRouter.post("/add-video-to-library", authToken, addVideoToLibrary);
VideoRouter.get("/get-library", authToken, getLibrary);
VideoRouter.put("/delete-video/:id", authToken, deleteVideo);
VideoRouter.post("/add-to-queue", authToken, addToQueue);
export default VideoRouter;
