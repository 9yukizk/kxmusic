import { Track } from '@/contexts/MusicContext'

const DEEZER_API_URL = 'https://api.deezer.com'

export interface DeezerTrack {
  id: number
  title: string
  title_short: string
  title_version: string
  link: string
  duration: number
  rank: number
  explicit_lyrics: boolean
  explicit_content_lyrics: number
  explicit_content_cover: number
  preview: string
  md5_image: string
  artist: {
    id: number
    name: string
    link: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
    picture_xl: string
    tracklist: string
    type: string
  }
  album: {
    id: number
    title: string
    cover: string
    cover_small: string
    cover_medium: string
    cover_big: string
    cover_xl: string
    md5_image: string
    tracklist: string
    type: string
  }
  type: string
}

export interface DeezerSearchResponse {
  data: DeezerTrack[]
  total: number
  next?: string
}

export class DeezerService {
  static async searchTracks(query: string): Promise<Track[]> {
    try {
      const response = await fetch(`${DEEZER_API_URL}/search?q=${encodeURIComponent(query)}`)
      const data: DeezerSearchResponse = await response.json()
      
      return data.data.map((deezerTrack) => ({
        id: `deezer_${deezerTrack.id}`,
        title: deezerTrack.title,
        artist: deezerTrack.artist.name,
        album: deezerTrack.album.title,
        duration: deezerTrack.duration,
        artwork: deezerTrack.album.cover_medium,
        url: deezerTrack.preview, // 30-second preview
        source: 'deezer' as const,
        deezerId: deezerTrack.id,
        fullTrack: deezerTrack
      }))
    } catch (error) {
      console.error('Deezer search error:', error)
      return []
    }
  }

  static async getTrendingTracks(): Promise<Track[]> {
    try {
      const response = await fetch(`${DEEZER_API_URL}/chart`)
      const data = await response.json()
      
      return data.tracks.data.map((deezerTrack: DeezerTrack) => ({
        id: `deezer_${deezerTrack.id}`,
        title: deezerTrack.title,
        artist: deezerTrack.artist.name,
        album: deezerTrack.album.title,
        duration: deezerTrack.duration,
        artwork: deezerTrack.album.cover_medium,
        url: deezerTrack.preview,
        source: 'deezer' as const,
        deezerId: deezerTrack.id,
        fullTrack: deezerTrack
      }))
    } catch (error) {
      console.error('Deezer trending error:', error)
      return []
    }
  }

  static async getTrackById(id: string): Promise<Track | null> {
    try {
      const deezerId = id.replace('deezer_', '')
      const response = await fetch(`${DEEZER_API_URL}/track/${deezerId}`)
      const deezerTrack: DeezerTrack = await response.json()
      
      return {
        id: `deezer_${deezerTrack.id}`,
        title: deezerTrack.title,
        artist: deezerTrack.artist.name,
        album: deezerTrack.album.title,
        duration: deezerTrack.duration,
        artwork: deezerTrack.album.cover_medium,
        url: deezerTrack.preview,
        source: 'deezer' as const,
        deezerId: deezerTrack.id,
        fullTrack: deezerTrack
      }
    } catch (error) {
      console.error('Deezer track error:', error)
      return null
    }
  }

  // Get full track URL (requires Deezer Premium or alternative method)
  static async getFullTrackUrl(trackId: string): Promise<string | null> {
    // Note: This would require a backend service or premium account
    // For now, we'll use the preview URL
    return null
  }
} 