import Song from '../models/song.model.js';
import axios from 'axios';
import { cloudinary } from '../config/cloudinary.js';



export const addSong = async (req, res) => {
  let tempFilePath = null;

  try {
    const role = req.role;
    if (role !== 'admin' && role !== 'majorAdmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { videoId, artist, genre, thumbnailUrl } = req.body;
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const allowedGenres = [
      'Hindi',
      'Punjabi',
      'English',
      'Tamil',
      'Telugu',
      'Bhojpuri',
      'Instrumental',
      'Hip-Hop(Rap)',
      'Romantic',
      'Party(Dance)',
      'Classical(Devotional)',
      'Other'
    ];
    const songGenre = allowedGenres.includes(genre) ? genre : 'Other';

    console.log("got data from frontend");

   
    let cleanVideoId = videoId;
    if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
      const urlParams = new URLSearchParams(new URL(videoId).search);
      cleanVideoId = urlParams.get('v') || videoId.split('/').pop().split('?')[0];
    }

    console.log("Cleaned video ID:", cleanVideoId);

   
    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: cleanVideoId },
      headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': process.env.API_HOST
      }
    };

    const apiResponse = await axios.request(options);

    console.log("converter response ", apiResponse.data);

    
    if (apiResponse.data.status === 'fail' || apiResponse.data.code === 403) {
      return res.status(400).json({
        message: 'Failed to convert video',
        error: apiResponse.data.msg || apiResponse.data.error,
        details: 'Check if the video ID is correct and the video is available'
      });
    }

    const downloadUrl = apiResponse.data?.link;
    const title = apiResponse.data?.title || 'song';

    if (!downloadUrl) {
      return res.status(400).json({ message: 'Failed to get download URL from API' });
    }

    console.log("Download URL:", downloadUrl);

   
    console.log("Upload thumbnail to cloudinary...")
    
   
    try {
      console.log("Testing Cloudinary configuration...");
      console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
      console.log("API key:", process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
      console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
    } catch (configError) {
      console.error("Cloudinary config issue:", configError);
    }
    
    const cloudResponseThumbnail = await cloudinary.v2.uploader.upload(thumbnailUrl, {
      resource_type: 'auto',
      folder: 'echovia_songs',
      public_id: title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') + '_thumbnail',
    });

   
   
    console.log("Attempting to upload audio to Cloudinary...");
    
    
    let finalStreamUrl = downloadUrl; 
    
    try {
      console.log("Downloading audio with proper headers for Cloudinary upload...");
      
    
      const audioResponse = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 45000, 
        maxContentLength: 15 * 1024 * 1024, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'audio/mpeg,audio/*,*/*',
          'Accept-Encoding': 'identity', 
          'Connection': 'keep-alive',
        },
      });

      console.log(`Downloaded ${(audioResponse.data.byteLength / 1024 / 1024).toFixed(2)} MB audio file`);

    
      const audioBuffer = Buffer.from(audioResponse.data);
      const base64Audio = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
      
      console.log("Audio downloaded, uploading to Cloudinary...");

    
      const cloudResponse = await cloudinary.v2.uploader.upload(base64Audio, {
        resource_type: 'video',
        folder: 'echovia_songs',
        public_id: title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_'),
        timeout: 60000, 
        transformation: [
          { quality: 'auto:good' },
          { format: 'mp3' }
        ]
      });

      finalStreamUrl = cloudResponse.secure_url;
      console.log("Audio uploaded to Cloudinary successfully");
      
    } catch (uploadError) {
      console.warn("Cloudinary upload failed:", uploadError.message);
      console.warn("Error details:", {
        code: uploadError.code,
        status: uploadError.response?.status,
        statusText: uploadError.response?.statusText
      });
      console.log("Using direct download URL as fallback");
     
    }    const newSong = new Song({
      title,
      streamUrl: finalStreamUrl,
      duration: apiResponse.data?.duration,
      artist: artist || 'Unknown Artist',
      genre: songGenre || 'Unknown Genre',
      thumbnailUrl: cloudResponseThumbnail.secure_url
    });

    await newSong.save();

   
    console.log("Song saved with streamUrl type:", finalStreamUrl.includes('cloudinary') ? 'Cloudinary' : 'Direct');
    console.log("Final streamUrl:", finalStreamUrl.substring(0, 100) + '...');

    res.json({
      message: 'Song added successfully',
      song: newSong,
      uploadType: finalStreamUrl.includes('cloudinary') ? 'cloudinary' : 'direct' 
    });
  } catch (err) {
    console.error('Error in addSong:', err);

    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }

  
    if (err.response) {
     
      if (err.response.status === 404) {
        return res.status(400).json({
          message: 'Audio file not found or URL expired',
          error: 'The download URL may have expired or the audio file is no longer available'
        });
      } else if (err.response.status === 403) {
        return res.status(400).json({
          message: 'Access denied to audio file',
          error: 'Permission denied to access the audio file'
        });
      }
    }

  
    if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      return res.status(500).json({
        message: 'Upload timeout - please try again with a shorter song',
        error: 'Request timed out during audio processing'
      });
    } else if (err.code === 'ENOTFOUND' || err.message.includes('ENOTFOUND')) {
      return res.status(500).json({
        message: 'Network error - please check your connection',
        error: 'Failed to connect to audio source'
      });
    } else if (err.message.includes('Cloudinary') || err.name === 'CloudinaryError') {
      return res.status(500).json({
        message: 'Media upload failed - please try again',
        error: 'Failed to upload media to cloud storage'
      });
    } else if (err.code === 'EMSGSIZE' || err.message.includes('maxContentLength')) {
      return res.status(400).json({
        message: 'Audio file too large',
        error: 'Please try with a shorter audio file (under 20MB)'
      });
    }

    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


export const getAllSongs=async(req,res)=>{
  try{
    const songs=await Song.find().sort({_id:-1});
    res.status(200).json({
      message: 'Songs retrieved successfully',
      songs
    }); 
  }catch(err){
    console.error('Error in getAllSongs:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


export const fetchSongbyId=async(req,res)=>{
  try{
    const {id}=req.params;
    const song=await Song.findById(id);
    if(!song){
      return res.status(404).json({
        message: 'Song not found'
      });
    }
    res.status(200).json({
      message: 'Song retrieved successfully',
      song
    });
  }catch(err){
    console.error('Error in fetchSongbyId:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}