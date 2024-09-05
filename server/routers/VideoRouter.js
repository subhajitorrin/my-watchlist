import express from "express";
import authToken from "../middleware/authToken.js";
import {
  addVideoToLibrary,
  deleteVideo,
  getLibrary
} from "../controllers/VideoController.js";
const VideoRouter = express.Router();
VideoRouter.post("/add-video-to-library", authToken, addVideoToLibrary);
VideoRouter.get("/get-library", authToken, getLibrary);
VideoRouter.put("/delete-video/:id", authToken, deleteVideo);
export default VideoRouter;
