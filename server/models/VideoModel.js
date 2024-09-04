import mongoose from "mongoose";

const VideoSchema = mongoose.Schema(
  {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    duration: {
      type: Number,
      required: true
    },
    playback: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
