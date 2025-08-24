import React, { useState } from 'react'
import { Plus, Music, Link, Image } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const AddSong = () => {
  const [formData, setFormData] = useState({
    songUrl: '',
    artist: '',
    genre: 'Hindi',
    thumbnailUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const genres = [
    'Hindi',
    'Punjabi', 
    'English',
    'Tamil',
    'Telugu',
    'Bhojpuri',
    'Instrumental',
    'Hip-Hop(Rap)',
    'Romantic',
    'Party(Dance)',
    'Classical(Devotional)',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.songUrl.trim()) {
      toast.error('Song URL is required');
      return;
    }

    if (!formData.artist.trim()) {
      toast.error('Artist name is required');
      return;
    }

    if (!formData.thumbnailUrl.trim()) {
      toast.error('Thumbnail URL is required');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        videoId: formData.songUrl,
        artist: formData.artist,
        genre: formData.genre,
        thumbnailUrl: formData.thumbnailUrl
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/songs/add`, payload, {
        withCredentials: true
      });
      console.log(res.data);
      console.log('Payload to send:', payload);
      
      toast.success('Song added successfully!');
      
    
      setFormData({
        songUrl: '',
        artist: '',
        genre: 'Hindi',
        thumbnailUrl: ''
      });

    } catch (error) {
      console.error('Error adding song:', error);
      toast.error('Failed to add song. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Song to Echovia
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song URL
            </label>
            <div className="relative">
              <input
                type="url"
                name="songUrl"
                value={formData.songUrl}
                onChange={handleInputChange}
                placeholder="Enter YouTube song URL"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                required
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
                    e.target.src = '';
                    e.target.style.display = 'none';
                   
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-red-400 text-xs mt-1';
                    errorDiv.textContent = 'Failed to load image';
                    e.target.parentNode.appendChild(errorDiv);
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                    // Remove any error message
                    const errorDiv = e.target.parentNode.querySelector('.text-red-400');
                    if (errorDiv) errorDiv.remove();
                  }}
                />
              </div>
            )}
          </div>

        
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Adding Song...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 cursor-pointer" />
                Add Song
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddSong