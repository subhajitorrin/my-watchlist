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

    const videoRes = await VideoModel.findOne({ videoId, user: userid });
    if (videoRes) {
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
    let library = await UserModel.findById(userid).select("videos").populate({
      path: "videos",
      options: { sort: { createdAt: -1 } }
    });
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

async function deleteVideo(req, res) {
  const { id } = req.params;
  const userid = req.id;

  try {
    const video = await VideoModel.findById(id);
    if (!video) {
      return res
        .status(400)
        .json({ message: "Video not found!", success: false });
    }

    const user = await UserModel.findById(userid);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found!", success: false });
    }

    if (!user.videos.includes(video._id)) {
      return res
        .status(400)
        .json({ message: "Video not in your library!", success: false });
    }

    user.videos.pull(video._id);

    await user.save();
    await VideoModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Video removed", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while deleting video!", success: false });
  }
}

async function addToQueue(req, res) {
  const userid = req.id;
  const { videoId } = req.body;
  try {
    const user = await UserModel.findById(userid);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found!", success: false });
    }
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res
        .status(400)
        .json({ message: "Video not found!", success: false });
    }
    user.videos.pull(videoId);
    user.queue.push(videoId);
    await user.save();
    return res
      .status(200)
      .json({ message: "Added to queue", success: true, video });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while adding queue!", success: false });
  }
}

async function getQueue(req, res) {
  const userid = req.id;
  try {
    let queue = await UserModel.findById(userid).select("queue").populate({
      path: "queue",
      model: VideoModel
    });
    if (!queue) {
      return res
        .status(400)
        .json({ message: "Queue not found!", success: false });
    }
    return res.status(200).json({
      message: "Queue fetched",
      success: true,
      queue: queue.queue.length > 0 ? queue.queue : []
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while getting queue", success: false });
  }
}

async function removeFromQueue(req, res) {
  const { videoId } = req.body;
  const userid = req.id;
  
  try {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res
        .status(400)
        .json({ message: "Video not found!", success: false });
    }
    const user = await UserModel.findById(userid);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found!", success: false });
    }

    if (!user.queue.includes(videoId)) {
      return res
        .status(400)
        .json({ message: "Video not in your queue!", success: false });
    }

    user.queue.pull(videoId);

    await user.save();
    await VideoModel.findByIdAndDelete(videoId);

    return res.status(200).json({ message: "Video removed", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while deleting video from queue",
      success: false
    });
  }
}

export {
  addVideoToLibrary,
  getLibrary,
  deleteVideo,
  addToQueue,
  getQueue,
  removeFromQueue
};
