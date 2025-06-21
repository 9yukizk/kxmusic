<<<<<<< HEAD
# 🚀 Guía de Instalación - KX Music

## 📋 Prerrequisitos

### 1. Instalar Node.js

**Para Windows:**
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu terminal/PowerShell

**Verificar instalación:**
```bash
node --version
npm --version
```

### 2. Instalar Git (opcional pero recomendado)
1. Ve a [git-scm.com](https://git-scm.com/)
2. Descarga e instala Git para Windows
3. Configura tu nombre y email:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## 🛠️ Instalación del Proyecto

### Paso 1: Abrir Terminal
- Presiona `Windows + R`
- Escribe `powershell` y presiona Enter
- Navega a tu carpeta del proyecto:
```bash
cd C:\Users\19\Desktop\kxmusic
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Ejecutar en Desarrollo
```bash
npm run dev
```

### Paso 4: Abrir en Navegador
Ve a: `http://localhost:3000`

## 🌐 Opciones de Hosting Gratuito

### Opción 1: Vercel (Más Fácil)
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta con GitHub
3. Conecta tu repositorio
4. ¡Despliegue automático!

### Opción 2: Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra tu carpeta `kxmusic` al área de drop
3. ¡Listo!

### Opción 3: GitHub Pages
1. Sube tu código a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main
4. ¡Tu app estará en `tu-usuario.github.io/kxmusic`!

## 📱 Usar en iOS sin Hosting

### Método 1: PWA (Progressive Web App)
1. **Hacer la app PWA-ready:**
```bash
npm install next-pwa
```

2. **Configurar en `next.config.js`:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // tu configuración existente
})
```

3. **Instalar en iOS:**
   - Abrir Safari en tu iPhone/iPad
   - Ir a tu app (ej: `http://localhost:3000`)
   - Tocar el botón compartir (cuadrado con flecha)
   - Seleccionar "Añadir a pantalla de inicio"

### Método 2: Usar Localmente
1. **Encuentra tu IP local:**
```bash
ipconfig
```
Busca "IPv4 Address" (ej: 192.168.1.100)

2. **Ejecutar en red local:**
```bash
npm run dev -- -H 0.0.0.0
```

3. **Acceder desde iOS:**
   - En Safari, ve a: `http://192.168.1.100:3000`
   - Añade a pantalla de inicio

### Método 3: Usar ngrok (Túnel)
1. **Instalar ngrok:**
   - Ve a [ngrok.com](https://ngrok.com)
   - Descarga e instala
   - Crea cuenta gratuita

2. **Crear túnel:**
```bash
ngrok http 3000
```

3. **Usar la URL de ngrok en iOS**

## 🎵 Integración con APIs de Música

### YouTube API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita YouTube Data API v3
4. Crea credenciales (API Key)
5. Añade en `.env.local`:
```env
YOUTUBE_API_KEY=tu_api_key_aqui
```

### Spotify API
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva app
3. Obtén Client ID y Client Secret
4. Configura redirect URIs
5. Añade en `.env.local`:
```env
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
```

## 🔧 Solución de Problemas

### Error: "npm no se reconoce"
- Reinstala Node.js
- Reinicia tu terminal
- Verifica que Node.js esté en el PATH

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Error: "Cannot find module"
```bash
npm install
npm run dev
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de estar en la carpeta correcta
3. Revisa que todas las dependencias estén instaladas
4. Consulta el README.md principal

## 🎯 Próximos Pasos

1. **Personalizar colores** en `tailwind.config.js`
2. **Añadir más canciones** en `services/musicService.ts`
3. **Configurar APIs reales** para obtener música
4. **Desplegar en hosting** para acceso público
5. **Crear PWA** para uso en móviles

---

=======
# 🚀 Guía de Instalación - KX Music

## 📋 Prerrequisitos

### 1. Instalar Node.js

**Para Windows:**
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu terminal/PowerShell

**Verificar instalación:**
```bash
node --version
npm --version
```

### 2. Instalar Git (opcional pero recomendado)
1. Ve a [git-scm.com](https://git-scm.com/)
2. Descarga e instala Git para Windows
3. Configura tu nombre y email:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## 🛠️ Instalación del Proyecto

### Paso 1: Abrir Terminal
- Presiona `Windows + R`
- Escribe `powershell` y presiona Enter
- Navega a tu carpeta del proyecto:
```bash
cd C:\Users\19\Desktop\kxmusic
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Ejecutar en Desarrollo
```bash
npm run dev
```

### Paso 4: Abrir en Navegador
Ve a: `http://localhost:3000`

## 🌐 Opciones de Hosting Gratuito

### Opción 1: Vercel (Más Fácil)
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta con GitHub
3. Conecta tu repositorio
4. ¡Despliegue automático!

### Opción 2: Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra tu carpeta `kxmusic` al área de drop
3. ¡Listo!

### Opción 3: GitHub Pages
1. Sube tu código a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main
4. ¡Tu app estará en `tu-usuario.github.io/kxmusic`!

## 📱 Usar en iOS sin Hosting

### Método 1: PWA (Progressive Web App)
1. **Hacer la app PWA-ready:**
```bash
npm install next-pwa
```

2. **Configurar en `next.config.js`:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // tu configuración existente
})
```

3. **Instalar en iOS:**
   - Abrir Safari en tu iPhone/iPad
   - Ir a tu app (ej: `http://localhost:3000`)
   - Tocar el botón compartir (cuadrado con flecha)
   - Seleccionar "Añadir a pantalla de inicio"

### Método 2: Usar Localmente
1. **Encuentra tu IP local:**
```bash
ipconfig
```
Busca "IPv4 Address" (ej: 192.168.1.100)

2. **Ejecutar en red local:**
```bash
npm run dev -- -H 0.0.0.0
```

3. **Acceder desde iOS:**
   - En Safari, ve a: `http://192.168.1.100:3000`
   - Añade a pantalla de inicio

### Método 3: Usar ngrok (Túnel)
1. **Instalar ngrok:**
   - Ve a [ngrok.com](https://ngrok.com)
   - Descarga e instala
   - Crea cuenta gratuita

2. **Crear túnel:**
```bash
ngrok http 3000
```

3. **Usar la URL de ngrok en iOS**

## 🎵 Integración con APIs de Música

### YouTube API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita YouTube Data API v3
4. Crea credenciales (API Key)
5. Añade en `.env.local`:
```env
YOUTUBE_API_KEY=tu_api_key_aqui
```

### Spotify API
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva app
3. Obtén Client ID y Client Secret
4. Configura redirect URIs
5. Añade en `.env.local`:
```env
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
```

## 🔧 Solución de Problemas

### Error: "npm no se reconoce"
- Reinstala Node.js
- Reinicia tu terminal
- Verifica que Node.js esté en el PATH

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Error: "Cannot find module"
```bash
npm install
npm run dev
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de estar en la carpeta correcta
3. Revisa que todas las dependencias estén instaladas
4. Consulta el README.md principal

## 🎯 Próximos Pasos

1. **Personalizar colores** en `tailwind.config.js`
2. **Añadir más canciones** en `services/musicService.ts`
3. **Configurar APIs reales** para obtener música
4. **Desplegar en hosting** para acceso público
5. **Crear PWA** para uso en móviles

---

>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
**¡Tu aplicación de música futurista está lista! 🎵✨** 