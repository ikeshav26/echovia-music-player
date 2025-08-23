import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Music, Play, Pause, Trash2, ArrowLeft, Plus, Clock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from 'react';
import appContext from '../context/AppContext';

const SongsInPlaylist = () => {
  const [songs, setsongs] = useState([])
  const [playlistInfo, setPlaylistInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const {id} = useParams();
  const {navigate, playSong, pauseSong, currentSong, isPlaying, setPlaylist, setCurrentSong, setCurrentSongIndex, setCurrentTime} = useContext(appContext);

  useEffect(() => {
    const fetchSongs=async()=>{
      try{
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/playlists/${id}/songs`, { withCredentials: true });
        const fetchedSongs = res.data.songs || [];
        const playlistData = res.data.playlist || null;
        
        setsongs(fetchedSongs);
        setPlaylistInfo(playlistData);
        
        
        if (fetchedSongs.length > 0) {
          localStorage.setItem('currentPlaylistSongs', JSON.stringify(fetchedSongs));
          localStorage.setItem('currentPlaylistInfo', JSON.stringify(playlistData));
        }
        
        console.log("Fetched songs:", fetchedSongs);
      }catch(err){
        console.error(err)
        toast.error(err.response?.data?.message || "Error fetching songs");
        setsongs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSongs()
  }, [id])

  const removeSong=async(songId, index)=>{
    try{
      const res=await axios.delete(`${import.meta.env.VITE_API_URL}/playlists/remove-song/${id}/${songId}`, { withCredentials: true });
      if (res.status === 200) {
        const updatedSongs = songs.filter((_, i) => i !== index);
        setsongs(updatedSongs);
        
       
        localStorage.setItem('currentPlaylistSongs', JSON.stringify(updatedSongs));
        
        toast.success("Song removed from playlist");
      }
      console.log("Song removed:", res.data);
    }catch(err){
      console.error(err)
      toast.error(err.response?.data?.message || "Error removing song");
    }
  }

  const playPlaylist = () => {
    if (!songs || songs.length === 0) {
      toast.error("This playlist is empty");
      return;
    }

  
    setPlaylist(songs);
    playSong(songs[0]);
    setCurrentSong(songs[0]);
    setCurrentSongIndex(0);
    setCurrentTime(0);
    
   
    localStorage.setItem('currentPlaylist', JSON.stringify(songs));
    localStorage.setItem('currentPlaylistName', playlistInfo?.name || 'Unnamed Playlist');
    localStorage.setItem('currentSongIndex', '0');
    
    toast.success(`Now playing: ${playlistInfo?.name || 'Playlist'}`);
  };

  const goBack = () => {
    navigate('/my-playlists');
  }

  const handlePlayPause = (song, index) => {
    if (currentSong && currentSong._id === song._id && isPlaying) {
      pauseSong();
    } else {
      setPlaylist(songs);
      setCurrentSong(song);
      playSong(song);
      setCurrentSongIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
     
      <div className="mr-2 lg:ml-24 lg:mr-96 pt-20 px-2 md:px-6 h-screen">
        
        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-8 relative z-0 h-[calc(100vh-13rem)] lg:h-[calc(100vh-10.5rem)] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          
       
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-4 mb-4">
             
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={goBack}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 md:mb-2 truncate">
                    {playlistInfo?.name || "Playlist Songs"}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400">
                    {songs.length} {songs.length === 1 ? 'song' : 'songs'} • Created {playlistInfo?.createdAt ? new Date(playlistInfo.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
              
             
              {songs.length > 0 && (
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={playPlaylist}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base font-semibold shadow-lg"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Play Playlist</span>
                    <span className="xs:hidden">Play</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-400 border-b border-white/10 pb-2">
              <div className="w-8 text-center">#</div>
              <div className="w-10 h-10"></div>
              <div className="flex-1">Title</div>
              <div className="hidden md:block w-32">Duration</div>
              <div className="w-16">Actions</div>
            </div>

            {!Array.isArray(songs) || songs.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-300">No songs in this playlist</h3>
                <p className="text-sm md:text-base text-gray-400">Add some songs to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {songs.map((song, index) => {
                 
                  const uniqueKey = song._id || song.id || `${song.title}-${song.artist}-${index}`;
                  
                  return (
                  <div
                    key={`song-${uniqueKey}-${index}`}
                    className="group flex items-center gap-4 p-2 md:p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="w-8 text-sm text-gray-400 text-center">
                      {index + 1}
                    </div>
                    
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      {song.thumbnailUrl ? (
                        <img src={song.thumbnailUrl} alt={song.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 truncate text-sm md:text-base">
                        {song.title || song.name || "Unknown Title"}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 truncate">
                        {song.artist || song.channel || "Unknown Artist"}
                      </p>
                    </div>
                    
                    <div className="hidden md:flex items-center w-32 text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                     {`${Math.floor(song.duration / 60)} min`}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePlayPause(song, index)}
                        className="opacity-100 p-1 md:p-2 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                      >
                        {currentSong && currentSong._id === song._id && isPlaying ? (
                          <Pause className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                        ) : (
                          <Play className="w-3 cursor-pointer h-3 md:w-4 md:h-4 text-green-400" />
                        )}
                      </button>
                      <button
                        onClick={() => removeSong(song._id, index)}
                        className="opacity-100 p-1 md:p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        title="Remove from Playlist"
                      >
                        <Trash2 className="w-3 cursor-pointer h-3 md:w-4 md:h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

        
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  )
}

export default SongsInPlaylist
