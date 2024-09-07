import express from "express";
import authToken from "../middleware/authToken.js";
import {
  addToQueue,
  addVideoToLibrary,
  deleteVideo,
  getLibrary,
  getPlayback,
  getQueue,
  removeFromQueue,
  revertFromQueueToLibrary,
  updateProgress,
  getCategories,
  getAllTags
} from "../controllers/VideoController.js";
const VideoRouter = express.Router();
VideoRouter.post("/add-video-to-library", authToken, addVideoToLibrary);
VideoRouter.get("/get-library", authToken, getLibrary);
VideoRouter.get("/get-queue", authToken, getQueue);
VideoRouter.get("/get-playback/:videoid", authToken, getPlayback);
VideoRouter.put("/delete-video/:id", authToken, deleteVideo);
VideoRouter.post("/add-to-queue", authToken, addToQueue);
VideoRouter.put("/remove-from-queue", authToken, removeFromQueue);
VideoRouter.put("/update-progress", authToken, updateProgress);
VideoRouter.put(
  "/revert-from-queue-to-library",
  authToken,
  revertFromQueueToLibrary
);
VideoRouter.get("/get-categories", authToken, getCategories);
VideoRouter.get("/get-tags", authToken, getAllTags);

export default VideoRouter;
