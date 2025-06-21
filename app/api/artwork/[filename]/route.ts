<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = join(process.cwd(), 'uploads', 'artwork', filename);

    // Verificar que el archivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Obtener información del archivo
    const fileStats = await stat(filePath);
    
    // Leer el archivo
    const fileBuffer = await readFile(filePath);

    // Determinar el tipo MIME basado en la extensión
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg'; // default
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    // Crear respuesta con headers apropiados para imágenes
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response;

  } catch (error) {
    console.error('Error serving artwork file:', error);
    return NextResponse.json(
      { error: 'Failed to serve artwork file' },
      { status: 500 }
    );
  }
=======
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = join(process.cwd(), 'uploads', 'artwork', filename);

    // Verificar que el archivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Obtener información del archivo
    const fileStats = await stat(filePath);
    
    // Leer el archivo
    const fileBuffer = await readFile(filePath);

    // Determinar el tipo MIME basado en la extensión
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg'; // default
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    // Crear respuesta con headers apropiados para imágenes
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response;

  } catch (error) {
    console.error('Error serving artwork file:', error);
    return NextResponse.json(
      { error: 'Failed to serve artwork file' },
      { status: 500 }
    );
  }
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
} 