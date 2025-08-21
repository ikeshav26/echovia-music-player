import React from "react";
import { Plus, ListMusic, LayoutDashboard, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import appContext from "../context/AppContext";

const Sidebar = () => {
  const { user, isMobileSidebarOpen, closeMobileSidebar } = useContext(appContext);

  return (
    <>
      <div className="hidden lg:flex fixed top-20 left-2 h-[calc(100vh-10.5rem)] w-20 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl flex-col items-center py-6 gap-6 shadow-2xl z-40">
        <Link to="/create-playlist">
          <button className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-white/5 hover:bg-white/8 transition-all duration-300 hover:scale-105">
            <Plus className="text-white w-5 h-5" />
          </button>
        </Link>

        <Link to="/my-playlists">
          <button className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-white/5 hover:bg-white/8 transition-all duration-300 hover:scale-105">
            <ListMusic className="text-white w-5 h-5" />
          </button>
        </Link>

        {user && user.role === "admin" && (
          <Link to="/admin-dashboard">
            <button className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-white/5 hover:bg-white/8 transition-all duration-300 hover:scale-105">
              <LayoutDashboard className="text-white w-5 h-5" />
            </button>
          </Link>
        )}

        {user && user.role === "majorAdmin" && (
          <Link to="/admin-dashboard">
            <button className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-white/5 hover:bg-white/8 transition-all duration-300 hover:scale-105">
              <LayoutDashboard className="text-white w-5 h-5" />
            </button>
          </Link>
        )}

        {user && user.role === "user" && (
          <Link to="/user-dashboard">
            <button className="w-12 h-12 flex cursor-pointer items-center justify-center rounded-full bg-white/5 hover:bg-white/8 transition-all duration-300 hover:scale-105">
              <LayoutDashboard className="text-white w-5 h-5" />
            </button>
          </Link>
        )}
      </div>

      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-100">
         
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          ></div>
          
         
          <div className={`fixed top-0  left-0 h-full w-72 bg-black/90 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            
           
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">ECHOVIA</h2>
              <button 
                onClick={closeMobileSidebar}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="text-white w-5 h-5" />
              </button>
            </div>

            
            <div className="p-6 space-y-4">
              <Link to="/create-playlist" onClick={closeMobileSidebar}>
                <button className="w-full  flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <Plus className="text-white w-6 h-6" />
                  <span className="text-white font-medium">Create Playlist</span>
                </button>
              </Link>

              <Link to="/my-playlists" onClick={closeMobileSidebar}>
                <button className="w-full mt-4 flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <ListMusic className="text-white w-6 h-6" />
                  <span className="text-white font-medium">My Playlists</span>
                </button>
              </Link>

              {user && (user.role === "admin" || user.role === "majorAdmin") && (
                <Link to="/admin-dashboard" onClick={closeMobileSidebar}>
                  <button className="w-full mt-4 flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <LayoutDashboard className="text-white w-6 h-6" />
                    <span className="text-white font-medium">Admin Dashboard</span>
                  </button>
                </Link>
              )}

              {user && user.role === "user" && (
                <Link to="/user-dashboard" onClick={closeMobileSidebar}>
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <LayoutDashboard className="text-white w-6 h-6" />
                    <span className="text-white font-medium">Dashboard</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;