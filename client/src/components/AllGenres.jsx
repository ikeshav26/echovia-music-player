import React, { useContext } from 'react'
import { Music, Headphones, ArrowRight } from "lucide-react";
import appContext from '../context/AppContext';

const AllGenres = () => {
  const { navigate } = useContext(appContext);

  const genres = [
    { 
      name: 'Hindi', 
      icon: '🎵', 
      color: 'from-red-500 to-pink-500',
      description: 'Bollywood & Indian Pop'
    },
    { 
      name: 'Punjabi', 
      icon: '🎶', 
      color: 'from-orange-500 to-red-500',
      description: 'Punjabi Hits & Folk'
    },
    { 
      name: 'English', 
      icon: '🎤', 
      color: 'from-blue-500 to-purple-500',
      description: 'International Pop & Rock'
    },
    { 
      name: 'Tamil', 
      icon: '🎸', 
      color: 'from-green-500 to-blue-500',
      description: 'Tamil Cinema & Folk'
    },
    { 
      name: 'Telugu', 
      icon: '🎹', 
      color: 'from-purple-500 to-pink-500',
      description: 'Telugu Movies & Music'
    },
    { 
      name: 'Bhojpuri', 
      icon: '🥁', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Traditional & Modern'
    },
    { 
      name: 'Instrumental', 
      icon: '🎻', 
      color: 'from-indigo-500 to-blue-500',
      description: 'Classical & Modern Instruments'
    },
    { 
      name: 'Hip-Hop/Rap', 
      icon: '🎧', 
      color: 'from-gray-600 to-gray-800',
      description: 'Hip-Hop, Rap & Urban'
    },
    { 
      name: 'Romantic', 
      icon: '💖', 
      color: 'from-pink-500 to-red-500',
      description: 'Love Songs & Ballads'
    },
    { 
      name: 'Party/Dance', 
      icon: '💃', 
      color: 'from-green-400 to-blue-500',
      description: 'Dance Hits & Party Music'
    },
    { 
      name: 'Classical/Devotional', 
      icon: '🙏', 
      color: 'from-amber-500 to-orange-500',
      description: 'Classical & Spiritual'
    },
    { 
      name: 'Other', 
      icon: '🎼', 
      color: 'from-slate-500 to-gray-600',
      description: 'Miscellaneous & Unique'
    }
  ];

  const handleGenreClick = (genreName) => {
    const encodedGenre = encodeURIComponent(genreName);
    navigate(`/genre/${encodedGenre}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {genres.map((genre, index) => (
          <button
            key={index}
            onClick={() => handleGenreClick(genre.name)}
            className="group cursor-pointer relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-3 md:p-4 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            
            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-10 group-hover:opacity-20 rounded-xl transition-opacity duration-300`}></div>
            
          
            <div className="relative">
           
              <div className="text-2xl md:text-3xl mb-2 text-center">
                {genre.icon}
              </div>
              
              <h3 className="text-xs md:text-sm font-semibold text-white text-center mb-1 truncate">
                {genre.name}
              </h3>
              
             
              <p className="hidden md:block text-xs text-gray-400 text-center truncate">
                {genre.description}
              </p>
              
             
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}

export default AllGenres