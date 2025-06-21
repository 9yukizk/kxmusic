'use client'

import { useEffect, useRef, useState } from 'react'
import { Track } from '@/contexts/MusicContext'
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
  List,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDuration } from '@/services/musicService'

export default function AudioPlayer() {
  const { state, togglePlay, nextTrack, previousTrack, addToFavorites, removeFromFavorites, isFavorite } = useMusic()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentTrack = state.currentTrack

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => nextTrack()
    const handleError = () => {
      setError('Error al reproducir la canción')
      setIsLoading(false)
    }
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [nextTrack])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (state.isPlaying) {
      audio.play().catch(err => {
        console.error('Play error:', err)
        setError('No se pudo reproducir la canción')
      })
    } else {
      audio.pause()
    }
  }, [state.isPlaying])

  // Handle track change
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // Set audio source based on track source
    if (currentTrack.source === 'deezer') {
      audio.src = currentTrack.url // Preview URL (30 seconds)
    } else if (currentTrack.source === 'youtube') {
      // For YouTube, we'll use a different approach
      // This is where you'd implement YouTube audio extraction
      setError('YouTube requiere reproducción especial')
      return
    } else {
      audio.src = currentTrack.url
    }

    audio.load()
    setCurrentTime(0)
    setError(null)
  }, [currentTrack])

  // Handle volume
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
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
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Player UI */}
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
              </p>
              {error && (
                <p className="text-xs text-red-400 truncate">
                  {error}
                </p>
              )}
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
              onClick={togglePlay}
              disabled={isLoading}
              className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center shadow-lg hover:shadow-neon-blue/50 transition-shadow disabled:opacity-50"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Loader2 size={20} className="text-white animate-spin" />
                  </motion.div>
                ) : state.isPlaying ? (
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
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleMuteToggle}
                className="player-control text-white/70 hover:text-white"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </motion.button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Time display */}
        <div className="absolute bottom-2 right-6 text-xs text-white/40">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>

        {/* Progress bar (clickable) */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleProgressChange}
          className="absolute top-0 left-0 right-0 h-1 opacity-0 cursor-pointer"
        />
      </motion.div>
    </>
  )
} 