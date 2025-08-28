import Album from "../models/album.model.js";
import {cloudinary} from '../config/cloudinary.js'


export const createAlbum=async(req,res)=>{
    try{
        
        const {name,thumbnailUrl,artist}=req.body;

        const cloudResponseThumbnail = await cloudinary.v2.uploader.upload(thumbnailUrl, {
              resource_type: 'auto',
              folder: 'echovia_songs',
              public_id: name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') + '_thumbnail',
            });

        const newAlbum=new Album({
            name,
           thumbnailUrl:cloudResponseThumbnail.secure_url,
           artist,
            songs:[]
        })
        await newAlbum.save();

        res.status(201).json({ message: 'Album created successfully', album:newAlbum })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const addSongToAlbum=async(req,res)=>{
    try{
        const {albumId,songId}=req.body;

        const album=await Album.findById(albumId);
        if(!album){
            return res.status(404).json({ message: 'Album not found' });
        }

        const existingSong = album.songs.find(song => song._id.toString() === songId);
        if(existingSong){
            return res.status(400).json({ message: 'Song already exists in album' });
        }
        album.songs.push(songId);
        await album.save();
        res.status(200).json({ message: 'Song added to album successfully', album });
    }catch(err){
        res.status(500).json({ message: err.message })
    }   
}


export const deleteSongFromAlbum=async(req,res)=>{
  try{
    const {albumId,songId}=req.params;

    const album=await Album.findById(albumId);
    if(!album){
      return res.status(404).json({ message: 'Album not found' });
    }

    await album.songs.pull(songId);
    await album.save();

    res.status(200).json({ message: 'Song removed from album successfully', album });
  }catch(err){
    console.error('Error in deleteSong:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export const deleteAlbum=async(req,res)=>{
    try{
        const {albumId}=req.params;

        const album=await Album.findByIdAndDelete(albumId);
        if(!album){
            return res.status(404).json({ message: 'Album not found' });
        }
        res.status(200).json({ message: 'Album deleted successfully' });
    }catch(err){
        res.status(500).json({ message: err.message })  
        console.error('Error in deleteAlbum:', err);
    }
}


export const fetchAllAlbums=async(req,res)=>{
    try{
        const albums=await Album.find().sort({_id:-1});
        res.status(200).json(albums);
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const fetchSongsInAlbum=async(req,res)=>{
    try{
        const {albumId}=req.params;

        const album=await Album.findById(albumId).populate('songs');
        if(!album){
            return res.status(404).json({ message: 'Album not found' });
        }
        res.status(200).json({ songs: album.songs });
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const fetchAlbumDetailsById=async(req,res)=>{
    try{
        const {albumId}=req.params;

        const album=await Album.findById(albumId);
        if(!album){
            return res.status(404).json({ message: 'Album not found' });
        }
        res.status(200).json({ album });
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}