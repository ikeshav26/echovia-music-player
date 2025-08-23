import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Music, Plus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateAlbum = () => {
  const [name, setName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [artist, setArtist] = useState("");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return;
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/albums/create-album`,
        { name, thumbnailUrl, artist },
        { withCredentials: true }
      );
      if (res.status === 201 || res.data.success) {
        setName("");
        setThumbnailUrl("");
        setArtist("");
        toast.success("Album created successfully");
        fetchAlbums();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating album");
      console.error("Error creating album:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/albums/all-albums`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        const albumData = Array.isArray(res.data)
          ? res.data
          : res.data.albums || [];
        setAlbums(albumData);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching albums");
      console.error("Error fetching albums:", err);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const deleteAlbum = async (albumId, index) => {
    setDeletingId(albumId);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/albums/delete/${albumId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setAlbums(albums.filter((_, i) => i !== index));
        toast.success("Album deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting album");
      console.error("Error deleting album:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full h-full text-white">
      <div className="w-full h-full p-3 max-w-7xl mx-auto">
        <div className="rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 relative z-0 w-full h-full flex flex-col">
        
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Music className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 truncate">
                  Your Albums
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Create and manage your music albums
                </p>
              </div>
            </div>
          </div>

        
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Create New Album
              </h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:grid md:grid-cols-2 gap-3"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter album name..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Enter thumbnail URL..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 cursor-pointer text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 border border-white/10 text-sm md:text-base whitespace-nowrap md:col-span-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Album
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

     
          <div className="space-y-4 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
              Your Albums ({Array.isArray(albums) ? albums.length : 0})
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12 md:py-16">
                <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-white/60 animate-spin" />
              </div>
            ) : !Array.isArray(albums) || albums.length === 0 ? (
              <div className="text-center py-8 md:py-12 lg:py-16">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-300">
                  No albums yet
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  Create your first album to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6">
                {albums.map((album, index) => (
                  <div
                    key={album._id || index}
                    className="group bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 flex flex-col"
                  >
                  
                    <div className="relative w-full aspect-square rounded-t-lg sm:rounded-t-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      {album.thumbnailUrl ? (
                        <img
                          src={album.thumbnailUrl}
                          alt={album.name}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`${album.thumbnailUrl ? 'hidden' : 'flex'} items-center justify-center h-full absolute inset-0`}>
                        <Music className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/40" />
                      </div>
                      
                     
                      <button
                        onClick={() => deleteAlbum(album._id, index)}
                        disabled={deletingId === album._id}
                        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-100 p-1.5 sm:p-2  cursor-pointer  rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Delete album"
                      >
                        {deletingId === album._id ? (
                          <Loader2 className="w-4 h-4 sm:w-4 sm:h-4 text-white animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 sm:w-4 sm:h-4 " />
                        )}
                      </button>
                    </div>

                  
                    <div className="p-2.5 sm:p-3 md:p-3.5 flex-1 flex flex-col justify-between">
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <h3
                          className="font-semibold text-white mb-1 truncate text-xs sm:text-sm md:text-sm lg:text-base leading-tight"
                          title={album.name}
                        >
                          {album.name}
                        </h3>
                        <div className="space-y-0.5">
                          <p className="text-xs md:text-xs lg:text-sm text-gray-400">
                            {album.artist ? album.artist : 'Unknown Artist'}
                          </p>
                          <p className="text-xs md:text-xs lg:text-sm text-gray-400">
                            {album.songs?.length || 0} {album.songs?.length === 1 ? 'song' : 'songs'}
                          </p>
                          {album.createdAt && (
                            <p className="text-xs md:text-xs lg:text-sm text-gray-500">
                              {new Date(album.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/album/${album._id}`)}
                        className="w-full cursor-pointer bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-md sm:rounded-lg text-xs sm:text-xs md:text-sm font-medium transition-all duration-200 border border-white/10 hover:border-white/20"
                      >
                        View Album
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
  );
};

export default CreateAlbum;