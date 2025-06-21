'use client'

import { useMusic } from '@/contexts/MusicContext'
import { 
  Home, 
  Search, 
  Library, 
  ListMusic, 
  Heart,
  Settings,
  User,
  Music,
  Upload
} from 'lucide-react'
import { motion } from 'framer-motion'

const sidebarItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'search', label: 'Buscar', icon: Search },
  { id: 'library', label: 'Mi Música', icon: Library },
  { id: 'local', label: 'Música Local', icon: Music },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
]

export default function Sidebar() {
  const { state, dispatch, showUploader } = useMusic()

  const handleViewChange = (view: typeof state.currentView) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view })
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen bg-dark-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6">
        <motion.h1 
          className="text-2xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          KX Music
        </motion.h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = state.currentView === item.id
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewChange(item.id as typeof state.currentView)}
              className={`w-full sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon 
                size={20} 
                className={isActive ? 'text-neon-blue' : 'text-white/70'} 
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-1 h-8 bg-neon-blue rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}

        {/* Upload Button */}
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={showUploader}
          className="w-full sidebar-item mt-4 border border-neon-blue/30 hover:border-neon-blue/60 transition-colors"
        >
          <Upload 
            size={20} 
            className="text-neon-blue" 
          />
          <span className="font-medium text-neon-blue">Añadir Música</span>
        </motion.button>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Usuario</p>
            <p className="text-xs text-white/60">Premium</p>
          </div>
          <Settings size={16} className="text-white/60" />
        </motion.button>
      </div>

      {/* Neon glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30"></div>
      </div>
    </motion.div>
  )
} 