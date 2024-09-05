import express from "express"
import authToken from "../middleware/authToken.js"
import { addVideoToLibrary } from "../controllers/VideoController.js";
const VideoRouter = express.Router()
VideoRouter.post("/add-video-to-library",authToken,addVideoToLibrary)
export default VideoRouter;