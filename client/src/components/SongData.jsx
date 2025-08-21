import React, { useEffect, useContext } from 'react'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import appContext from '../context/AppContext'

const SongData = () => {
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
    <div className="hidden lg:block fixed top-20 right-6 w-88 h-[calc(100vh-10.5rem)] bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 z-30 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Now Playing</h2>
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {currentSong ? (
        <div className="space-y-6">
          {/* Song Image */}
          <div className="aspect-square w-full bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative">
            {currentSong.thumbnailUrl ? (
              <img 
                src={currentSong.thumbnailUrl} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <Music className="w-16 h-16 text-gray-400" />
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>

        
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-white leading-tight truncate">
              {currentSong.title || currentSong.name || "Unknown Title"}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {currentSong.artist || currentSong.channel || "Unknown Artist"}
            </p>
            {playlist.length > 0 && (
              <p className="text-xs text-gray-500">
                Track {currentSongIndex + 1} of {playlist.length}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div 
              className="w-full bg-white/10 rounded-full h-1 cursor-pointer hover:h-1.5 transition-all"
              onClick={handleSeek}
            >
              <div 
                className="bg-white h-full rounded-full transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={playPreviousSong}
              className="p-2 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              disabled={isLoading}
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            
            <button 
              onClick={togglePlayPause}
              className="p-3 rounded-full cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              disabled={isLoading || !currentSong}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-6 cursor-pointer h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 cursor-pointer text-white" />
              )}
            </button>
            
            <button 
              onClick={playNextSong}
              className="p-2 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              disabled={isLoading}
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>

         
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{volume}%</span>
            </div>
          </div>
        </div>
      ) : (
       
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Music className="w-12 h-12 text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No song selected</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Select a song from your playlist to start playing
          </p>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}

export default SongData