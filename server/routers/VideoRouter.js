import express from "express";
import authToken from "../middleware/authToken.js";
import {
  addToQueue,
  addVideoToLibrary,
  deleteVideo,
  getLibrary,
  getQueue,
  removeFromQueue,
  revertFromQueueToLibrary
} from "../controllers/VideoController.js";
const VideoRouter = express.Router();
VideoRouter.post("/add-video-to-library", authToken, addVideoToLibrary);
VideoRouter.get("/get-library", authToken, getLibrary);
VideoRouter.get("/get-queue", authToken, getQueue);
VideoRouter.put("/delete-video/:id", authToken, deleteVideo);
VideoRouter.post("/add-to-queue", authToken, addToQueue);
VideoRouter.put("/remove-from-queue", authToken, removeFromQueue);
VideoRouter.put("/revert-from-queue-to-library", authToken, revertFromQueueToLibrary);
export default VideoRouter;
