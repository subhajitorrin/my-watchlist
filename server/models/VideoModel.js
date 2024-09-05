import mongoose from "mongoose";

const VideoSchema = mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    tags: [
      {
        type: String
      }
    ],
    thumbnail: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    duration: {
      type: Number,
      required: true
    },
    playback: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
