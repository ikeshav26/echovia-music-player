import { createContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const appContext = createContext()

export const ContextProvider = ({ children }) => {
    const [user, setuser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
    const navigate = useNavigate()
    const location = useLocation()

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

  
    const [currentSong, setCurrentSong] = useState(() => {
        const saved = localStorage.getItem("currentSong");
        return saved ? JSON.parse(saved) : null;
    });
    
    const [isPlaying, setIsPlaying] = useState(false); 
    const [currentTime, setCurrentTime] = useState(() => {
        const saved = localStorage.getItem("currentTime");
        return saved ? parseFloat(saved) : 0;
    });
    
    const [duration, setDuration] = useState(0);
    
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem("volume");
        return saved ? parseInt(saved) : 100;
    });
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [currentSongIndex, setCurrentSongIndex] = useState(() => {
        const saved = localStorage.getItem("currentSongIndex");
        return saved ? parseInt(saved) : 0;
    });
    
   
    const [playlist, setPlaylist] = useState(() => {
        const saved = localStorage.getItem("playlist");
        return saved ? JSON.parse(saved) : [];
    });

   
    const audioRef = useRef(null);

  
    useEffect(() => {
        if (currentSong) {
            localStorage.setItem("currentSong", JSON.stringify(currentSong));
        } else {
            localStorage.removeItem("currentSong");
        }
    }, [currentSong]);

    useEffect(() => {
        localStorage.setItem("currentTime", currentTime.toString());
    }, [currentTime]);

    useEffect(() => {
        localStorage.setItem("volume", volume.toString());
    }, [volume]);

    useEffect(() => {
        localStorage.setItem("currentSongIndex", currentSongIndex.toString());
    }, [currentSongIndex]);

    useEffect(() => {
        localStorage.setItem("playlist", JSON.stringify(playlist));
    }, [playlist]);

    
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

  
    const playSong = (song, songIndex = null) => {
        if (!song.streamUrl && !song.audioUrl) {
            console.error('Song does not have a valid audio URL');
            return;
        }

        setCurrentSong(song);
        
        
        if (songIndex !== null) {
            setCurrentSongIndex(songIndex);
        } else {
            const index = playlist.findIndex(p => 
                p._id === song._id || p.id === song.id || 
                (p.title === song.title && p.artist === song.artist)
            );
            if (index !== -1) {
                setCurrentSongIndex(index);
            } else {
                setPlaylist(prev => [...prev, song]);
                setCurrentSongIndex(playlist.length);
            }
        }
        
        setIsPlaying(true);
        setCurrentTime(0);
    };

    const addToPlaylist = (song) => {
        const exists = playlist.some(p => 
            p._id === song._id || p.id === song.id ||
            (p.title === song.title && p.artist === song.artist)
        );
        
        if (!exists) {
            setPlaylist(prev => [...prev, song]);
        }
    };

    const pauseSong = () => {
        setIsPlaying(false);
    };

    const playNextSong = () => {
        if (currentSongIndex < playlist.length - 1) {
            const nextIndex = currentSongIndex + 1;
            setCurrentSongIndex(nextIndex);
            setCurrentSong(playlist[nextIndex]);
            setCurrentTime(0);
        } else {
            setCurrentSongIndex(0);
            setCurrentSong(playlist[0]);
            setCurrentTime(0);
        }
    };

    const playPreviousSong = () => {
        if (currentSongIndex > 0) {
            const prevIndex = currentSongIndex - 1;
            setCurrentSongIndex(prevIndex);
            setCurrentSong(playlist[prevIndex]);
            setCurrentTime(0);
        } else {
            const lastIndex = playlist.length - 1;
            setCurrentSongIndex(lastIndex);
            setCurrentSong(playlist[lastIndex]);
            setCurrentTime(0);
        }
    };

    const updatePlaylist = (newPlaylist) => {
        setPlaylist(newPlaylist);
        if (currentSong && !newPlaylist.find(song => song.id === currentSong.id)) {
            setCurrentSong(null);
            setCurrentSongIndex(0);
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    const clearPlaylistData = () => {
        setPlaylist([]);
        setCurrentSong(null);
        setCurrentSongIndex(0);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setVolume(100); 
        localStorage.removeItem("playlist");
        localStorage.removeItem("currentSong");
        localStorage.removeItem("currentSongIndex");
        localStorage.removeItem("currentTime");
        localStorage.removeItem("duration");
        localStorage.removeItem("volume");
        localStorage.removeItem("isPlaying");
    };

    const value = {
        user,
        setuser,
        navigate,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        volume,
        setVolume,
        isLoading,
        setIsLoading,
        currentSongIndex,
        setCurrentSongIndex,
        playlist,
        setPlaylist,
        audioRef,
        playSong,
        pauseSong,
        playNextSong,
        playPreviousSong,
        updatePlaylist,
        addToPlaylist,
        clearPlaylistData
    }

    return (
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    )
}

export default appContext;