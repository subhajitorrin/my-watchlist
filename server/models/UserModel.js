import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    queue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue"
      }
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
