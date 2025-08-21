import React, { useContext } from 'react'
import { User, Music, ListMusic, Plus } from "lucide-react";
import appContext from '../context/AppContext';

const UserDashboard = () => {
  const { user, navigate } = useContext(appContext);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mr-2 lg:ml-24 lg:mr-96 pt-20 px-2 md:px-6 h-screen">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-8 relative z-0 h-[calc(100vh-13rem)] lg:h-[calc(100vh-10.5rem)] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">User Dashboard</h1>
                <p className="text-sm md:text-base text-gray-400">Welcome , {user?.username}!</p>
              </div>
            </div>
          </div>

        
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6 mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-400 w-20">Username:</span>
                <span className="text-white">{user?.username || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-400 w-20">Email:</span>
                <span className="text-white">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-400 w-20">Role:</span>
                <span className="text-white capitalize">{user?.role || 'N/A'}</span>
              </div>
            </div>
          </div>

        
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             
              <button
                onClick={() => navigate('/')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
              >
                <Music className="w-8 h-8" />
                <span className="font-semibold">Explore Music</span>
              </button>

             
              <button
                onClick={() => navigate('/my-playlists')}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
              >
                <ListMusic className="w-8 h-8" />
                <span className="font-semibold">Your Playlists</span>
              </button>

           
              <button
                onClick={() => navigate('/create-playlist')}
                className="bg-black hover:bg-gray-900 border border-gray-500 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
              >
                <Plus className="w-8 h-8" />
                <span className="font-semibold">Create Playlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
