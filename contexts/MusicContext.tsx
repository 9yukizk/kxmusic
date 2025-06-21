<<<<<<< HEAD
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { localMusicService } from '@/services/localMusicService'

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  artwork: string
  url: string
  source: 'youtube' | 'spotify' | 'deezer' | 'local' | 'jamendo' | 'soundcloud'
  deezerId?: number
  fullTrack?: any
  youtubeId?: string
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  artwork?: string
}

interface MusicState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  playlists: Playlist[]
  favorites: Track[]
  searchResults: Track[]
  currentView: 'home' | 'search' | 'library' | 'playlists' | 'favorites' | 'local'
  localTracks: Track[]
  showUploader: boolean
}

type MusicAction =
  | { type: 'SET_CURRENT_TRACK'; payload: Track }
  | { type: 'SET_QUEUE'; payload: Track[] }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'ADD_TO_QUEUE'; payload: Track }
  | { type: 'REMOVE_FROM_QUEUE'; payload: string }
  | { type: 'ADD_PLAYLIST'; payload: Playlist }
  | { type: 'ADD_TO_FAVORITES'; payload: Track }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Track[] }
  | { type: 'SET_CURRENT_VIEW'; payload: MusicState['currentView'] }
  | { type: 'ADD_LOCAL_TRACK'; payload: Track }
  | { type: 'REMOVE_LOCAL_TRACK'; payload: string }
  | { type: 'SET_LOCAL_TRACKS'; payload: Track[] }
  | { type: 'SHOW_UPLOADER'; payload: boolean }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }

const initialState: MusicState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  playlists: [],
  favorites: [],
  searchResults: [],
  currentView: 'home',
  localTracks: [],
  showUploader: false,
}

function musicReducer(state: MusicState, action: MusicAction): MusicState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload }
    case 'SET_QUEUE':
      return { ...state, queue: action.payload }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] }
    case 'REMOVE_FROM_QUEUE':
      return { ...state, queue: state.queue.filter(track => track.id !== action.payload) }
    case 'ADD_PLAYLIST':
      return { ...state, playlists: [...state.playlists, action.payload] }
    case 'ADD_TO_FAVORITES':
      return { ...state, favorites: [...state.favorites, action.payload] }
    case 'REMOVE_FROM_FAVORITES':
      return { ...state, favorites: state.favorites.filter(track => track.id !== action.payload) }
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload }
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload }
    case 'ADD_LOCAL_TRACK':
      return { ...state, localTracks: [...state.localTracks, action.payload] }
    case 'REMOVE_LOCAL_TRACK':
      return { ...state, localTracks: state.localTracks.filter(track => track.id !== action.payload) }
    case 'SET_LOCAL_TRACKS':
      return { ...state, localTracks: action.payload }
    case 'SHOW_UPLOADER':
      return { ...state, showUploader: action.payload }
    case 'NEXT_TRACK':
      if (state.queue.length > 0) {
        const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id)
        const nextIndex = (currentIndex + 1) % state.queue.length
        return { ...state, currentTrack: state.queue[nextIndex] }
      }
      return state
    case 'PREVIOUS_TRACK':
      if (state.queue.length > 0) {
        const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : state.queue.length - 1
        return { ...state, currentTrack: state.queue[prevIndex] }
      }
      return state
    default:
      return state
  }
}

