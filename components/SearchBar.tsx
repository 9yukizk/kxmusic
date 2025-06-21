<<<<<<< HEAD
'use client'

import { useState } from 'react'
import { Search, Mic, Filter, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMusic } from '@/contexts/MusicContext'
import { MusicService } from '@/services/musicService'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { dispatch } = useMusic()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const results = await MusicService.searchTracks(query)
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results })
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' })
    } catch (error) {
      console.error('Search error:', error)
      // Show error message to user
      alert('Error al buscar. Inténtalo de nuevo.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion)
    setIsSearching(true)
    try {
      const results = await MusicService.searchTracks(suggestion)
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results })
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative max-w-2xl mx-auto"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative flex items-center"
          >
            <Search 
              size={20} 
              className="absolute left-4 text-white/60 z-10" 
            />
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar canciones, artistas o álbumes en YouTube..."
              className="w-full pl-12 pr-20 py-4 bg-dark-800/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 transition-all duration-300"
            />

            <div className="absolute right-2 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Mic size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Filter size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSearching}
                className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-xl text-white font-medium hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Buscando...
                  </>
                ) : (
                  'Buscar'
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Neon glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10"></div>
            <div className="absolute inset-0 rounded-2xl border border-neon-blue/30"></div>
          </div>
        </div>
      </form>

      {/* Search suggestions */}
      {query && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-800/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
        >
          <div className="p-4">
            <p className="text-sm text-white/60 mb-2">Sugerencias rápidas:</p>
            <div className="space-y-1">
              {['Blinding Lights', 'Shape of You', 'Dance Monkey', 'Bad Guy', 'Levitating'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Search info */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4"
        >
          <p className="text-white/40 text-sm">
            🔍 Busca en YouTube • 🎵 Encuentra millones de canciones • ⚡ Resultados instantáneos
          </p>
        </motion.div>
      )}
    </motion.div>
  )
=======
'use client'

import { useState } from 'react'
import { Search, Mic, Filter, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMusic } from '@/contexts/MusicContext'
import { MusicService } from '@/services/musicService'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { dispatch } = useMusic()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const results = await MusicService.searchTracks(query)
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results })
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' })
    } catch (error) {
      console.error('Search error:', error)
      // Show error message to user
      alert('Error al buscar. Inténtalo de nuevo.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion)
    setIsSearching(true)
    try {
      const results = await MusicService.searchTracks(suggestion)
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results })
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative max-w-2xl mx-auto"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative flex items-center"
          >
            <Search 
              size={20} 
              className="absolute left-4 text-white/60 z-10" 
            />
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar canciones, artistas o álbumes en YouTube..."
              className="w-full pl-12 pr-20 py-4 bg-dark-800/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 transition-all duration-300"
            />

            <div className="absolute right-2 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Mic size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Filter size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSearching}
                className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-xl text-white font-medium hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Buscando...
                  </>
                ) : (
                  'Buscar'
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Neon glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10"></div>
            <div className="absolute inset-0 rounded-2xl border border-neon-blue/30"></div>
          </div>
        </div>
      </form>

      {/* Search suggestions */}
      {query && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-800/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
        >
          <div className="p-4">
            <p className="text-sm text-white/60 mb-2">Sugerencias rápidas:</p>
            <div className="space-y-1">
              {['Blinding Lights', 'Shape of You', 'Dance Monkey', 'Bad Guy', 'Levitating'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Search info */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4"
        >
          <p className="text-white/40 text-sm">
            🔍 Busca en YouTube • 🎵 Encuentra millones de canciones • ⚡ Resultados instantáneos
          </p>
        </motion.div>
      )}
    </motion.div>
  )
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 