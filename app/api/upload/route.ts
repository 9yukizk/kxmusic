import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
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
} 