<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Leer toda la lista de canciones desde Vercel KV
    const musicFiles = await kv.lrange('local_tracks', 0, -1);
    
    return NextResponse.json({ files: musicFiles });

  } catch (error) {
    console.error('Error fetching music from KV:', error);
    return NextResponse.json(
      { files: [], error: 'Failed to fetch music files' },
      { status: 500 }
    );
  }
=======
import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { ArtworkService } from '@/services/artworkService';

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'uploads', 'music');
    
    // Verificar que el directorio existe
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }

    // Leer todos los archivos del directorio
    const files = await readdir(uploadDir);
    const musicFiles = [];

    for (const filename of files) {
      const filePath = join(uploadDir, filename);
      const fileStats = await stat(filePath);
      
      // Solo incluir archivos (no directorios)
      if (fileStats.isFile()) {
        // Extraer metadatos del nombre del archivo
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        const parts = nameWithoutExt.split('_');
        
        // El primer elemento es el timestamp, el resto es el nombre original
        const originalName = parts.slice(1).join('_');
        const nameParts = originalName.split(' - ');
        
        let artist = 'Unknown Artist';
        let title = originalName;
        
        if (nameParts.length >= 2) {
          artist = nameParts[0].trim();
          title = nameParts.slice(1).join(' - ').trim();
        }

        const trackId = parts[0]; // timestamp como ID

        // Obtener la carátula
        const artworkUrl = await ArtworkService.getArtworkUrl(trackId);

        musicFiles.push({
          id: trackId,
          title,
          artist,
          filename,
          url: `/api/music/${filename}`,
          artwork: artworkUrl || 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Music',
          duration: 0, // Se calculará después
          source: 'local',
          size: fileStats.size,
          uploadedAt: new Date(parseInt(parts[0])).toISOString()
        });
      }
    }

    // Ordenar por fecha de subida (más reciente primero)
    musicFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ files: musicFiles });

  } catch (error) {
    console.error('Error listing music files:', error);
    return NextResponse.json(
      { error: 'Failed to list music files' },
      { status: 500 }
    );
  }
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 