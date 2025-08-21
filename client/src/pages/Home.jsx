import React from 'react'
import { Music, TrendingUp } from "lucide-react";
import AllGenres from '../components/AllGenres'
import Song from '../components/Song';
import { useEffect } from 'react';
import axios from 'axios';

const Home = () => {


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
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Welcome to Echovia</h1>
                <p className="text-sm md:text-base text-gray-400">Discover and enjoy your favorite music</p>
              </div>
            </div>
          </div>

         
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Browse by Genre
              </h2>
            </div>
            <AllGenres />
           
          </div>
           <Song/>
        </div>
      </div>
    </div>
  )
}

export default Home
