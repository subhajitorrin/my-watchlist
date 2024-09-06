import dotenv from "dotenv";
import VideoModel from "../models/VideoModel.js";
import UserModel from "../models/UserModel.js";
import {
  getThumbnail,
  getVideoDurationAndTitle,
  getVideoId,
  isYouTubeUrl
} from "../utility/YoutubeTools.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.APIKEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getAiGeneratedTags(title, attempt = 0) {
  const prompt = `I need help categorizing a video based on its title. The title is '${title}'. Please provide two categories in the following format: 

  GeneralCategory,Specific Category
  
  The general category should be a broad category that fits the content (e.g., 'Programming and Development'), and the specific category should be more focused and related to the title of the video (e.g., 'Java' for Java-related content). Please give short categories. Don't give any other text just give two of them comma seperated. If the title is in another language then understand the meaning and give the category in english.`;

  try {
    // Simulating model generation and response
    const res = await model.generateContent(prompt);
    let result = await res.response.text();
    result=result.trim()

    console.log("--------------------------------------------------");
    console.log(result);

    let tagsArray = result ? result.split(",") : [];
    tagsArray[0] = tagsArray[0].trim()
    tagsArray[1] = tagsArray[1].trim()

    console.log(tagsArray);

    if (tagsArray.length === 0 && attempt < 3) {
      console.log("Categories not found, retrying...");
      return await getAiGeneratedTags(title, attempt + 1);
    }

    return tagsArray;
  } catch (error) {
    console.error("Error:", error);
    // Return empty categories in case of error
    return null;
  }
}

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
    const tags = await getAiGeneratedTags(title);

    const newVideo = new VideoModel({
      title,
      duration,
      thumbnail,
      videoId,
      url,
      user: userid,
      tags: tags !== null ? tags : []
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

async function revertFromQueueToLibrary(req, res) {
  try {
    const { videoId } = req.body;
    const userId = req.id;

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { queue: videoId },
        $push: { videos: videoId }
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Video moved from queue to library", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateProgress(req, res) {
  const { videoid, sec } = req.body;
  try {
    const video = await VideoModel.findByIdAndUpdate(
      videoid,
      { playback: sec },
      { new: true }
    );
    if (!video) {
      return res
        .status(400)
        .json({ message: "Video not found!", success: false });
    }
    return res.status(200).json({ message: "Playback updated", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while updating playback", success: false });
  }
}

async function getPlayback(req, res) {
  const { videoid } = req.params;
  try {
    const playBackRes = await VideoModel.findById(videoid).select("playback");
    return res.status(200).json({
      message: "Playback fetched",
      success: false,
      playback: playBackRes.playback ? playBackRes.playback : 0
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while fetching playback", success: false });
  }
}

export {
  addVideoToLibrary,
  getLibrary,
  deleteVideo,
  addToQueue,
  getQueue,
  removeFromQueue,
  revertFromQueueToLibrary,
  updateProgress,
  getPlayback
};
