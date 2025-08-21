import React, { useEffect, useContext } from 'react'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import appContext from '../context/AppContext'

const MusicBar = () => {
  const {
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
    playlist,
    audioRef,
    playSong,
    pauseSong,
    playNextSong,
    playPreviousSong
  } = useContext(appContext);


  useEffect(() => {
    if (!currentSong && playlist.length > 0 && currentSongIndex < playlist.length) {
      const songToPlay = playlist[currentSongIndex];
      if (songToPlay) {
        setCurrentSong(songToPlay);
      }
    }
  }, [playlist, currentSong, currentSongIndex, setCurrentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong && currentTime > 0) {
      audio.currentTime = currentTime;
    }
  }, [currentSong, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      
      if (currentTime > 0) {
        audio.currentTime = currentTime;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      playNextSong(); 
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (currentTime > 0 && Math.abs(audio.currentTime - currentTime) > 1) {
        audio.currentTime = currentTime;
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio loading error');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong, setDuration, setCurrentTime, setIsLoading, setIsPlaying, playNextSong, currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, audioRef, setIsPlaying]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4  left-4 right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl lg:p-2 p-4 z-50 shadow-2xl">
     
      <div className="hidden lg:flex items-center gap-4">
       
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 overflow-hidden flex-shrink-0">
          {currentSong?.thumbnailUrl ? (
            <img 
              src={currentSong.thumbnailUrl} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-5 h-5 text-white/60" />
          )}
        </div>

      
        <div className="min-w-0 w-48">
          <h3 className="text-sm font-semibold text-white truncate">
            {currentSong?.title || currentSong?.name || "---"}
          </h3>
          <p className="text-xs text-gray-300 truncate">
            {currentSong?.artist || currentSong?.channel || "---"}
          </p>
        </div>

      
        <div className="flex items-center gap-2">
          <button 
            onClick={playPreviousSong}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            disabled={isLoading || !currentSong}
          >
            <SkipBack className="w-4 h-4 cursor-pointer text-white" />
          </button>
          
          <button 
            onClick={togglePlayPause}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading || !currentSong}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-4 cursor-pointer h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 cursor-pointer text-white" />
            )}
          </button>
          
          <button 
            onClick={playNextSong}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            disabled={isLoading || !currentSong}
          >
            <SkipForward className="w-4 h-4 cursor-pointer text-white" />
          </button>
        </div>

        
        <div className="flex-1 mx-4">
          <div 
            className={`w-full bg-white/20 rounded-full h-1 ${currentSong ? 'cursor-pointer' : ''}`}
            onClick={currentSong ? handleSeek : undefined}
          >
            <div 
              className="bg-white h-full rounded-full transition-all duration-100"
              style={{ width: `${currentSong && duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        
        <div className="text-xs text-gray-300 min-w-fit">
          {currentSong ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:-- / --:--"}
        </div>
      </div>

   
      <div className="lg:hidden">
        
        <div 
          className={`w-full bg-white/20 rounded-full h-1 mb-3 ${currentSong ? 'cursor-pointer' : ''}`}
          onClick={currentSong ? handleSeek : undefined}
        >
          <div 
            className="bg-white h-full rounded-full transition-all duration-100"
            style={{ width: `${currentSong && duration ? (currentTime / duration) * 100 : 0}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 overflow-hidden flex-shrink-0">
            {currentSong?.thumbnailUrl ? (
              <img 
                src={currentSong.thumbnailUrl} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-6 h-6 cursor-pointer text-white/60" />
            )}
          </div>

         
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {currentSong?.title || currentSong?.name || "---"}
            </h3>
            <p className="text-xs text-gray-300 truncate">
              {currentSong?.artist || currentSong?.channel || "---"}
            </p>
          </div>

         
          <div className="flex items-center gap-2">
            <button 
              onClick={playPreviousSong}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              disabled={isLoading || !currentSong}
            >
              <SkipBack className="w-4 h-4 cursor-pointer text-white" />
            </button>
            
            <button 
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 disabled:opacity-50"
              disabled={isLoading || !currentSong}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-4 h-4 cursor-pointer text-white" />
              ) : (
                <Play className="w-4 h-4 cursor-pointer text-white" />
              )}
            </button>
            
            <button 
              onClick={playNextSong}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              disabled={isLoading || !currentSong}
            >
              <SkipForward className="w-4 h-4 cursor-pointer text-white" />
            </button>
          </div>

          <div className="hidden sm:block text-xs text-gray-300 min-w-fit">
            {currentSong ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:-- / --:--"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicBar
