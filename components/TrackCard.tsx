'use client'

import { Track } from '@/contexts/MusicContext'
import { useMusic } from '@/contexts/MusicContext'
import { Play, Heart, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDuration } from '@/services/musicService'
import { useState } from 'react'
import YouTubePlayer from './YouTubePlayer'

interface TrackCardProps {
  track: Track
  showPlayButton?: boolean
}

export default function TrackCard({ track, showPlayButton = true }: TrackCardProps) {
  const { playTrack, addToFavorites, removeFromFavorites, isFavorite } = useMusic()
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (track.source === 'youtube') {
      // Open YouTube player for YouTube tracks
      setShowYouTubePlayer(true)
      setIsPlaying(true)
    } else {
      // Use regular player for other sources
      playTrack(track)
    }
  }

  const handleCardClick = () => {
    if (track.source === 'youtube') {
      setShowYouTubePlayer(true)
      setIsPlaying(true)
    } else {
      playTrack(track)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite(track.id)) {
      removeFromFavorites(track.id)
    } else {
      addToFavorites(track)
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCardClick}
        className="group relative bg-dark-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-neon-blue/30 transition-all duration-300 card-hover cursor-pointer"
      >
        {/* Artwork */}
        <div className="relative mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="aspect-square rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={track.artwork}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Play button overlay */}
          {showPlayButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePlay}
            >
              <div className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center shadow-lg">
                <Play size={20} className="text-white ml-0.5" />
              </div>
            </motion.button>
          )}

          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite(track.id) 
                ? 'bg-red-500/80 text-white' 
                : 'bg-black/50 text-white/70 hover:text-white'
            }`}
          >
            <Heart 
              size={16} 
              fill={isFavorite(track.id) ? 'currentColor' : 'none'} 
            />
          </motion.button>

          {/* More options button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/50 text-white/70 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} />
          </motion.button>

          {/* Source indicator */}
          <div className="absolute bottom-2 left-2">
            <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/20 text-neon-blue backdrop-blur-sm">
              {track.source}
            </span>
          </div>
        </div>

        {/* Track info */}
        <div className="space-y-1">
          <h3 className="font-medium text-white truncate group-hover:text-neon-blue transition-colors">
            {track.title}
          </h3>
          <p className="text-sm text-white/60 truncate">
            {track.artist}
          </p>
          {track.album && (
            <p className="text-xs text-white/40 truncate">
              {track.album}
            </p>
          )}
          
          {/* Duration */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-white/50">
              {track.duration > 0 ? formatDuration(track.duration) : '--:--'}
            </span>
            {track.source === 'youtube' && (
              <span className="text-xs text-neon-blue">
                ▶ YouTube
              </span>
            )}
          </div>
        </div>

        {/* Neon glow effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10"></div>
          <div className="absolute inset-0 rounded-xl border border-neon-blue/20"></div>
        </div>
      </motion.div>

      {/* YouTube Player Modal */}
      <YouTubePlayer
        track={track}
        isOpen={showYouTubePlayer}
        onClose={() => {
          setShowYouTubePlayer(false)
          setIsPlaying(false)
        }}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </>
  )
} 