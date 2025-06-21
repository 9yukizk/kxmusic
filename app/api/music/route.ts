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
} 