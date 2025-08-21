import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Music, Plus, ArrowLeft, Check } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";
import appContext from '../context/AppContext';

const AddToPlaylist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);

  const { id } = useParams(); 
  const { navigate } = useContext(appContext);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/playlists/fetch`, { withCredentials: true });
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error fetching playlists");
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const handleAddToPlaylist = async (playlistId) => {
    try {
      setAddingToPlaylist(playlistId);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/playlists/add-song`, {
        playlistId,
        songId: id
      }, { withCredentials: true });
      
      toast.success("Song added to playlist successfully!");
      
     
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding song to playlist");
    } finally {
      setAddingToPlaylist(null);
    }
  }

  const goBack = () => {
    navigate('/');
  }

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
                <Plus className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Add to Playlist</h1>
                <p className="text-sm md:text-base text-gray-400">Choose a playlist to add this song</p>
              </div>
            </div>
          </div>

        
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <Music className="w-5 h-5" />
                Your Playlists ({playlists.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400">Loading playlists...</p>
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No playlists found</p>
                <p className="text-sm text-gray-500 mt-1">Create a playlist first to add songs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {playlists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center gap-4"
                    onClick={() => handleAddToPlaylist(playlist._id)}
                  >
                  
                    <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-white/60" />
                    </div>
                    
                  
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">
                        {playlist.name || 'Unnamed Playlist'}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {playlist.songs?.length || 0} songs
                      </p>
                    </div>

                  
                    <div className="flex-shrink-0">
                      <button
                        disabled={addingToPlaylist === playlist._id}
                        className={`py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold ${
                          addingToPlaylist === playlist._id
                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                      >
                        {addingToPlaylist === playlist._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400/20 border-t-gray-400 rounded-full animate-spin"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddToPlaylist