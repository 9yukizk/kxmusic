
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface LastFmTrack {
  name: string;
  artist: {
    name: string;
  };
  album?: {
    image: Array<{
      size: string;
      '#text': string;
    }>;
  };
}

interface LastFmResponse {
  track?: LastFmTrack;
  results?: {
    trackmatches?: {
      track?: LastFmTrack[];
    };
  };
}

export class ArtworkService {
  private static readonly LASTFM_API_KEY = process.env.LASTFM_API_KEY || 'default_key';
  private static readonly ARTWORK_DIR = join(process.cwd(), 'uploads', 'artwork');

  /**
   * Busca y descarga la carátula de una canción
   */
  static async fetchAndSaveArtwork(artist: string, title: string, trackId: string): Promise<string | null> {
    try {
      // Crear directorio si no existe
      if (!existsSync(this.ARTWORK_DIR)) {
        await mkdir(this.ARTWORK_DIR, { recursive: true });
      }

      // Por ahora, generar solo carátulas por defecto para evitar errores de API
      return this.generateDefaultArtwork(artist, title, trackId);
    } catch (error) {
      console.error('Error fetching artwork:', error);
      return this.generateDefaultArtwork(artist, title, trackId);
    }
  }

  /**
   * Busca la carátula en Last.fm
   */
  private static async searchLastFmArtwork(artist: string, title: string): Promise<string | null> {
    try {
      // Primero intentar buscar por artista y título
      const searchUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&api_key=${this.LASTFM_API_KEY}&format=json`;
      
      const response = await fetch(searchUrl);
      const data: LastFmResponse = await response.json();

      if (data.track?.album?.image) {
        const largeImage = data.track.album.image.find(img => img.size === 'large');
        if (largeImage && largeImage['#text']) {
          return largeImage['#text'];
        }
      }

      // Si no se encuentra, buscar en los resultados de búsqueda
      const searchResultsUrl = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&api_key=${this.LASTFM_API_KEY}&format=json`;
      
      const searchResponse = await fetch(searchResultsUrl);
      const searchData: LastFmResponse = await searchResponse.json();

      if (searchData.results?.trackmatches?.track && searchData.results.trackmatches.track.length > 0) {
        const firstTrack = searchData.results.trackmatches.track[0];
        if (firstTrack.album?.image) {
          const largeImage = firstTrack.album.image.find(img => img.size === 'large');
          if (largeImage && largeImage['#text']) {
            return largeImage['#text'];
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error searching Last.fm:', error);
      return null;
    }
  }

  /**
   * Descarga una imagen desde una URL
   */
  private static async downloadImage(url: string): Promise<Buffer | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }

  /**
   * Genera una carátula por defecto con el nombre del artista y título
   */
  private static async generateDefaultArtwork(artist: string, title: string, trackId: string): Promise<string> {
    try {
      // Crear una imagen SVG simple con el texto
      const svg = `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="300" height="300" fill="url(#grad)"/>
          <text x="150" y="120" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${this.escapeXml(artist)}</text>
          <text x="150" y="150" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.8)">${this.escapeXml(title)}</text>
          <circle cx="150" cy="200" r="30" fill="none" stroke="white" stroke-width="2"/>
          <polygon points="140,190 140,210 160,200" fill="white"/>
        </svg>
      `;

      const filename = `${trackId}.svg`;
      const filepath = join(this.ARTWORK_DIR, filename);
      await writeFile(filepath, svg, 'utf-8');

      return `/api/artwork/${filename}`;
    } catch (error) {
      console.error('Error generating default artwork:', error);
      // Retornar una URL por defecto
      return 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Music';
    }
  }

  /**
   * Escapa caracteres especiales en XML
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Obtiene la carátula de una canción por ID
   */
  static async getArtworkUrl(trackId: string): Promise<string | null> {
    try {
      const filename = `${trackId}.jpg`;
      const filepath = join(this.ARTWORK_DIR, filename);
      
      if (existsSync(filepath)) {
        return `/api/artwork/${filename}`;
      }

      // Intentar con SVG
      const svgFilename = `${trackId}.svg`;
      const svgFilepath = join(this.ARTWORK_DIR, svgFilename);
      
      if (existsSync(svgFilepath)) {
        return `/api/artwork/${svgFilename}`;
      }

      return null;
    } catch (error) {
      console.error('Error getting artwork URL:', error);
      return null;
    }
  }

  async getArtwork(artist: string, title: string): Promise<string> {
    try {
      // Si no hay API key, usar carátula por defecto
      if (!process.env.LASTFM_API_KEY || process.env.LASTFM_API_KEY === 'default_key') {
        return '/default-album-cover.jpg' // Carátula por defecto
      }

      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&api_key=${process.env.LASTFM_API_KEY}&format=json`
      )
      
      if (!response.ok) {
        return '/default-album-cover.jpg'
      }

      const data = await response.json()
      
      if (data.track && data.track.album && data.track.album.image) {
        const images = data.track.album.image
        const largeImage = images.find((img: any) => img.size === 'extralarge')
        return largeImage ? largeImage['#text'] : '/default-album-cover.jpg'
      }
      
      return '/default-album-cover.jpg'
    } catch (error) {
      console.error('Error fetching artwork:', error)
      return '/default-album-cover.jpg'
    }
  }

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface LastFmTrack {
  name: string;
  artist: {
    name: string;
  };
  album?: {
    image: Array<{
      size: string;
      '#text': string;
    }>;
  };
}

interface LastFmResponse {
  track?: LastFmTrack;
  results?: {
    trackmatches?: {
      track?: LastFmTrack[];
    };
  };
}

export class ArtworkService {
  private static readonly LASTFM_API_KEY = process.env.LASTFM_API_KEY || 'default_key';
  private static readonly ARTWORK_DIR = join(process.cwd(), 'uploads', 'artwork');

  /**
   * Busca y descarga la carátula de una canción
   */
  static async fetchAndSaveArtwork(artist: string, title: string, trackId: string): Promise<string | null> {
    try {
      // Crear directorio si no existe
      if (!existsSync(this.ARTWORK_DIR)) {
        await mkdir(this.ARTWORK_DIR, { recursive: true });
      }

      // Buscar en Last.fm
      const artworkUrl = await this.searchLastFmArtwork(artist, title);
      
      if (!artworkUrl) {
        // Si no se encuentra, generar una carátula por defecto
        return this.generateDefaultArtwork(artist, title, trackId);
      }

      // Descargar la imagen
      const imageBuffer = await this.downloadImage(artworkUrl);
      if (!imageBuffer) {
        return this.generateDefaultArtwork(artist, title, trackId);
      }

      // Guardar la imagen
      const filename = `${trackId}.jpg`;
      const filepath = join(this.ARTWORK_DIR, filename);
      await writeFile(filepath, imageBuffer);

      return `/api/artwork/${filename}`;
    } catch (error) {
      console.error('Error fetching artwork:', error);
      return this.generateDefaultArtwork(artist, title, trackId);
    }
  }

  /**
   * Busca la carátula en Last.fm
   */
  private static async searchLastFmArtwork(artist: string, title: string): Promise<string | null> {
    try {
      // Primero intentar buscar por artista y título
      const searchUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&api_key=${this.LASTFM_API_KEY}&format=json`;
      
      const response = await fetch(searchUrl);
      const data: LastFmResponse = await response.json();

      if (data.track?.album?.image) {
        const largeImage = data.track.album.image.find(img => img.size === 'large');
        if (largeImage && largeImage['#text']) {
          return largeImage['#text'];
        }
      }

      // Si no se encuentra, buscar en los resultados de búsqueda
      const searchResultsUrl = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&api_key=${this.LASTFM_API_KEY}&format=json`;
      
      const searchResponse = await fetch(searchResultsUrl);
      const searchData: LastFmResponse = await searchResponse.json();

      if (searchData.results?.trackmatches?.track && searchData.results.trackmatches.track.length > 0) {
        const firstTrack = searchData.results.trackmatches.track[0];
        if (firstTrack.album?.image) {
          const largeImage = firstTrack.album.image.find(img => img.size === 'large');
          if (largeImage && largeImage['#text']) {
            return largeImage['#text'];
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error searching Last.fm:', error);
      return null;
    }
  }

  /**
   * Descarga una imagen desde una URL
   */
  private static async downloadImage(url: string): Promise<Buffer | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }

  /**
   * Genera una carátula por defecto con el nombre del artista y título
   */
  private static async generateDefaultArtwork(artist: string, title: string, trackId: string): Promise<string> {
    try {
      // Crear una imagen SVG simple con el texto
      const svg = `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="300" height="300" fill="url(#grad)"/>
          <text x="150" y="120" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${this.escapeXml(artist)}</text>
          <text x="150" y="150" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.8)">${this.escapeXml(title)}</text>
          <circle cx="150" cy="200" r="30" fill="none" stroke="white" stroke-width="2"/>
          <polygon points="140,190 140,210 160,200" fill="white"/>
        </svg>
      `;

      const filename = `${trackId}.svg`;
      const filepath = join(this.ARTWORK_DIR, filename);
      await writeFile(filepath, svg, 'utf-8');

      return `/api/artwork/${filename}`;
    } catch (error) {
      console.error('Error generating default artwork:', error);
      // Retornar una URL por defecto
      return 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Music';
    }
  }

  /**
   * Escapa caracteres especiales en XML
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Obtiene la carátula de una canción por ID
   */
  static async getArtworkUrl(trackId: string): Promise<string | null> {
    try {
      const filename = `${trackId}.jpg`;
      const filepath = join(this.ARTWORK_DIR, filename);
      
      if (existsSync(filepath)) {
        return `/api/artwork/${filename}`;
      }

      // Intentar con SVG
      const svgFilename = `${trackId}.svg`;
      const svgFilepath = join(this.ARTWORK_DIR, svgFilename);
      
      if (existsSync(svgFilepath)) {
        return `/api/artwork/${svgFilename}`;
      }

      return null;
    } catch (error) {
      console.error('Error getting artwork URL:', error);
      return null;
    }
  }
} 