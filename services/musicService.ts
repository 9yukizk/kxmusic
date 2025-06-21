import { Track } from '@/contexts/MusicContext'

// YouTube API integration
const YOUTUBE_API_KEY = 'AIzaSyBuc6oQel8cXd-cU5_Rbph189EGk67a-cE'

interface YouTubeSearchResult {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      high: {
        url: string
      }
    }
    publishedAt: string
  }
}

interface YouTubeSearchResponse {
  items: YouTubeSearchResult[]
}

// Mock data for demonstration - in a real app, you'd use actual APIs
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    artwork: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
    source: 'youtube'
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    artwork: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    source: 'youtube'
  },
  {
    id: '3',
    title: 'Dance Monkey',
    artist: 'Tones and I',
    album: 'The Kids Are Coming',
    duration: 209,
    artwork: 'https://i.scdn.co/image/ab67616d0000b2732c8a11e48c91a1c3c5c5c5c5',
    url: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
    source: 'youtube'
  },
  {
    id: '4',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    album: 'Uptown Special',
    duration: 270,
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a1c3c5c5c5c5c',
    url: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    source: 'youtube'
  },
  {
    id: '5',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'Vida',
    duration: 229,
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a1c3c5c5c5c5d',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    source: 'youtube'
  },
  {
    id: '6',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'When We All Fall Asleep, Where Do We Go?',
    duration: 194,
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a1c3c5c5c5c5e',
    url: 'https://www.youtube.com/watch?v=DyDfgMOUjCI',
    source: 'youtube'
  },
  {
    id: '7',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a1c3c5c5c5c5f',
    url: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw',
    source: 'youtube'
  },
  {
    id: '8',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    duration: 141,
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a1c3c5c5c5c5g',
    url: 'https://www.youtube.com/watch?v=kTJczUoc26U',
    source: 'youtube'
  }
]

export class MusicService {
  static async searchTracks(query: string): Promise<Track[]> {
    try {
      // Search YouTube
      const youtubeResults = await this.searchYouTube(query)
      
      // Combine with mock data for variety
      const mockResults = this.getMockTracks().filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      )
      
      return [...youtubeResults, ...mockResults.slice(0, 3)]
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock data
      return this.searchTracks(query)
    }
  }

  static async searchYouTube(query: string): Promise<Track[]> {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query + ' music')}&key=${YOUTUBE_API_KEY}&maxResults=10&videoCategoryId=10`
    
    const response = await fetch(url)
    const data: YouTubeSearchResponse = await response.json()
    
    return data.items.map((item) => ({
      id: item.id.videoId,
      title: this.cleanTitle(item.snippet.title),
      artist: item.snippet.channelTitle,
      album: 'YouTube',
      duration: 0, // We'll get this separately if needed
      artwork: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      source: 'youtube' as const
    }))
  }

  static cleanTitle(title: string): string {
    // Remove common YouTube suffixes
    return title
      .replace(/\(Official Music Video\)/gi, '')
      .replace(/\(Official Video\)/gi, '')
      .replace(/\(Lyrics\)/gi, '')
      .replace(/\(Audio\)/gi, '')
      .replace(/\[Official Music Video\]/gi, '')
      .replace(/\[Official Video\]/gi, '')
      .replace(/\[Lyrics\]/gi, '')
      .replace(/\[Audio\]/gi, '')
      .trim()
  }

  static async getTrendingTracks(): Promise<Track[]> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=10&key=${YOUTUBE_API_KEY}&maxResults=6`
      
      const response = await fetch(url)
      const data = await response.json()
      
      return data.items.map((item: any) => ({
        id: item.id,
        title: this.cleanTitle(item.snippet.title),
        artist: item.snippet.channelTitle,
        album: 'YouTube Trending',
        duration: 0,
        artwork: item.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        source: 'youtube' as const
      }))
    } catch (error) {
      console.error('Error fetching trending:', error)
      return this.getMockTracks().slice(0, 6)
    }
  }

  static async getRecommendedTracks(): Promise<Track[]> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=music&key=${YOUTUBE_API_KEY}&maxResults=8&videoCategoryId=10&order=relevance`
      
      const response = await fetch(url)
      const data = await response.json()
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: this.cleanTitle(item.snippet.title),
        artist: item.snippet.channelTitle,
        album: 'YouTube',
        duration: 0,
        artwork: item.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        source: 'youtube' as const
      }))
    } catch (error) {
      console.error('Error fetching recommended:', error)
      return this.getMockTracks().slice(2, 8)
    }
  }

  static async getTrackById(id: string): Promise<Track | null> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${YOUTUBE_API_KEY}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0]
        return {
          id: item.id,
          title: this.cleanTitle(item.snippet.title),
          artist: item.snippet.channelTitle,
          album: 'YouTube',
          duration: 0,
          artwork: item.snippet.thumbnails.high.url,
          url: `https://www.youtube.com/watch?v=${item.id}`,
          source: 'youtube' as const
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching track:', error)
      return this.getMockTracks().find(track => track.id === id) || null
    }
  }

  // Get streaming URL (this is where the magic happens)
  static async getStreamingUrl(track: Track): Promise<string> {
    if (track.source === 'youtube') {
      // For YouTube, we'll use a proxy service or embed
      // Note: This is for educational purposes only
      const videoId = this.extractYouTubeId(track.url)
      if (videoId) {
        // Option 1: Use YouTube embed (legal)
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`
        
        // Option 2: Use a proxy service (requires backend)
        // return `https://your-backend.com/stream?videoId=${videoId}`
      }
    }
    
    return track.url
  }

  // Mock data for fallback
  private static getMockTracks(): Track[] {
    return [
      {
        id: '1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        artwork: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
        source: 'youtube'
      },
      {
        id: '2',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        duration: 233,
        artwork: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
        source: 'youtube'
      },
      {
        id: '3',
        title: 'Dance Monkey',
        artist: 'Tones and I',
        album: 'The Kids Are Coming',
        duration: 209,
        artwork: 'https://i.scdn.co/image/ab67616d0000b2732c8a11e48c91a1c3c5c5c5c5',
        url: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
        source: 'youtube'
      }
    ]
  }

  // Utility functions
  static extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  static generateThumbnailUrl(youtubeId: string): string {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }
}

// Utility functions for audio processing
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export const generateThumbnailUrl = (youtubeId: string): string => {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
} 