<<<<<<< HEAD
'use client'

import { useEffect } from 'react'
import { useMusic } from '@/contexts/MusicContext'
import { MusicService } from '@/services/musicService'
import Sidebar from '@/components/Sidebar'
import MusicPlayer from '@/components/MusicPlayer'
import SearchBar from '@/components/SearchBar'
import TrackCard from '@/components/TrackCard'
import LocalMusicView from '@/components/LocalMusicView'
import MusicUploader from '@/components/MusicUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Music, Heart, Clock } from 'lucide-react'

export default function Home() {
  const { state, dispatch } = useMusic()

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        const trending = await MusicService.getTrendingTracks()
        const recommended = await MusicService.getRecommendedTracks()
        
        // Set initial queue
        dispatch({ type: 'SET_QUEUE', payload: trending })
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [dispatch])

  const renderContent = () => {
    switch (state.currentView) {
      case 'home':
        return <HomeView />
      case 'search':
        return <SearchView />
      case 'library':
        return <LibraryView />
      case 'local':
        return <LocalMusicView />
      case 'playlists':
        return <PlaylistsView />
      case 'favorites':
        return <FavoritesView />
      default:
        return <HomeView />
    }
  }

  return (
    <div className="flex h-screen bg-midnight overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </main>
        
        <MusicPlayer />
      </div>

      {/* Floating Music Uploader */}
      <MusicUploader />
    </div>
  )
}

function HomeView() {
  const { state, dispatch } = useMusic()

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold gradient-text">
          Bienvenido a KX Music
        </h1>
        <p className="text-white/60 text-lg">
          Descubre música increíble con nuestro diseño futurista
        </p>
      </motion.div>

      {/* Search Bar */}
      <SearchBar />

      {/* Trending Section */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="text-neon-blue" size={24} />
          <h2 className="text-2xl font-bold text-white">Tendencias</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {state.queue.slice(0, 6).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Clock className="text-neon-cyan" size={24} />
          <h2 className="text-2xl font-bold text-white">Reproducido Recientemente</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {state.queue.slice(2, 8).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </motion.section>
    </div>
  )
}

function SearchView() {
  const { state } = useMusic()

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Resultados de Búsqueda</h1>
        <p className="text-white/60">
          {state.searchResults.length} canciones encontradas
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {state.searchResults.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}

function LibraryView() {
  const { state } = useMusic()

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Mi Biblioteca</h1>
        <p className="text-white/60">
          Tu música personal
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {state.queue.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}

function PlaylistsView() {
  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Playlists</h1>
        <p className="text-white/60">
          Tus colecciones de música
        </p>
      </motion.div>

      <div className="text-center py-12">
        <Music className="mx-auto text-white/40" size={64} />
        <p className="text-white/60 mt-4">No hay playlists creadas aún</p>
      </div>
    </div>
  )
}

function FavoritesView() {
  const { state } = useMusic()

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Favoritos</h1>
        <p className="text-white/60">
          {state.favorites.length} canciones favoritas
        </p>
      </motion.div>

      {state.favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto text-white/40" size={64} />
          <p className="text-white/60 mt-4">No tienes canciones favoritas aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {state.favorites.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  )
=======
'use client'

import { useEffect } from 'react'
import { useMusic } from '@/contexts/MusicContext'
import { MusicService } from '@/services/musicService'
import Sidebar from '@/components/Sidebar'
import MusicPlayer from '@/components/MusicPlayer'
import SearchBar from '@/components/SearchBar'
import TrackCard from '@/components/TrackCard'
import LocalMusicView from '@/components/LocalMusicView'
import MusicUploader from '@/components/MusicUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Music, Heart, Clock } from 'lucide-react'

export default function Home() {
  const { state, dispatch } = useMusic()

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        const trending = await MusicService.getTrendingTracks()
        const recommended = await MusicService.getRecommendedTracks()
        
        // Set initial queue
        dispatch({ type: 'SET_QUEUE', payload: trending })
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [dispatch])

  const renderContent = () => {
    switch (state.currentView) {
      case 'home':
        return <HomeView />
      case 'search':
        return <SearchView />
      case 'library':
        return <LibraryView />
      case 'local':
        return <LocalMusicView />
      case 'playlists':
        return <PlaylistsView />
      case 'favorites':
        return <FavoritesView />
      default:
        return <HomeView />
    }
  }

  return (
    <div className="flex h-screen bg-midnight overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </main>
        
        <MusicPlayer />
      </div>

      {/* Floating Music Uploader */}
      <MusicUploader />
    </div>
  )
}

function HomeView() {
  const { state, dispatch } = useMusic()

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold gradient-text">
          Bienvenido a KX Music
        </h1>
        <p className="text-white/60 text-lg">
          Descubre música increíble con nuestro diseño futurista
        </p>
      </motion.div>

      {/* Search Bar */}
      <SearchBar />

      {/* Trending Section */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="text-neon-blue" size={24} />
          <h2 className="text-2xl font-bold text-white">Tendencias</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {state.queue.slice(0, 6).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Clock className="text-neon-cyan" size={24} />
          <h2 className="text-2xl font-bold text-white">Reproducido Recientemente</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {state.queue.slice(2, 8).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </motion.section>
    </div>
  )
}

function SearchView() {
  const { state } = useMusic()

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Resultados de Búsqueda</h1>
        <p className="text-white/60">
          {state.searchResults.length} canciones encontradas
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {state.searchResults.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}

function LibraryView() {
  const { state } = useMusic()

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Mi Biblioteca</h1>
        <p className="text-white/60">
          Tu música personal
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {state.queue.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}

function PlaylistsView() {
  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Playlists</h1>
        <p className="text-white/60">
          Tus colecciones de música
        </p>
      </motion.div>

      <div className="text-center py-12">
        <Music className="mx-auto text-white/40" size={64} />
        <p className="text-white/60 mt-4">No hay playlists creadas aún</p>
      </div>
    </div>
  )
}

function FavoritesView() {
  const { state } = useMusic()

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Favoritos</h1>
        <p className="text-white/60">
          {state.favorites.length} canciones favoritas
        </p>
      </motion.div>

      {state.favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto text-white/40" size={64} />
          <p className="text-white/60 mt-4">No tienes canciones favoritas aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {state.favorites.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  )
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 