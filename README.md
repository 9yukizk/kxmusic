# 🎵 KXMusic - Aplicación de Música Futurista

**¡Aplicación completamente funcional y lista para usar!** ✨

Una aplicación web moderna y futurista para reproducir música, con un diseño inspirado en Spotify pero con una paleta de colores neón oscura y funcionalidades avanzadas.

## 🚀 Características

### 🎵 Reproducción de Música
- **Múltiples fuentes**: YouTube, SoundCloud, Jamendo, y música local
- **Reproducción en segundo plano**: Escucha música mientras navegas
- **Control de volumen**: Ajusta el volumen con controles intuitivos
- **Barra de progreso**: Visualiza el progreso de la canción actual

### 📁 Música Local
- **Subida de archivos**: Arrastra y suelta archivos de música desde tu dispositivo
- **Formatos soportados**: MP3, WAV, FLAC, M4A, OGG (hasta 50MB)
- **Detección automática**: La app detecta artista y título del nombre del archivo
- **Carátulas automáticas**: Busca y descarga automáticamente las carátulas de Last.fm
- **Almacenamiento persistente**: Los archivos se guardan en el servidor
- **Acceso desde cualquier dispositivo**: Sube desde móvil o PC, accede desde cualquier lugar

### 🎨 Diseño Futurista
- **Paleta de colores neón**: Azul, cian, púrpura sobre fondo oscuro
- **Animaciones suaves**: Transiciones fluidas con Framer Motion
- **Diseño responsivo**: Funciona perfectamente en móvil y desktop
- **Efectos visuales**: Fondos borrosos, efectos de hover, gradientes

### 🔍 Búsqueda y Organización
- **Búsqueda global**: Encuentra música en todas las fuentes
- **Favoritos**: Marca y organiza tus canciones favoritas
- **Biblioteca personal**: Organiza tu música local
- **Vistas múltiples**: Home, búsqueda, biblioteca, favoritos, música local

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**
```bash
git clone <tu-repositorio>
cd kxmusic
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto:
```env
# YouTube Data API (opcional, para búsquedas en YouTube)
YOUTUBE_API_KEY=tu_api_key_de_youtube

# Jamendo API (opcional, para música gratuita)
JAMENDO_CLIENT_ID=tu_client_id_de_jamendo

# Last.fm API (opcional, para carátulas automáticas)
LASTFM_API_KEY=tu_api_key_de_lastfm
```

4. **Ejecuta el servidor de desarrollo**
```bash
npm run dev
```

5. **Abre tu navegador**
Ve a `http://localhost:3000`

## 📱 Uso

### Subir Música Local

1. **Desde el botón flotante**: Haz clic en el botón de subida (ícono de upload) en la esquina inferior derecha
2. **Arrastra archivos**: Arrastra archivos de música directamente al área de subida
3. **Selecciona archivos**: O haz clic en "selecciona archivos" para elegir desde tu dispositivo
4. **Formato recomendado**: Nombra tus archivos como "Artista - Título" para mejor detección
5. **Carátulas automáticas**: La app buscará automáticamente la carátula en Last.fm

### Navegación

- **Home**: Descubre música trending y recomendada
- **Búsqueda**: Busca música en todas las fuentes
- **Mi Música**: Accede a tu biblioteca local
- **Favoritos**: Tus canciones marcadas como favoritas
- **Biblioteca**: Tu colección personal

### Reproducción

- **Play/Pause**: Controla la reproducción desde el reproductor inferior
- **Siguiente/Anterior**: Navega entre canciones
- **Volumen**: Ajusta el volumen con el slider
- **Progreso**: Arrastra en la barra de progreso para saltar

## 🏗️ Arquitectura

### Tecnologías Utilizadas
- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, CSS Modules
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Estado**: React Context + useReducer
- **APIs**: YouTube Data API, SoundCloud API, Jamendo API, Last.fm API

### Estructura del Proyecto
```
kxmusic/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── upload/        # Subida de archivos
│   │   ├── music/         # Servir archivos de música
│   │   └── artwork/       # Servir carátulas
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── AudioPlayer.tsx    # Reproductor de audio nativo
│   ├── MusicPlayer.tsx    # Reproductor principal
│   ├── MusicUploader.tsx  # Componente de subida
│   ├── Sidebar.tsx        # Barra lateral
│   └── ...
├── contexts/              # Contextos de React
│   └── MusicContext.tsx   # Estado global de música
├── services/              # Servicios de API
│   ├── localMusicService.ts
│   ├── artworkService.ts  # Servicio de carátulas
│   ├── jamendoService.ts
│   └── ...
├── uploads/               # Archivos subidos (no en git)
│   ├── music/             # Archivos de música
│   └── artwork/           # Carátulas descargadas
└── public/                # Archivos estáticos
```

## 🔧 Configuración Avanzada

### APIs Opcionales

#### YouTube Data API
Para búsquedas en YouTube:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita YouTube Data API v3
3. Crea una API key
4. Añade `YOUTUBE_API_KEY=tu_key` a `.env.local`

#### Jamendo API
Para música gratuita:
1. Regístrate en [Jamendo](https://developer.jamendo.com/)
2. Obtén tu Client ID
3. Añade `JAMENDO_CLIENT_ID=tu_id` a `.env.local`

#### Last.fm API
Para carátulas automáticas:
1. Regístrate en [Last.fm](https://www.last.fm/api)
2. Solicita una API key
3. Añade `LASTFM_API_KEY=tu_key` a `.env.local`

### Personalización

#### Colores
Modifica los colores en `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      'neon-blue': '#00d4ff',
      'neon-cyan': '#00ffff',
      'neon-purple': '#8b5cf6',
      // ...
    }
  }
}
```

#### Fuentes
Cambia las fuentes en `app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Proveedores
- **Netlify**: Compatible con Next.js
- **Railway**: Soporte para Node.js
- **Heroku**: Configuración manual requerida

## 📝 Notas Importantes

### Limitaciones
- **YouTube**: No permite reproducción en segundo plano (limitación de la API)
- **Tamaño de archivos**: Máximo 50MB por archivo
- **Formatos**: Solo archivos de audio soportados
- **Carátulas**: Si no se encuentra en Last.fm, se genera una por defecto

### Legalidad
- **Música local**: Solo para uso personal
- **APIs públicas**: Usa solo música gratuita y legal
- **Derechos de autor**: Respeta los derechos de autor

### Rendimiento
- **Caché**: Los archivos se cachean por 1 año
- **Compresión**: Los archivos se sirven optimizados
- **Lazy loading**: Las imágenes se cargan bajo demanda

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa los issues existentes
2. Crea un nuevo issue con detalles
3. Incluye logs de error si aplica

---

**¡Disfruta de tu música con estilo futurista! 🎵✨** 