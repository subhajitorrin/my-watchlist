import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      typeof: "string",
      required: true
    },
    password: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
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
