import VideoModel from "../models/VideoModel.js";
import UserModel from "../models/UserModel.js";
import {
  getThumbnail,
  getVideoDurationAndTitle,
  getVideoId,
  isYouTubeUrl
} from "../utility/YoutubeTools.js";

async function addVideoToLibrary(req, res) {
  const { url } = req.body;
  const userid = req.id;
  try {
    if (!isYouTubeUrl(url)) {
      return res
        .status(400)
        .json({ message: "Not a youtube video!", success: false });
    }
    const videoId = getVideoId(url);
    if (!videoId) throw new Error("Invalid YouTube Video Id");

    const isPresent = await VideoModel.findOne({ videoId, user: userid });
    if (isPresent) {
      return res
        .status(400)
        .json({ message: "Already present!", success: false });
    }

    const thumbnail = getThumbnail(videoId);
    const { title, duration } = await getVideoDurationAndTitle(videoId);
    const newVideo = new VideoModel({
      title,
      duration,
      thumbnail,
      videoId,
      url,
      user: userid
    });
    const response = await newVideo.save();
    await UserModel.findByIdAndUpdate(userid, {
      $push: { videos: response._id }
    });
    return res
      .status(201)
      .json({ message: "Video added", success: true, video: response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while adding video", success: false });
  }
}

async function getLibrary(req, res) {
  const userid = req.id;
  try {
    let library = await UserModel.findById(userid)
      .select("videos")
      .populate("videos");
    if (!library) {
      return res
        .status(400)
        .json({ message: "Library not found!", success: false });
    }
    return res.status(200).json({
      message: "Library fetched",
      success: true,
      library: library.videos.length > 0 ? library.videos : []
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while getting library", success: false });
  }
}

export { addVideoToLibrary, getLibrary };
