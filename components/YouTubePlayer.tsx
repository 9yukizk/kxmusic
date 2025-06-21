'use client'

import { useState, useEffect } from 'react'
import { Track } from '@/contexts/MusicContext'
import { MusicService } from '@/services/musicService'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface YouTubePlayerProps {
  track: Track | null
  isOpen: boolean
  onClose: () => void
  isPlaying: boolean
  onTogglePlay: () => void
}

export default function YouTubePlayer({ 
  track, 
  isOpen, 
  onClose, 
  isPlaying, 
  onTogglePlay 
}: YouTubePlayerProps) {
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')

  useEffect(() => {
    if (track && track.source === 'youtube') {
      const videoId = MusicService.extractYouTubeId(track.url)
      if (videoId) {
        const url = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=0&volume=${volume}`
        setEmbedUrl(url)
      }
    }
  }, [track, isPlaying, volume])

  if (!isOpen || !track) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-4xl mx-4 bg-dark-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-dark-800 to-dark-900 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={track.artwork} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{track.title}</h2>
                <p className="text-white/60">{track.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value))
                    setIsMuted(false)
                  }}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                />
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={onTogglePlay}
                className="w-10 h-10 bg-neon-blue rounded-full flex items-center justify-center shadow-lg hover:shadow-neon-blue/50 transition-shadow"
              >
                {isPlaying ? (
                  <Pause size={16} className="text-white" />
                ) : (
                  <Play size={16} className="text-white ml-0.5" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Controls Overlay */}
          <div className="p-6 bg-gradient-to-t from-dark-900 to-transparent">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">
                Reproduciendo desde YouTube
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>Volumen: {volume}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 