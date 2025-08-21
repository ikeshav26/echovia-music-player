import React, { useEffect, useContext } from 'react'
import { Music, Edit, Trash2, Search } from "lucide-react";
import axios from 'axios'
import { useState } from 'react'
import toast from "react-hot-toast";
import appContext from '../context/AppContext';

const AllSongs = () => {
  const [songs, setsongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState(null)

  const { navigate } = useContext(appContext);

  const handleSongDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/admins/delete-song/${id}`, {withCredentials: true});
      console.log(res.data);
      toast.success('Song deleted successfully');
      fetchAllSongs();
    } catch (err) {
      console.error("Error deleting song:", err);
      toast.error(err.response?.data?.message || 'Error deleting song');
    } finally {
      setDeleting(null);
    }
  }

  const handleUpdateSong = (songId) => {
    navigate(`/update-song/${songId}`);
  }

  const fetchAllSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/songs/all-songs`, {withCredentials: true});
      setsongs(response.data.songs || []);
      console.log("Fetched songs:", response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error('Error fetching songs');
      setsongs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllSongs();
  }, [])

  const filteredSongs = songs.filter(song =>
    song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
     
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2">
          <Music className="w-5 h-5" />
          All Songs on Echovia
        </h2>
        <p className="text-sm text-gray-400">Manage all songs available on the platform</p>
      </div>

     
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Music className="w-4 h-4" />
              Total Songs: {filteredSongs.length}
            </h3>
          </div>
          
         
          <div className="relative max-w-xs w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search songs..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

     
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400">Loading songs...</p>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">
              {searchTerm ? 'No songs found matching your search' : 'No songs available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
           
            <div className="hidden lg:flex items-center gap-4 text-sm text-gray-400 border-b border-white/10 pb-3">
              <div className="w-12">#</div>
              <div className="w-16">Cover</div>
              <div className="flex-1 min-w-0">Title</div>
              <div className="w-32">Artist</div>
              <div className="w-24">Genre</div>
              <div className="w-32">Actions</div>
            </div>

           
            {filteredSongs.map((song, index) => (
              <div
                key={song._id || index}
                className="bg-white/5 hover:bg-white/10 rounded-lg p-3 md:p-4 transition-all duration-300 border border-white/10"
              >
            
                <div className="lg:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {song.thumbnailUrl ? (
                        <img 
                          src={song.thumbnailUrl} 
                          alt={song.title} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Music className="w-8 h-8 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-base mb-1 truncate">
                        {song.title || 'Unknown Title'}
                      </h4>
                      <p className="text-sm text-gray-400 truncate mb-1">
                        {song.artist || 'Unknown Artist'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{song.genre || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <button
                      onClick={() => handleUpdateSong(song._id)}
                      className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit className="w-3 h-3 cursor-pointer" />
                      <span className="hidden xs:inline">Update</span>
                      <span className="xs:hidden">Edit</span>
                    </button>
                    <button
                      onClick={() => handleSongDelete(song._id)}
                      disabled={deleting === song._id}
                      className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {deleting === song._id ? (
                        <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3 cursor-pointer" />
                      )}
                      <span className="hidden xs:inline">Delete</span>
                      <span className="xs:hidden">Del</span>
                    </button>
                  </div>
                </div>

              
                <div className="hidden lg:flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-400 text-center">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {song.thumbnailUrl ? (
                      <img 
                        src={song.thumbnailUrl} 
                        alt={song.title} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Music className="w-8 h-8 text-white/60" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {song.title || 'Unknown Title'}
                    </h4>
                  </div>
                  
                  <div className="w-32 text-gray-400 truncate">
                    {song.artist || 'Unknown Artist'}
                  </div>
                  
                  <div className="w-24 text-gray-400 text-sm">
                    {song.genre || 'Unknown'}
                  </div>
                  
                  <div className="w-32 flex gap-1">
                    <button
                      onClick={() => handleUpdateSong(song._id)}
                      className="flex-1 p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg transition-all duration-300 flex items-center justify-center"
                      title="Update Song"
                    >
                      <Edit className="w-4 h-4 cursor-pointer" />
                    </button>
                    <button
                      onClick={() => handleSongDelete(song._id)}
                      disabled={deleting === song._id}
                      className="flex-1 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                      title="Delete Song"
                    >
                      {deleting === song._id ? (
                        <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllSongs
