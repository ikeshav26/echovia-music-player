import React, { useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, ArrowLeft, MoreHorizontal } from 'lucide-react'
import appContext from '../context/AppContext'
import { useState } from 'react'

const SongPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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
    playNextSong,
    playPreviousSong,
    audioRef
  } = useContext(appContext)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
   
    setIsMounted(true)
    
   
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      navigate('/');
      return;
    }
  }, [navigate])
  
  useEffect(() => {
    if (!currentSong && playlist.length > 0) {
      const songToPlay = playlist.find(song => song._id === id) || playlist[0]
      if (songToPlay) setCurrentSong(songToPlay)
    }
  }, [id, currentSong, playlist, setCurrentSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    if (currentSong.audioUrl && audio.src !== currentSong.audioUrl) {
      setIsLoading(true)
      audio.src = currentSong.audioUrl
      audio.load()
    }

   
    const volumeValue = Number(volume) || 50 
    audio.volume = volumeValue / 100

    const handleLoadedData = () => {
      setIsLoading(false)
      setDuration(audio.duration || 0)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const handleEnded = () => playNextSong()
    const handleError = (error) => {
      setIsLoading(false)
      console.error('Audio loading error:', error)
    }

    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [currentSong, audioRef, volume, setIsLoading, setDuration, setCurrentTime, playNextSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isLoading) return
    
    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Audio play error:', err)
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, audioRef, isLoading, setIsPlaying])

  const togglePlayPause = () => {
    if (!currentSong || isLoading) return
    setIsPlaying(!isPlaying)
  }

  const handleSeek = e => {
    const audio = audioRef.current
    if (!audio || !duration) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newTime = percent * duration
    
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = e => {
    const newVolume = Number(e.target.value) || 0
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const formatTime = t => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      if (typeof setIsLoading === 'function') {
        setIsLoading(false);
      }
    };
  }, [audioRef, setIsLoading]);

  const goBack = () => {
    navigate('/')
  }


  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm text-white/80">Loading...</p>
        </div>
      </div>
    )
  }


  if (windowWidth > 768) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h2 className="text-2xl font-bold mb-2">Mobile Only</h2>
          <p className="text-gray-400 mb-4">This page is optimized for mobile devices. Please access it from a mobile device or resize your browser window.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      <div className="flex items-center justify-between p-4 sm:p-6 flex-shrink-0">
        <button 
          onClick={goBack} 
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
       
        <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg relative">
            <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 flex items-center justify-center shadow-2xl relative">
              {currentSong?.thumbnailUrl ? (
                <img 
                  src={currentSong.thumbnailUrl} 
                  alt={currentSong?.title || 'Song thumbnail'} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              ) : (
                <Music className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-500" />
              )}
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="text-xs sm:text-sm text-white/80">Loading...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-white/5 rounded-2xl sm:rounded-3xl blur-xl -z-10"></div>
          </div>
        </div>

       
        <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8 lg:pl-4 space-y-6 sm:space-y-8">
         
          <div className="text-center lg:text-left space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight break-words">
              {currentSong?.title || 'Unknown Title'}
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl font-medium break-words">
              {currentSong?.artist || 'Unknown Artist'}
            </p>
            {playlist.length > 0 && (
              <div className="flex justify-center lg:justify-start">
                <span className="text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-full">
                  Track {(currentSongIndex || 0) + 1} of {playlist.length}
                </span>
              </div>
            )}
          </div>

        
          <div className="w-full space-y-2">
            <div 
              className="w-full h-1.5 sm:h-2 lg:h-3 bg-white/10 rounded-full cursor-pointer group hover:h-2 sm:hover:h-2.5 lg:hover:h-4 transition-all duration-200 touch-manipulation"
              onClick={handleSeek}
              role="slider"
              aria-label="Seek audio position"
            >
              <div 
                className="bg-white h-full rounded-full transition-all duration-100 relative group-hover:shadow-lg"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-400 font-medium px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          
          <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8">
            <button 
              onClick={playPreviousSong} 
              disabled={playlist.length <= 1}
              className="p-2.5 sm:p-3 lg:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Previous song"
            >
              <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </button>
            
            <button 
              onClick={togglePlayPause} 
              disabled={isLoading}
              className="p-3 sm:p-4 lg:p-6 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed touch-manipulation"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              ) : (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={playNextSong} 
              disabled={playlist.length <= 1}
              className="p-2.5 sm:p-3 lg:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Next song"
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </button>
          </div>

         
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume || 50}
                  onChange={handleVolumeChange}
                  className="w-full h-1 sm:h-1.5 bg-white/10 rounded-full cursor-pointer appearance-none slider touch-manipulation"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${volume || 50}%, rgba(255,255,255,0.1) ${volume || 50}%, rgba(255,255,255,0.1) 100%)`
                  }}
                  aria-label="Volume control"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-300 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-right">
                {volume || 50}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s;
        }
        
        @media (min-width: 640px) {
          .slider::-webkit-slider-thumb {
            width: 18px;
            height: 18px;
          }
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        
        @media (min-width: 640px) {
          .slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
          }
        }

        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  )
}

export default SongPage