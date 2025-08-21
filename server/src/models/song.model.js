import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    enum: [
      "Hindi",
      "Punjabi",
      "English",
      "Tamil",
      "Telugu",
      "Bhojpuri",
      "Instrumental",
      "Hip-Hop/Rap",
      "Romantic",
      "Party/Dance",
      "Classical/Devotional",
      "Other",
    ],
    default: "Other",
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  streamUrl: {
    type: String,
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);
export default Song;
