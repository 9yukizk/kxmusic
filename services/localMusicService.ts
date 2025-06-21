<<<<<<< HEAD
import { Track } from '@/contexts/MusicContext';

export interface UploadResponse {
  success: boolean;
  file: Track;
  error?: string;
}

export interface MusicFilesResponse {
  files: Track[];
  error?: string;
}

export const localMusicService = {
  // Subir un archivo de música
  async uploadMusicFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        file: {} as Track,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Obtener todos los archivos de música subidos
  async getMusicFiles(): Promise<MusicFilesResponse> {
    try {
      const response = await fetch('/api/music');
      
      if (!response.ok) {
        throw new Error('Failed to fetch music files');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching music files:', error);
      return {
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Buscar en la música local
  async searchLocalMusic(query: string): Promise<Track[]> {
    try {
      const { files } = await this.getMusicFiles();
      
      if (!query.trim()) {
        return files;
      }

      const searchTerm = query.toLowerCase();
      return files.filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching local music:', error);
      return [];
    }
  },

  // Obtener una canción específica por ID
  async getTrackById(id: string): Promise<Track | null> {
    try {
      const { files } = await this.getMusicFiles();
      return files.find(track => track.id === id) || null;
    } catch (error) {
      console.error('Error getting track by ID:', error);
      return null;
    }
  },

  // Eliminar un archivo de música (opcional, para implementar después)
  async deleteMusicFile(filename: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/music/${filename}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting music file:', error);
      return false;
    }
  }
=======
import { Track } from '@/contexts/MusicContext';

export interface UploadResponse {
  success: boolean;
  file: Track;
  error?: string;
}

export interface MusicFilesResponse {
  files: Track[];
  error?: string;
}

export const localMusicService = {
  // Subir un archivo de música
  async uploadMusicFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        file: {} as Track,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Obtener todos los archivos de música subidos
  async getMusicFiles(): Promise<MusicFilesResponse> {
    try {
      const response = await fetch('/api/music');
      
      if (!response.ok) {
        throw new Error('Failed to fetch music files');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching music files:', error);
      return {
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Buscar en la música local
  async searchLocalMusic(query: string): Promise<Track[]> {
    try {
      const { files } = await this.getMusicFiles();
      
      if (!query.trim()) {
        return files;
      }

      const searchTerm = query.toLowerCase();
      return files.filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching local music:', error);
      return [];
    }
  },

  // Obtener una canción específica por ID
  async getTrackById(id: string): Promise<Track | null> {
    try {
      const { files } = await this.getMusicFiles();
      return files.find(track => track.id === id) || null;
    } catch (error) {
      console.error('Error getting track by ID:', error);
      return null;
    }
  },

  // Eliminar un archivo de música (opcional, para implementar después)
  async deleteMusicFile(filename: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/music/${filename}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting music file:', error);
      return false;
    }
  }
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
}; 