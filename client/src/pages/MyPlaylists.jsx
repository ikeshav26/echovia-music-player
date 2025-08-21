import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Music, Eye, Trash2, Play } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from 'react';
import appContext from '../context/AppContext';
import SongData from '../components/SongData';

const MyPlaylists = () => {
  const [playlists, setplaylists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingPlaylistId, setDeletingPlaylistId] = useState(null)
  const {navigate}=useContext(appContext)

  const fetchPlaylists=async()=>{
    setIsLoading(true);
    try{
      const res=await axios.get(`${import.meta.env.VITE_API_URL}/playlists/fetch`, { withCredentials: true });
      const playlistData = res.data.playlists || [];
      setplaylists(playlistData);
    }catch(err){
        console.error(err)
        toast.error(err.response?.data?.message || "Error fetching playlists");
        setplaylists([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const viewPlaylistSongs = (playlistId) => {
    navigate(`/songs-in-playlist/${playlistId}`);
  };

  const deletePlaylist = async (playlistId, index) => {
    setDeletingPlaylistId(playlistId);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/playlists/delete/${playlistId}`, 
        { withCredentials: true });
      if (res.status === 200) {
        setplaylists(playlists.filter((_, i) => i !== index));
        toast.success("Playlist deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting playlist");
      console.error("Error deleting playlist:", error);
    } finally {
      setDeletingPlaylistId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
     
      <div className="mr-2 lg:ml-24 lg:mr-96 pt-20 px-2 md:px-6 h-screen">
        
       
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-8 relative z-0 h-[calc(100vh-13rem)] lg:h-[calc(100vh-10.5rem)] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          
          
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">My Playlists</h1>
                <p className="text-sm md:text-base text-gray-400">Browse and manage your music collections</p>
              </div>
            </div>
          </div>

          
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">All Playlists ({Array.isArray(playlists) ? playlists.length : 0})</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 md:p-4 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg"></div>
                      <div className="w-6 h-6 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-white/10 rounded mb-3 w-1/2"></div>
                    <div className="h-8 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : !Array.isArray(playlists) || playlists.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-300">No playlists found</h3>
                <p className="text-sm md:text-base text-gray-400">Create your first playlist to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Array.isArray(playlists) && playlists.map((playlist, index) => (
                  <div
                    key={playlist._id || index}
                    className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-3 md:p-4 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => deletePlaylist(playlist._id, index)}
                          disabled={deletingPlaylistId === playlist._id}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Playlist"
                        >
                          {deletingPlaylistId === playlist._id ? (
                            <div className="w-3 h-3 md:w-4 md:h-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-3 cursor-pointer h-3 md:w-4 md:h-4 text-red-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1 truncate text-sm md:text-base">{playlist.name}</h3>
                    <p className="text-xs md:text-sm text-gray-400 mb-2">{playlist.songs?.length || 0} songs</p>
                    <p className="text-xs text-gray-500 mb-3">Created {new Date(playlist.createdAt).toLocaleDateString()}</p>
                    
                  
                    <button
                      onClick={() => viewPlaylistSongs(playlist._id)}
                      className="w-full cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-xs md:text-sm"
                    >
                      <Play className="w-3 h-3 md:w-4 md:h-4" />
                      View Songs
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-8"></div>
        </div>
      </div>
    </div>
  )
}

export default MyPlaylists
