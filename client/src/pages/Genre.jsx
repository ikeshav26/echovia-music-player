import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Music, Play, Pause, Plus, ArrowLeft } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";
import appContext from '../context/AppContext';

const Genre = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); 
  const { 
    playSong, 
    pauseSong, 
    currentSong, 
    isPlaying, 
    setPlaylist, 
    setCurrentSongIndex, 
    setCurrentTime,
    navigate
  } = useContext(appContext);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/playlists/genre/${id}`, { 
        withCredentials: true 
      });
      setSongs(res.data.songs || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching songs');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSongs();
  }, [id]);

  const handlePlayPause = (song, index) => {
    const isCurrentSong = currentSong && currentSong._id === song._id;
    
    if (isCurrentSong && isPlaying) {
      pauseSong();
    } else {
      setPlaylist(songs);
      playSong(song, index);
      setCurrentSongIndex(index);
      setCurrentTime(0);
      
      localStorage.setItem('currentPlaylist', JSON.stringify(songs));
      localStorage.setItem('currentSongIndex', index.toString());
      
      toast.success(`Now playing: ${song.title}`);
    }
  };

  const isSongPlaying = (song) => {
    return currentSong && currentSong._id === song._id && isPlaying;
  };

  const isSongCurrent = (song) => {
    return currentSong && currentSong._id === song._id;
  };

  const goBack = () => {
    navigate('/');
  };

  
  const genreName = decodeURIComponent(id);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mr-2 lg:ml-24 lg:mr-96 pt-20 px-2 md:px-6 h-screen">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-8 relative z-0 h-[calc(100vh-13rem)] lg:h-[calc(100vh-10.5rem)] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          
        
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <button
                onClick={goBack}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{genreName} Music</h1>
                <p className="text-sm md:text-base text-gray-400">Discover {genreName.toLowerCase()} songs</p>
              </div>
            </div>
          </div>

         
          <div className="  rounded-xl p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <Music className="w-5 h-5" />
                {genreName} Songs ({songs.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400">Loading songs...</p>
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">
                  No {genreName.toLowerCase()} songs available
                </p>
              </div>
            ) : (
              <div className="space-y-3">
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {songs.map((song, index) => (
                    <div
                      key={song._id || index}
                      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 w-full"
                    >
                     
                      <div className="relative w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        {song.thumbnailUrl ? (
                          <img 
                            src={song.thumbnailUrl} 
                            alt={song.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: song.thumbnailUrl ? 'none' : 'flex' }}
                        >
                          <Music className="w-6 h-6 text-white/60" />
                        </div>
                        
                      
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={() => handlePlayPause(song, index)}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            {isSongPlaying(song) ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white ml-0.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                   
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className="font-semibold text-white text-sm mb-1 truncate">
                          {song.title || 'Unknown Title'}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {song.artist || 'Unknown Artist'}
                        </p>
                      </div>

                     
                      <div className="flex-shrink-0 hidden sm:block">
                        <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                          {song.genre || 'Unknown'}
                        </span>
                      </div>

                     
                      <div className="flex-shrink-0 flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/add-to-playlist/${song._id}`)}
                          className="opacity-100 p-2 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                          title="Add to Playlist"
                        >
                          <Plus className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handlePlayPause(song, index)}
                          className={`${
                            isSongCurrent(song) ? 'opacity-100' : 'opacity-100'
                          } p-2 hover:bg-green-500/20 rounded-lg transition-all duration-200`}
                        >
                          {isSongPlaying(song) ? (
                            <Pause className="w-4 h-4 text-green-400" />
                          ) : (
                            <Play className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Genre
