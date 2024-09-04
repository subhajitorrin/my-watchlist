import mongoose from "mongoose";

const QueueSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timeStamps: true }
);

export default mongoose.model("Queue", QueueSchema);
