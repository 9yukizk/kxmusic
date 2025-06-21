<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { ArtworkService } from '@/services/artworkService';
import { Track } from '@/contexts/MusicContext';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.\s-]/g, '_');
    const trackId = `${timestamp}_${originalName}`;
    
    // Subir archivo a Vercel Blob
    const blob = await put(trackId, file, {
      access: 'public',
      contentType: file.type,
    });

    // Extraer metadatos del nombre del archivo
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const parts = nameWithoutExt.split(' - ');
    
    let artist = 'Unknown Artist';
    let title = nameWithoutExt;
    
    if (parts.length >= 2) {
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }

    // Por ahora, no manejaremos la carátula aquí para simplificar
    // Se puede implementar un sistema donde el cliente la pida después
    
    const newTrack: Track = {
      id: trackId,
      title,
      artist,
      album: 'Local Uploads',
      duration: 0, // El cliente debería determinar esto
      artwork: '/default-album-cover.jpg', // Carátula por defecto
      url: blob.url, // URL directa desde Vercel Blob
      source: 'local'
    };

    // Guardar metadatos en Vercel KV
    // Usamos una lista para mantener el orden de subida
    await kv.lpush('local_tracks', newTrack);

    return NextResponse.json({
      success: true,
      file: newTrack
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
=======
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { ArtworkService } from '@/services/artworkService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only audio files are allowed.' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'uploads', 'music');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    const filePath = join(uploadDir, fileName);

    // Convertir File a Buffer y guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Extraer metadatos del nombre del archivo
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const parts = nameWithoutExt.split(' - ');
    
    let artist = 'Unknown Artist';
    let title = nameWithoutExt;
    
    if (parts.length >= 2) {
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }

    // Buscar y guardar la carátula automáticamente
    const trackId = timestamp.toString();
    const artworkUrl = await ArtworkService.fetchAndSaveArtwork(artist, title, trackId);

    return NextResponse.json({
      success: true,
      file: {
        id: trackId,
        title,
        artist,
        filename: fileName,
        url: `/api/music/${fileName}`,
        artwork: artworkUrl || 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Music',
        duration: 0, // Se calculará después
        source: 'local'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 