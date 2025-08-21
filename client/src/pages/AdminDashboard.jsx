import React, { useState } from 'react'
import { Settings, Users, Music, Database, Plus } from "lucide-react";
import AddSong from '../components/AddSong'
import ChangeRole from '../components/ChangeRole'
import AllSongs from '../components/AllSongs'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('add-song');

  const tabs = [
     { id: 'add-song', label: 'Add Song', icon: Plus },
    { id: 'change-role', label: 'Change Role', icon: Users },
    { id: 'all-songs', label: 'Songs', icon: Database }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'change-role':
        return <ChangeRole />;
      case 'add-song':
        return <AddSong />;
      case 'all-songs':
        return <AllSongs />;
      default:
        return <ChangeRole />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mr-2 lg:ml-24 lg:mr-96 pt-20 px-2 md:px-6 h-screen">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-8 relative z-0 h-[calc(100vh-13rem)] lg:h-[calc(100vh-10.5rem)] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Settings className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-gray-400">Manage users, songs, and platform settings</p>
              </div>
            </div>
          </div>

         
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex cursor-pointer items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
