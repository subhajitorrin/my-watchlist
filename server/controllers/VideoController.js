import dotenv from "dotenv";
import VideoModel from "../models/VideoModel.js";
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";
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
  
  The general category should be a broad category that fits the content (e.g., 'Programming and Development'), and the specific category should be more focused and related to the title of the video (e.g., 'Java' for Java-related content). Please give short categories. Don't give any other text just give two of them comma seperated. If the title is in another language then understand the meaning and give the category in english. If the categories are small then you can give more than two categories if you want but if the categories are larger then two is enough.`;

  try {
    // Simulating model generation and response
    const res = await model.generateContent(prompt);
    let result = await res.response.text();
    result = result.trim();

    let tagsArray = result ? result.split(",") : [];
    tagsArray[0] = tagsArray[0].trim();
    tagsArray[1] = tagsArray[1].trim();

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

async function AIgeneratedCategories(title, userid, videoId, tags) {
  if (tags.length === 0) return;

  const existingCategoryRes = await CategoryModel.find({
    user: userid
  }).select("name");

  const existingCategoryNames = existingCategoryRes.map((item) => item.name);

  const prompt = `I have a video titled ${title} with tags "${tags.join(
    ","
  )}" and a collection of videos in my database, each tagged with multiple keywords. I would like to organize these videos into categories. My current categories are "${existingCategoryNames.join(
    ","
  )}" Please analyze the tags of my video to determine if they fit into any of the existing categories. If they do, simply provide the relevant category name. If they do not, suggest a new category name. Just give me one single category name which fits more. and don't give any other text or something just give category name.`;

  try {
    const res = await model.generateContent(prompt);
    const result = await res.response.text();
    const existingCategory = await CategoryModel.findOne({
      name: result.trim(),
      user: userid
    });

    if (existingCategory) {
      for (let tag of tags) {
        if (!existingCategory.tags.includes(tag)) {
          existingCategory.tags.push(tag);
        }
      }
      existingCategory.videos.push(videoId);
      existingCategory.videoCount = existingCategory.videos.length;
      const category = await existingCategory.save();
      return category;
    } else {
      const image = await VideoModel.findById(videoId).select("thumbnail");
      const newCategory = new CategoryModel({
        name: result.trim(),
        videoCount: 1,
        tags,
        videos: [videoId],
        user: userid,
        image: image.thumbnail
      });
      const category = await newCategory.save();
      return category;
    }
  } catch (error) {
    console.error("Error:", error);
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

    const refinedUrl = url.includes("&list=")
      ? `https://www.youtube.com/watch?v=${videoId}`
      : url;

    const newVideo = new VideoModel({
      title,
      duration,
      thumbnail,
      videoId,
      url: refinedUrl,
      user: userid,
      tags: tags !== null ? tags : []
    });
    const response = await newVideo.save();

    const category = await AIgeneratedCategories(
      title,
      userid,
      response._id,
      tags
    );

    const categoryId = category._id ? category._id.toString() : null;

    const updateQuery = {
      $push: { videos: response._id }
    };
    if (categoryId) {
      updateQuery.$addToSet = { categories: categoryId };
    }

    await UserModel.updateOne({ _id: userid }, updateQuery);

    if (categoryId) {
      response.category = categoryId;
      await response.save();
    }

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
  const { filterOption } = req.query;
  try {
    let library = await UserModel.findById(userid)
      .select("videos")
      .populate({
        path: "videos",
        options: { sort: { createdAt: -1 } }
      });
    if (!library) {
      return res
        .status(400)
        .json({ message: "Library not found!", success: false });
    }
    library = library.videos;

    let filteredList = [];

    switch (filterOption) {
      case "recent":
        filteredList = library.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        filteredList = library.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "today":
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        filteredList = library.filter(
          (item) => item.createdAt >= startOfDay && item.createdAt <= endOfDay
        );
        break;
      case "yesterday":
        const startOfYesterday = new Date();
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date();
        endOfYesterday.setDate(endOfYesterday.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);
        filteredList = library.filter(
          (item) =>
            item.createdAt >= startOfYesterday &&
            item.createdAt <= endOfYesterday
        );
        break;
      case "last-3-days-ago":
        const startOfLastDay3 = new Date();
        startOfLastDay3.setDate(startOfLastDay3.getDate() - 2);
        const endtOfLastDay3 = new Date();
        endtOfLastDay3.setDate(startOfLastDay3.getDate() - 2);
        filteredList = library.filter(
          (item) =>
            item.createdAt >= startOfLastDay3 &&
            item.createdAt <= endtOfLastDay3
        );
        break;
      case "short-duration":
        filteredList = library.sort((a, b) => a.duration - b.duration);
        break;
      case "large-duration":
        filteredList = library.sort((a, b) => b.duration - a.duration);
        break;
      default:
        [];
    }

    return res.status(200).json({
      message: "Library fetched",
      success: true,
      library: filteredList
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
      success: true,
      playback: playBackRes.playback ? playBackRes.playback : 0
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while fetching playback", success: false });
  }
}

async function getCategories(req, res) {
  const userid = req.id;
  try {
    const categories = await UserModel.findById(userid)
      .select("categories")
      .populate("categories");
    return res.status(200).json({
      message: "Categories fetched",
      success: true,
      categories
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while fetching categories", success: false });
  }
}

async function getAllTags(req, res) {
  try {
    const userid = req.id;
    const tagslist = await VideoModel.find({ user: userid })
      .select("tags")
      .exec();
    const tags = tagslist.flatMap((item) => item.tags);
    const tagsSet = new Set(tags);
    res.status(200).json({
      message: "All tags feched",
      success: true,
      tagslist: [...tagsSet]
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error while fetching tags", success: false });
  }
}

async function searchVideo(req, res) {
  const useid = req.id;
  const { searchQuery } = req.query;
  console.log(searchQuery);
  res
    .status(200)
    .json({ message: "Search result", success: true, list: searchQuery });
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
  getPlayback,
  getCategories,
  getAllTags,
  searchVideo
};
