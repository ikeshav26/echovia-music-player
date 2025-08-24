import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import { cloudinary } from "../config/cloudinary.js";



export const changeRole = async (req, res) => {
  try {
    const userId = req.user;
    const role = req.role;

    if (role !== "admin" && role !== "majorAdmin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can change roles" });
    }

    const { email, newRole } = req.body;

    if (newRole === "majorAdmin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only major admins can assign this role" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "majorAdmin") {
      return res
        .status(403)
        .json({
          message: "Forbidden: You cannot change the role of a major admin",
        });
    }

    if (user.role == role) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You cannot change the role of a user with the same role",
        });
    }

    if (user.role == newRole) {
      return res
        .status(400)
        .json({ message: "Bad Request: User already has this role" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSong = async (req, res) => {
  try {
    if (req.role !== 'majorAdmin' && req.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only major admins can update songs" });
    }

    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const { title, artist, genre,thumbnailUrl } = req.body;

    if (title) {
      song.title = title;
    }

    if (artist) {
      song.artist = artist;
    }

    if (thumbnailUrl) {
       const cloudResponseThumbnail = await cloudinary.v2.uploader.upload(thumbnailUrl, {
            resource_type: 'auto',
            folder: 'echovia_songs',
            public_id: title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') + '_thumbnail',
            timeout: 120000
          });
        
      song.thumbnailUrl = cloudResponseThumbnail.secure_url;
    }

    if (genre) {
      const allowedGenres = [
        "Hindi",
        "Punjabi",
        "English",
        "Tamil",
        "Telugu",
        "Bhojpuri",
        "Instrumental",
        "Hip-Hop(Rap)",
        "Romantic",
        "Party(Dance)",
        "Classical(Devotional)",
        "Other",
      ];
      const songGenre = allowedGenres.includes(genre) ? genre : "Other";
      song.genre = songGenre;
    }

    await song.save();

    res.status(200).json({ message: "Song updated successfully", song });
  } catch (err) {
    console.error("Error in updateSong:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


export const deleteSong=async(req,res)=>{
  try{
    if(req.role!=='majorAdmin' && req.role!=='admin'){
      return res.status(403).json({ message: "Forbidden: Only major admins can delete songs" });
    }

    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    await song.deleteOne();

    res.status(200).json({ message: "Song deleted successfully" });
  }catch(err){
    console.error("Error in deleteSong:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}


export const allUsers=async(req,res)=>{
  try{
    const users = await User.find();
    res.status(200).json({ message: "Users fetched successfully", users });
  }catch(err){
    console.error("Error in allUsers:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}