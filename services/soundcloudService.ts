
import { Track } from '@/contexts/MusicContext'

const SOUNDCLOUD_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID' // Debes registrar tu app en https://soundcloud.com/you/apps
const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com'

export interface SoundCloudTrack {
  id: number
  title: string
  duration: number
  artwork_url: string | null
  stream_url: string
  user: {
    id: number
    username: string
    avatar_url: string | null
  }
}

export class SoundCloudService {
  static async searchTracks(query: string): Promise<Track[]> {
    try {
      const url = `${SOUNDCLOUD_API_URL}/tracks?q=${encodeURIComponent(query)}&client_id=${SOUNDCLOUD_CLIENT_ID}&limit=20`;
      const response = await fetch(url)
      const data: SoundCloudTrack[] = await response.json()
      return data.map((track) => ({
        id: `soundcloud_${track.id}`,
        title: track.title,
        artist: track.user.username,
        album: '',
        duration: Math.floor(track.duration / 1000),
        artwork: track.artwork_url || '',
        url: `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
        source: 'soundcloud' as const,
        soundcloudId: track.id,
        fullTrack: track
      }))
    } catch (error) {
      console.error('SoundCloud search error:', error)
      return []
    }
  }

import { Track } from '@/contexts/MusicContext'

const SOUNDCLOUD_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID' // Debes registrar tu app en https://soundcloud.com/you/apps
const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com'

export interface SoundCloudTrack {
  id: number
  title: string
  duration: number
  artwork_url: string | null
  stream_url: string
  user: {
    id: number
    username: string
    avatar_url: string | null
  }
}

export class SoundCloudService {
  static async searchTracks(query: string): Promise<Track[]> {
    try {
      const url = `${SOUNDCLOUD_API_URL}/tracks?q=${encodeURIComponent(query)}&client_id=${SOUNDCLOUD_CLIENT_ID}&limit=20`;
      const response = await fetch(url)
      const data: SoundCloudTrack[] = await response.json()
      return data.map((track) => ({
        id: `soundcloud_${track.id}`,
        title: track.title,
        artist: track.user.username,
        album: '',
        duration: Math.floor(track.duration / 1000),
        artwork: track.artwork_url || '',
        url: `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
        source: 'soundcloud' as const,
        soundcloudId: track.id,
        fullTrack: track
      }))
    } catch (error) {
      console.error('SoundCloud search error:', error)
      return []
    }
  }
} 