interface MusicContextType {
  state: MusicState
  dispatch: React.Dispatch<MusicAction>
  playTrack: (track: Track) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  addToFavorites: (track: Track) => void
  removeFromFavorites: (trackId: string) => void
  isFavorite: (trackId: string) => boolean
  addLocalTrack: (track: Track) => void
  removeLocalTrack: (trackId: string) => void
  showUploader: () => void
  hideUploader: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState)

  const playTrack = (track: Track) => {
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track })
    dispatch({ type: 'SET_PLAYING', payload: true })
  }

  const togglePlay = () => {
    dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying })
  }

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' })
  }

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' })
  }

  const addToFavorites = (track: Track) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: track })
  }

  const removeFromFavorites = (trackId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: trackId })
  }

  const isFavorite = (trackId: string) => {
    return state.favorites.some(track => track.id === trackId)
  }

  const addLocalTrack = (track: Track) => {
    dispatch({ type: 'ADD_LOCAL_TRACK', payload: track })
  }

  const removeLocalTrack = (trackId: string) => {
    dispatch({ type: 'REMOVE_LOCAL_TRACK', payload: trackId })
  }

  const showUploader = () => {
    dispatch({ type: 'SHOW_UPLOADER', payload: true })
  }

  const hideUploader = () => {
    dispatch({ type: 'SHOW_UPLOADER', payload: false })
  }

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('kxmusic-state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        // Only restore non-audio related state
        dispatch({ type: 'SET_CURRENT_VIEW', payload: parsed.currentView || 'home' })
        if (parsed.favorites) {
          parsed.favorites.forEach((track: Track) => {
            dispatch({ type: 'ADD_TO_FAVORITES', payload: track })
          })
        }
        if (parsed.playlists) {
          parsed.playlists.forEach((playlist: Playlist) => {
            dispatch({ type: 'ADD_PLAYLIST', payload: playlist })
          })
        }
      } catch (error) {
        console.error('Error loading saved state:', error)
      }
    }
  }, [])

  // Load local music files on mount
  useEffect(() => {
    const loadLocalMusic = async () => {
      try {
        const response = await localMusicService.getMusicFiles();
        if (response.files && response.files.length > 0) {
          dispatch({ type: 'SET_LOCAL_TRACKS', payload: response.files });
        }
      } catch (error) {
        console.error('Error loading local music:', error);
      }
    };

    loadLocalMusic();
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      currentView: state.currentView,
      favorites: state.favorites,
      playlists: state.playlists,
    }
    localStorage.setItem('kxmusic-state', JSON.stringify(stateToSave))
  }, [state.currentView, state.favorites, state.playlists])

  const value: MusicContextType = {
    state,
    dispatch,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addLocalTrack,
    removeLocalTrack,
    showUploader,
    hideUploader,
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
=======
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { localMusicService } from '@/services/localMusicService'

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  artwork: string
  url: string
  source: 'youtube' | 'spotify' | 'deezer' | 'local' | 'jamendo' | 'soundcloud'
  deezerId?: number
  fullTrack?: any
  youtubeId?: string
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  artwork?: string
}

interface MusicState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  playlists: Playlist[]
  favorites: Track[]
  searchResults: Track[]
  currentView: 'home' | 'search' | 'library' | 'playlists' | 'favorites' | 'local'
  localTracks: Track[]
  showUploader: boolean
}

type MusicAction =
  | { type: 'SET_CURRENT_TRACK'; payload: Track }
  | { type: 'SET_QUEUE'; payload: Track[] }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'ADD_TO_QUEUE'; payload: Track }
  | { type: 'REMOVE_FROM_QUEUE'; payload: string }
  | { type: 'ADD_PLAYLIST'; payload: Playlist }
  | { type: 'ADD_TO_FAVORITES'; payload: Track }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Track[] }
  | { type: 'SET_CURRENT_VIEW'; payload: MusicState['currentView'] }
  | { type: 'ADD_LOCAL_TRACK'; payload: Track }
  | { type: 'REMOVE_LOCAL_TRACK'; payload: string }
  | { type: 'SET_LOCAL_TRACKS'; payload: Track[] }
  | { type: 'SHOW_UPLOADER'; payload: boolean }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }

const initialState: MusicState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  playlists: [],
  favorites: [],
  searchResults: [],
  currentView: 'home',
  localTracks: [],
  showUploader: false,
}

