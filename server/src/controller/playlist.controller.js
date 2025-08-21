import Playlist from '../models/playlist.model.js'
import Song from '../models/song.model.js';



export const createPlaylist=async(req,res)=>{
    try{
        const createdBy=req.user;
        const {name}=req.body;

        const newPlaylist=new Playlist({
            name,
            createdBy,
            songs:[]
        })
        await newPlaylist.save();

        res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const addSongToPlaylist=async(req,res)=>{
    try{
        const {playlistId,songId}=req.body;

        const playlist=await Playlist.findById(playlistId);
        if(!playlist){
            return res.status(404).json({ message: 'Playlist not found' });
        }
        playlist.songs.push(songId);
        await playlist.save();
        res.status(200).json({ message: 'Song added to playlist successfully', playlist });
    }catch(err){
        res.status(500).json({ message: err.message })
    }   
}


export const fetchUsersPlaylists=async(req,res)=>{
    try{
        const userId=req.user;
        const playlists=await Playlist.find({ createdBy: userId });
        res.status(200).json({ playlists });
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const fetchSongsInPlaylist=async(req,res)=>{
    try{
        const {playlistId}=req.params;

        const playlist=await Playlist.findById(playlistId).populate('songs');
        if(!playlist){
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ songs: playlist.songs });
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const deletePlaylist=async(req,res)=>{
    try{
        const {playlistId}=req.params;

        const playlist=await Playlist.findByIdAndDelete(playlistId);
        if(!playlist){
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: 'Playlist deleted successfully' });
    }catch(err){
        res.status(500).json({ message: err.message })  
        console.error('Error in deletePlaylist:', err);
    }
}


export const deleteSong=async(req,res)=>{
  try{
    const {playlistId,songId}=req.params;

    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await playlist.songs.pull(songId);
    await playlist.save();

    res.status(200).json({ message: 'Song removed from playlist successfully', playlist });
  }catch(err){
    console.error('Error in deleteSong:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}


export const fetchGenreSongs=async(req,res)=>{
    try{
        const {id}=req.params;

        const songs=await Song.find({ genre :id});
        res.status(200).json({ songs });
    }catch(err){
        console.error('Error in fetchGenreSongs:', err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
}