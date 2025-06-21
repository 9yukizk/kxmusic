// Script de prueba para el servicio de carátulas
// Ejecutar con: node scripts/test-artwork.js

const { ArtworkService } = require('../services/artworkService');

async function testArtworkService() {
  console.log('🎵 Probando el servicio de carátulas...\n');

  try {
    // Test 1: Buscar carátula de una canción conocida
    console.log('1. Buscando carátula para "The Weeknd - Blinding Lights"...');
    const artwork1 = await ArtworkService.fetchAndSaveArtwork('The Weeknd', 'Blinding Lights', 'test1');
    console.log('✅ Resultado:', artwork1);

    // Test 2: Buscar carátula de otra canción
    console.log('\n2. Buscando carátula para "Ed Sheeran - Shape of You"...');
    const artwork2 = await ArtworkService.fetchAndSaveArtwork('Ed Sheeran', 'Shape of You', 'test2');
    console.log('✅ Resultado:', artwork2);

    // Test 3: Probar con artista desconocido
    console.log('\n3. Probando con artista desconocido...');
    const artwork3 = await ArtworkService.fetchAndSaveArtwork('Unknown Artist', 'Unknown Song', 'test3');
    console.log('✅ Resultado:', artwork3);

    console.log('\n🎉 ¡Todas las pruebas completadas!');
    console.log('📁 Revisa la carpeta uploads/artwork/ para ver las carátulas generadas.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

// Ejecutar las pruebas
testArtworkService(); 