import mongoose from "mongoose";
const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    tags: {
      type: [String],
      required: true
    },
    videoCount: {
      type: Number,
      default: 0
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model("Category", CategorySchema);
export default CategoryModel;
