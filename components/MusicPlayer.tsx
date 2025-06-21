<<<<<<< HEAD
'use client'

import { useMusic } from '@/contexts/MusicContext'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Share2,
  List
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDuration } from '@/services/musicService'
import { useState, useEffect, useRef } from 'react'

export default function MusicPlayer() {
  const { state, playTrack, togglePlay, nextTrack, previousTrack, addToFavorites, removeFromFavorites, isFavorite } = useMusic()
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = state.currentTrack

  useEffect(() => {
    setVolume(state.volume)
  }, [state.volume])

  // Handle audio element for local files
  useEffect(() => {
    if (currentTrack && currentTrack.source === 'local' && audioRef.current) {
      const audio = audioRef.current
      
      audio.src = currentTrack.url
      audio.volume = volume
      audio.muted = isMuted
      
      if (state.isPlaying) {
        audio.play().catch(console.error)
      }
    }
  }, [currentTrack, state.isPlaying, volume, isMuted])

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      nextTrack()
    }

    const handlePlay = () => {
      // Update context state
    }

    const handlePause = () => {
      // Update context state
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [nextTrack])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handlePlayPause = () => {
    if (currentTrack?.source === 'local' && audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
    }
    togglePlay()
  }

  const handleFavorite = () => {
    if (!currentTrack) return
    
    if (isFavorite(currentTrack.id)) {
      removeFromFavorites(currentTrack.id)
    } else {
      addToFavorites(currentTrack)
    }
  }

  if (!currentTrack) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 h-20 bg-dark-900/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center"
      >
        <p className="text-white/60">Selecciona una canción para reproducir</p>
      </motion.div>
    )
  }

  return (
    <>
      {/* Hidden audio element for local files */}
      <audio ref={audioRef} preload="metadata" />
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 h-20 bg-dark-900/80 backdrop-blur-xl border-t border-white/10"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between h-full px-6">
          {/* Track info */}
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-white/60 truncate">
                {currentTrack.artist}
                {currentTrack.source === 'local' && (
                  <span className="ml-2 text-neon-cyan text-xs">• Local</span>
                )}
              </p>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={previousTrack}
              className="player-control text-white/70 hover:text-white"
            >
              <SkipBack size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={handlePlayPause}
              className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center shadow-lg hover:shadow-neon-blue/50 transition-shadow"
            >
              <AnimatePresence mode="wait">
                {state.isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Pause size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Play size={20} className="text-white ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTrack}
              className="player-control text-white/70 hover:text-white"
            >
              <SkipForward size={20} />
            </motion.button>
          </div>

          {/* Additional controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className={`player-control ${isFavorite(currentTrack.id) ? 'text-red-400' : 'text-white/70 hover:text-white'}`}
            >
              <Heart size={18} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="player-control text-white/70 hover:text-white"
            >
              <Share2 size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="player-control text-white/70 hover:text-white"
            >
              <List size={18} />
            </motion.button>

            {/* Volume control */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
                className="player-control text-white/70 hover:text-white"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </motion.button>

              <AnimatePresence>
                {showVolume && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full right-0 mb-2 p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Time display */}
        <div className="absolute bottom-2 right-6 text-xs text-white/60">
          {formatDuration(currentTime)} / {formatDuration(duration || currentTrack.duration)}
        </div>
      </motion.div>
    </>
  )
=======
'use client'

import { useMusic } from '@/contexts/MusicContext'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Share2,
  List
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDuration } from '@/services/musicService'
import { useState, useEffect, useRef } from 'react'

export default function MusicPlayer() {
  const { state, playTrack, togglePlay, nextTrack, previousTrack, addToFavorites, removeFromFavorites, isFavorite } = useMusic()
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = state.currentTrack

  useEffect(() => {
    setVolume(state.volume)
  }, [state.volume])

  // Handle audio element for local files
  useEffect(() => {
    if (currentTrack && currentTrack.source === 'local' && audioRef.current) {
      const audio = audioRef.current
      
      audio.src = currentTrack.url
      audio.volume = volume
      audio.muted = isMuted
      
      if (state.isPlaying) {
        audio.play().catch(console.error)
      }
    }
  }, [currentTrack, state.isPlaying, volume, isMuted])

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      nextTrack()
    }

    const handlePlay = () => {
      // Update context state
    }

    const handlePause = () => {
      // Update context state
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [nextTrack])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handlePlayPause = () => {
    if (currentTrack?.source === 'local' && audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
    }
    togglePlay()
  }

  const handleFavorite = () => {
    if (!currentTrack) return
    
    if (isFavorite(currentTrack.id)) {
      removeFromFavorites(currentTrack.id)
    } else {
      addToFavorites(currentTrack)
    }
  }

  if (!currentTrack) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 h-20 bg-dark-900/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center"
      >
        <p className="text-white/60">Selecciona una canción para reproducir</p>
      </motion.div>
    )
  }

  return (
    <>
      {/* Hidden audio element for local files */}
      <audio ref={audioRef} preload="metadata" />
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 h-20 bg-dark-900/80 backdrop-blur-xl border-t border-white/10"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between h-full px-6">
          {/* Track info */}
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-white/60 truncate">
                {currentTrack.artist}
                {currentTrack.source === 'local' && (
                  <span className="ml-2 text-neon-cyan text-xs">• Local</span>
                )}
              </p>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={previousTrack}
              className="player-control text-white/70 hover:text-white"
            >
              <SkipBack size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={handlePlayPause}
              className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center shadow-lg hover:shadow-neon-blue/50 transition-shadow"
            >
              <AnimatePresence mode="wait">
                {state.isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Pause size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Play size={20} className="text-white ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTrack}
              className="player-control text-white/70 hover:text-white"
            >
              <SkipForward size={20} />
            </motion.button>
          </div>

          {/* Additional controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className={`player-control ${isFavorite(currentTrack.id) ? 'text-red-400' : 'text-white/70 hover:text-white'}`}
            >
              <Heart size={18} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="player-control text-white/70 hover:text-white"
            >
              <Share2 size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="player-control text-white/70 hover:text-white"
            >
              <List size={18} />
            </motion.button>

            {/* Volume control */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
                className="player-control text-white/70 hover:text-white"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </motion.button>

              <AnimatePresence>
                {showVolume && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full right-0 mb-2 p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Time display */}
        <div className="absolute bottom-2 right-6 text-xs text-white/60">
          {formatDuration(currentTime)} / {formatDuration(duration || currentTrack.duration)}
        </div>
      </motion.div>
    </>
  )
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 