function musicReducer(state: MusicState, action: MusicAction): MusicState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload }
    case 'SET_QUEUE':
      return { ...state, queue: action.payload }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] }
    case 'REMOVE_FROM_QUEUE':
      return { ...state, queue: state.queue.filter(track => track.id !== action.payload) }
    case 'ADD_PLAYLIST':
      return { ...state, playlists: [...state.playlists, action.payload] }
    case 'ADD_TO_FAVORITES':
      return { ...state, favorites: [...state.favorites, action.payload] }
    case 'REMOVE_FROM_FAVORITES':
      return { ...state, favorites: state.favorites.filter(track => track.id !== action.payload) }
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload }
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload }
    case 'ADD_LOCAL_TRACK':
      return { ...state, localTracks: [...state.localTracks, action.payload] }
    case 'REMOVE_LOCAL_TRACK':
      return { ...state, localTracks: state.localTracks.filter(track => track.id !== action.payload) }
    case 'SET_LOCAL_TRACKS':
      return { ...state, localTracks: action.payload }
    case 'SHOW_UPLOADER':
      return { ...state, showUploader: action.payload }
    case 'NEXT_TRACK':
      if (state.queue.length > 0) {
        const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id)
        const nextIndex = (currentIndex + 1) % state.queue.length
        return { ...state, currentTrack: state.queue[nextIndex] }
      }
      return state
    case 'PREVIOUS_TRACK':
      if (state.queue.length > 0) {
        const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : state.queue.length - 1
        return { ...state, currentTrack: state.queue[prevIndex] }
      }
      return state
    default:
      return state
  }
}

interface MusicContextType {
  state: MusicState
  dispatch: React.Dispatch<MusicAction>
  playTrack: (track: Track) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  addToFavorites: (track: Track) => void
  removeFromFavorites: (trackId: string) => void
  isFavorite: (trackId: string) => boolean
  addLocalTrack: (track: Track) => void
  removeLocalTrack: (trackId: string) => void
  showUploader: () => void
  hideUploader: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState)

  const playTrack = (track: Track) => {
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track })
    dispatch({ type: 'SET_PLAYING', payload: true })
  }

  const togglePlay = () => {
    dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying })
  }

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' })
  }

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' })
  }

  const addToFavorites = (track: Track) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: track })
  }

  const removeFromFavorites = (trackId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: trackId })
  }

  const isFavorite = (trackId: string) => {
    return state.favorites.some(track => track.id === trackId)
  }

  const addLocalTrack = (track: Track) => {
    dispatch({ type: 'ADD_LOCAL_TRACK', payload: track })
  }

  const removeLocalTrack = (trackId: string) => {
    dispatch({ type: 'REMOVE_LOCAL_TRACK', payload: trackId })
  }

  const showUploader = () => {
    dispatch({ type: 'SHOW_UPLOADER', payload: true })
  }

  const hideUploader = () => {
    dispatch({ type: 'SHOW_UPLOADER', payload: false })
  }

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('kxmusic-state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        // Only restore non-audio related state
        dispatch({ type: 'SET_CURRENT_VIEW', payload: parsed.currentView || 'home' })
        if (parsed.favorites) {
          parsed.favorites.forEach((track: Track) => {
            dispatch({ type: 'ADD_TO_FAVORITES', payload: track })
          })
        }
        if (parsed.playlists) {
          parsed.playlists.forEach((playlist: Playlist) => {
            dispatch({ type: 'ADD_PLAYLIST', payload: playlist })
          })
        }
      } catch (error) {
        console.error('Error loading saved state:', error)
      }
    }
  }, [])

  // Load local music files on mount
  useEffect(() => {
    const loadLocalMusic = async () => {
      try {
        const response = await localMusicService.getMusicFiles();
        if (response.files && response.files.length > 0) {
          dispatch({ type: 'SET_LOCAL_TRACKS', payload: response.files });
        }
      } catch (error) {
        console.error('Error loading local music:', error);
      }
    };

    loadLocalMusic();
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      currentView: state.currentView,
      favorites: state.favorites,
      playlists: state.playlists,
    }
    localStorage.setItem('kxmusic-state', JSON.stringify(stateToSave))
  }, [state.currentView, state.favorites, state.playlists])

  const value: MusicContextType = {
    state,
    dispatch,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addLocalTrack,
    removeLocalTrack,
    showUploader,
    hideUploader,
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 