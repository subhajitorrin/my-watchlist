import axios from "axios";

function getThumbnail(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

function getVideoId(url) {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function isYouTubeUrl(url) {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return regExp.test(url);
}

async function getVideoDurationAndTitle(videoId) {
  const API_URL = "https://www.googleapis.com/youtube/v3/videos";
  try {
    const response = await axios.get(API_URL, {
      params: {
        part: "snippet,contentDetails",
        id: videoId,
        key: process.env.YT_DATA_API_V3
      }
    });

    const video = response.data.items[0];

    if (video) {
      const title = video.snippet.title;
      const duration = convertDurationToSeconds(video.contentDetails.duration);
      return { title, duration };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}

function convertDurationToSeconds(isoDuration) {
  const match = isoDuration.match(
    /^PT(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?$/
  );
  if (!match) {
    return 0;
  }
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export { getThumbnail, getVideoId, isYouTubeUrl, getVideoDurationAndTitle };
