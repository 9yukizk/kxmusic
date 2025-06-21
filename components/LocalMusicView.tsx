'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Upload, Search } from 'lucide-react'
import { Track } from '@/contexts/MusicContext'
import { localMusicService } from '@/services/localMusicService'
import TrackCard from './TrackCard'

export default function LocalMusicView() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLocalMusic()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = tracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTracks(filtered)
    } else {
      setFilteredTracks(tracks)
    }
  }, [searchQuery, tracks])

  const loadLocalMusic = async () => {
    try {
      setIsLoading(true)
      const response = await localMusicService.getMusicFiles()
      if (response.files) {
        setTracks(response.files)
        setFilteredTracks(response.files)
      }
    } catch (error) {
      console.error('Error loading local music:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Mi Música</h1>
            <p className="text-gray-400">
              {tracks.length} {tracks.length === 1 ? 'canción' : 'canciones'} en tu biblioteca
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar en tu música..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {tracks.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No tienes música local
          </h3>
          <p className="text-gray-400 mb-6">
            Sube tus archivos de música para empezar a escuchar
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300">
            Subir Música
          </button>
        </motion.div>
      ) : (
        <div>
          {/* Tracks Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {filteredTracks.map((track) => (
              <motion.div
                key={track.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <TrackCard track={track} />
              </motion.div>
            ))}
          </motion.div>

          {filteredTracks.length === 0 && searchQuery && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <p className="text-gray-400">
                No se encontraron canciones que coincidan con &quot;{searchQuery}&quot;
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
} 