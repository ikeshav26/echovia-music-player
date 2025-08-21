import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { Edit3, Music, Link, Image, ArrowLeft, Save } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";
import appContext from '../context/AppContext';

const UpdateSong = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: 'Hindi',
    thumbnailUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id: songId } = useParams();
  const { navigate } = useContext(appContext);

  const genres = [
    'Hindi',
    'Punjabi', 
    'English',
    'Tamil',
    'Telugu',
    'Bhojpuri',
    'Instrumental',
    'Hip-Hop/Rap',
    'Romantic',
    'Party/Dance',
    'Classical/Devotional',
    'Other'
  ];


  useEffect(() => {
    const fetchSongData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/songs/${songId}`, {
          withCredentials: true
        });
        
        const songData = res.data.song || res.data;
        setFormData({
          title: songData.title || '',
          artist: songData.artist || '',
          genre: songData.genre || 'Hindi',
          thumbnailUrl: songData.thumbnailUrl || ''
        });
        
      } catch (err) {
        console.error("Error fetching song:", err);
        toast.error('Error loading song data');
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchSongData();
    }
  }, [songId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSongUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.artist.trim()) {
      toast.error('Title and Artist are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admins/update-song/${songId}`, 
        formData, 
        { withCredentials: true }
      );
      
      console.log("Song updated successfully:", res.data);
      toast.success('Song updated successfully');
      
     
      navigate('/admin-dashboard');
      
    } catch (err) {
      console.error("Error updating song:", err);
      toast.error(err.response?.data?.message || 'Error updating song');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading song data...</p>
        </div>
      </div>
    );
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
                <Edit3 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Update Song</h1>
                <p className="text-sm md:text-base text-gray-400">Modify song information and details</p>
              </div>
            </div>
          </div>

        
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6 mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Song Details
            </h2>
            
            <form onSubmit={handleSongUpdate} className="space-y-4">

            
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Song Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter song title"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                    required
                  />
                  <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artist Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                    required
                  />
                  <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre} className="bg-black">
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    placeholder="Enter thumbnail image URL"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {formData.thumbnailUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-white/20"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

            
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border border-white/20 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Song
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateSong