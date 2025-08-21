import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join("/tmp", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/m4a",
    "audio/flac",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio/video files allowed"), false);
  }
};

export const songUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const downloadAndSave = async (downloadUrl, title) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting download from URL:", downloadUrl);

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const sanitizedTitle = title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_");
      const timestamp = Date.now();
      const filename = `${timestamp}-${sanitizedTitle}.mp3`;
      const tempFilePath = path.join(uploadsDir, filename);

      console.log("starting fetch");

      const response = await axios.get(downloadUrl, {
        responseType: "stream",
        timeout: 60000,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "*/*",
          Referer: "https://zeta.123tokyo.xyz/",
          Origin: "https://zeta.123tokyo.xyz",
        },
      });
      const writer = fs.createWriteStream(tempFilePath);

      writer.on("error", (error) => {
        console.error("Write stream error:", error);
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        reject(error);
      });

      writer.on("finish", () => {
        console.log("File downloaded successfully:", tempFilePath);
        resolve({
          filePath: tempFilePath,
          filename: filename,
          originalTitle: title,
          size: fs.statSync(tempFilePath).size,
        });
      });

      response.data.on("error", (error) => {
        console.error("Download stream error:", error);
        writer.destroy();
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        reject(error);
      });

      response.data.pipe(writer);
    } catch (error) {
      console.error("Download error:", error.message || error);
      reject(error);
    }
  });
};

export const cleanupTempFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Temporary file deleted:", filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting temporary file:", error);
    return false;
  }
};

export const getFileInfo = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        exists: true,
      };
    }
    return { exists: false };
  } catch (error) {
    console.error("Error getting file info:", error);
    return { exists: false, error: error.message };
  }
};

export const cleanupOldFiles = (maxAgeHours = 24) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.birthtime.getTime();

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        console.log("Cleaned up old file:", file);
      }
    });
  } catch (error) {
    console.error("Error cleaning up old files:", error);
  }
};

export default {
  songUpload,
  downloadAndSave,
  cleanupTempFile,
  getFileInfo,
  cleanupOldFiles,
};
