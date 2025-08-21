import React, { useState } from "react";
import { Plus, Music, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import SongData from "../components/SongData";


const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (playlistName.trim() === "") return;
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/playlists/create`, {
        name: playlistName
      }, { withCredentials: true });
      if (res.status === 201) {
        setPlaylistName("");
        toast.success("Playlist created successfully");
        // Refetch playlists after successful creation
        fetchPlaylists();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating playlist");
      console.error("Error creating playlist:", error);
    }
  };

  const fetchPlaylists=async()=>{
    try{
      const res=await axios.get(`${import.meta.env.VITE_API_URL}/playlists/fetch`, { withCredentials: true });
      if (res.status === 200) {
        const playlistData = Array.isArray(res.data) ? res.data : res.data.playlists || [];
        setPlaylists(playlistData);
      }
    }catch(err){
      toast.error(err.response?.data?.message || "Error fetching playlists");
      console.error("Error fetching playlists:", err);
      setPlaylists([]);
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const deletePlaylist = async (playlistId, index) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/playlists/delete/${playlistId}`, 
        { withCredentials: true });
      if (res.status === 200) {
        setPlaylists(playlists.filter((_, i) => i !== index));
        toast.success("Playlist deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting playlist");
      console.error("Error deleting playlist:", error);
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
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Your Playlists</h1>
                <p className="text-sm md:text-base text-gray-400">Create and manage your music collections</p>
              </div>
            </div>
          </div>

          
          <div className="mb-6 md:mb-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Create New Playlist
              </h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-lg text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 cursor-pointer text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 hover:scale-105 border border-white/10 text-sm md:text-base whitespace-nowrap"
                >
                  Create
                </button>
              </form>
            </div>
          </div>

          
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Your Playlists ({Array.isArray(playlists) ? playlists.length : 0})</h2>
            
            {!Array.isArray(playlists) || playlists.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-300">No playlists yet</h3>
                <p className="text-sm md:text-base text-gray-400">Create your first playlist to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Array.isArray(playlists) && playlists.map((playlist, index) => (
                  <div
                    key={playlist._id || index}
                    className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-3 md:p-4 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <button
                        onClick={() => deletePlaylist(playlist._id, index)}
                        className="opacity-0 cursor-pointer group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1 truncate text-sm md:text-base">{playlist.name}</h3>
                    <p className="text-xs md:text-sm text-gray-400 mb-2">{playlist.songs?.length || 0} songs</p>
                    <p className="text-xs text-gray-500">Created {new Date(playlist.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

       
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;