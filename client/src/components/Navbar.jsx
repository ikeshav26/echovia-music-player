import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Home, User, Settings, LogOut, Search, Menu } from "lucide-react";
import { useContext } from "react";
import appContext from "../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const {navigate,user,setuser,clearPlaylistData,toggleMobileSidebar}=useContext(appContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleBackNavigation=()=>{
    navigate(-1);
  }

  const handleForwardNavigation=()=>{
    navigate(1);
  }

  const handleLogout =async () => {
    setIsLoggingOut(true);
    try{
      const res=await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, { withCredentials: true });
      if(res.status===200 || res.status===201){
        setuser(null);
        localStorage.removeItem("user");
        clearPlaylistData(); 
        toast.success(res.data.message);
      }
    }catch(err){
      toast.error(err.response?.data?.message || "Error logging out");
      console.error("Error logging out:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length >= 1) {
      navigate(`/search/result?q=${encodeURIComponent(value.trim())}`);
    }
  };
  return (
    <div className="flex fixed top-0 left-0 w-full items-center justify-between px-3 md:px-6 py-3 bg-black text-white z-50">
      
     
      <div className="lg:hidden flex items-center">
        <button 
          onClick={toggleMobileSidebar}
          className="p-2 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-2 md:gap-3">
        <button onClick={handleBackNavigation} className="p-2 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <ChevronLeft size={18} className="md:w-5 md:h-5" />
        </button>
        <button onClick={handleForwardNavigation} className="p-2 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <ChevronRight size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

     
      <div className="flex items-center gap-3 md:gap-4 flex-1 justify-center max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Link to='/'>
          <button className="p-2 ml-2 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110">
            <Home size={18} className="md:w-5 md:h-5" />
          </button>
        </Link>
        
        <div className="relative group flex-1">
          <input
            type="text"
            placeholder="Search music..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="w-full px-4 py-2 md:py-3 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-300"
          />
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </div>
        </div>
      </div>

    
      <div className="relative flex items-center gap-2">
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button 
            className="flex ml-2 cursor-pointer items-center gap-2 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <User size={18} className="md:w-5 md:h-5" />
            <span className="hidden md:block text-sm">{user.username}</span>
          </button>
          
        
          {isDropdownOpen && (
            <div 
              className="absolute right-0 top-full w-40 md:w-48 bg-black border border-white/20 rounded-xl shadow-2xl py-2 z-50"
            >

              {user && user.role=="user" && (
                <Link 
                  to="/user-dashboard"
                  className="flex items-center gap-3 px-3 md:px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Settings size={14} className="md:w-4 md:h-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              {user && user.role=="admin" && (
                <Link 
                  to="/admin-dashboard"
                  className="flex items-center gap-3 px-3 md:px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Settings size={14} className="md:w-4 md:h-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              {user && user.role=="majorAdmin" && (
                <Link 
                  to="/admin-dashboard"
                  className="flex items-center gap-3 px-3 md:px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Settings size={14} className="md:w-4 md:h-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer w-full flex items-center gap-3 px-3 md:px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-3 h-3 md:w-4 md:h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={14} className="md:w-4 md:h-4" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;