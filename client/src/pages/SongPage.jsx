import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ArrowLeft 
} from 'lucide-react'
import appContext from '../context/AppContext'

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
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(50)
  const titleRef = useRef(null)
  const titleContainerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      navigate('/')
      return
    }
  }, [navigate])
  
  useEffect(() => {
    if (!currentSong && playlist.length > 0) {
      const songToPlay = playlist.find(song => song._id === id) || playlist[0]
      if (songToPlay) setCurrentSong(songToPlay)
    }
  }, [id, currentSong, playlist, setCurrentSong])

  
  useEffect(() => {
    const titleElement = titleRef.current
    const containerElement = titleContainerRef.current
    
    if (!titleElement || !containerElement || !currentSong?.title) return

    const titleWidth = titleElement.scrollWidth
    const containerWidth = containerElement.clientWidth

    if (titleWidth > containerWidth) {
      titleElement.style.animation = 'none'
      titleElement.offsetHeight 
      titleElement.style.animation = `scroll-text ${Math.max(titleWidth / 50, 3)}s linear infinite`
    } else {
      titleElement.style.animation = 'none'
    }
  }, [currentSong?.title, windowWidth])

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
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume)
      setIsMuted(false)
      if (audioRef.current) {
        audioRef.current.volume = previousVolume / 100
      }
    } else {
      setPreviousVolume(volume || 50)
      setVolume(0)
      setIsMuted(true)
      if (audioRef.current) {
        audioRef.current.volume = 0
      }
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
      const audio = audioRef.current
      if (audio) {
        audio.pause()
      }
      if (typeof setIsLoading === 'function') {
        setIsLoading(false)
      }
    }
  }, [audioRef, setIsLoading])

  const goBack = () => {
    navigate(-1)
    navigate(-1)
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-gray-600/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm text-gray-300 animate-pulse">Loading music...</p>
        </div>
      </div>
    )
  }

  if (windowWidth > 768) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Music className="w-20 h-20 mx-auto mb-6 text-gray-400 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4 text-white">Mobile Only</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">This immersive music experience is optimized for mobile devices. Please access it from a mobile device or resize your browser window.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 flex-shrink-0 relative z-10">
        <button 
          onClick={goBack} 
          className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Album Art Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="aspect-square w-full max-w-xs sm:max-w-sm relative">
            <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-900 flex items-center justify-center shadow-2xl relative">
              {currentSong?.thumbnailUrl ? (
                <img 
                  src={currentSong.thumbnailUrl} 
                  alt={currentSong?.title || 'Song thumbnail'} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              ) : (
                <Music className="w-20 h-20 sm:w-24 sm:h-24 text-gray-500" />
              )}
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 border-3 border-gray-600/30 border-t-white rounded-full animate-spin"></div>
                    <p className="text-sm sm:text-base text-gray-300 animate-pulse">Loading music...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

       
        <div className="flex-shrink-0 p-4 sm:p-6 space-y-6">
         
          <div className="text-center space-y-3">
            <div 
              ref={titleContainerRef}
              className="overflow-hidden relative h-10 sm:h-12 flex items-center justify-center"
            >
              <h1 
                ref={titleRef}
                className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap"
              >
                {currentSong?.title || 'Unknown Title'}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4 text-gray-400">
              <p className="text-base sm:text-lg font-medium">
                {currentSong?.artist || 'Unknown Artist'}
              </p>
              {playlist.length > 0 && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                    Track {(currentSongIndex || 0) + 1}/{playlist.length}
                  </span>
                </>
              )}
            </div>
          </div>

        
          <div className="w-full space-y-2">
            <div 
              className="w-full h-1.5 sm:h-2 bg-white/20 rounded-full cursor-pointer group hover:h-2 sm:hover:h-2.5 transition-all duration-200"
              onClick={handleSeek}
              role="slider"
              aria-label="Seek audio position"
            >
              <div 
                className="bg-white h-full rounded-full transition-all duration-100 relative"
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

         
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            <button 
              onClick={playPreviousSong} 
              disabled={playlist.length <= 1}
              className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
              aria-label="Previous song"
            >
              <SkipBack className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            
            <button 
              onClick={togglePlayPause} 
              disabled={isLoading}
              className="p-5 sm:p-6 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={playNextSong} 
              disabled={playlist.length <= 1}
              className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
              aria-label="Next song"
            >
              <SkipForward className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

        
          <div className="w-full max-w-xs mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg">
              <button 
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume || 0}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer appearance-none slider"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${volume || 0}%, rgba(255,255,255,0.2) ${volume || 0}%, rgba(255,255,255,0.2) 100%)`
                  }}
                  aria-label="Volume control"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-300 font-medium min-w-[2.5rem] text-right">
                {volume || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

     
      <style>{`
        @keyframes scroll-text {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(calc(-100% + 100vw - 4rem));
          }
          100% {
            transform: translateX(0);
          }
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
          border: none;
        }
        
        @media (min-width: 640px) {
          .slider::-webkit-slider-thumb {
            width: 20px;
            height: 20px;
          }
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        @media (min-width: 640px) {
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
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