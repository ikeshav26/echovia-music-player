import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Music, ArrowLeft, Plus } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";
import appContext from '../context/AppContext';

const AddToAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingToAlbum, setAddingToAlbum] = useState(null);

  const { id } = useParams(); 
  const { navigate } = useContext(appContext);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/albums/all-albums`, { withCredentials: true });
      setAlbums(res.data.albums || res.data || []);
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error fetching albums");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleAddToAlbum = async (albumId) => {
    try {
      setAddingToAlbum(albumId);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/albums/add-song-to-album`, {
        albumId,
        songId: id
      }, { withCredentials: true });
      toast.success("Song added to album successfully!");
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding song to album");
    } finally {
      setAddingToAlbum(null);
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
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Add to Album</h1>
                <p className="text-sm md:text-base text-gray-400">Choose an album to add this song</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <Music className="w-5 h-5" />
                Your Albums ({albums.length})
              </h2>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400">Loading albums...</p>
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No albums found</p>
                <p className="text-sm text-gray-500 mt-1">Create an album first to add songs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {albums.map((album) => (
                  <div
                    key={album._id}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center gap-4"
                    onClick={() => handleAddToAlbum(album._id)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      {album.thumbnailUrl ? (
                        <img src={album.thumbnailUrl} alt={album.name} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-6 h-6 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">
                        {album.name || 'Unnamed Album'}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {album.songs?.length || 0} songs
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        disabled={addingToAlbum === album._id}
                        className={`py-2 px-4 rounded-lg transition-all cursor-pointer duration-300 flex items-center gap-2 text-sm font-semibold ${
                          addingToAlbum === album._id
                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                      >
                        {addingToAlbum === album._id ? (
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

export default AddToAlbum