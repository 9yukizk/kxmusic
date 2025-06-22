
import { Track } from '@/contexts/MusicContext'

const JAMENDO_CLIENT_ID = 'YOUR_JAMENDO_CLIENT_ID' // Regístrate en https://developer.jamendo.com/v3.0
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0'

export interface JamendoTrack {
  id: string
  name: string
  duration: number
  artist_id: string
  artist_name: string
  album_name: string
  album_image: string
  audio: string
}

export class JamendoService {
  static async searchTracks(query: string): Promise<Track[]> {
    try {
      const url = `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&namesearch=${encodeURIComponent(query)}&include=musicinfo+stats+lyrics`;
      const response = await fetch(url)
      const data = await response.json()
      return data.results.map((track: JamendoTrack) => ({
        id: `jamendo_${track.id}`,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: track.duration,
        artwork: track.album_image,
        url: track.audio,
        source: 'jamendo' as const,
        jamendoId: track.id,
        fullTrack: track
      }))
    } catch (error) {
      console.error('Jamendo search error:', error)
      return []
    }
  }

import { Track } from '@/contexts/MusicContext'

const JAMENDO_CLIENT_ID = 'YOUR_JAMENDO_CLIENT_ID' // Regístrate en https://developer.jamendo.com/v3.0
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0'

export interface JamendoTrack {
  id: string
  name: string
  duration: number
  artist_id: string
  artist_name: string
  album_name: string
  album_image: string
  audio: string
}

export class JamendoService {
  static async searchTracks(query: string): Promise<Track[]> {
    try {
      const url = `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&namesearch=${encodeURIComponent(query)}&include=musicinfo+stats+lyrics`;
      const response = await fetch(url)
      const data = await response.json()
      return data.results.map((track: JamendoTrack) => ({
        id: `jamendo_${track.id}`,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: track.duration,
        artwork: track.album_image,
        url: track.audio,
        source: 'jamendo' as const,
        jamendoId: track.id,
        fullTrack: track
      }))
    } catch (error) {
      console.error('Jamendo search error:', error)
      return []
    }
  }
} 