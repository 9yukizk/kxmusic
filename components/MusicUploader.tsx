'use client'

import { useState, useRef } from 'react'
import { Upload, Music, X, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { localMusicService, UploadResponse } from '@/services/localMusicService'
import { useMusic } from '@/contexts/MusicContext'

interface UploadStatus {
  id: string
  file: File
  status: 'uploading' | 'success' | 'error'
  progress: number
  message?: string
}

export default function MusicUploader() {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addLocalTrack } = useMusic()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const newUploads: UploadStatus[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${file.name}`,
      file,
      status: 'uploading',
      progress: 0
    }))

    setUploadStatuses(prev => [...prev, ...newUploads])

    // Procesar cada archivo
    for (const upload of newUploads) {
      try {
        const result: UploadResponse = await localMusicService.uploadMusicFile(upload.file)
        
        if (result.success) {
          setUploadStatuses(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, status: 'success', progress: 100, message: 'Subido exitosamente' }
                : u
            )
          )
          
          // Agregar a la biblioteca
          addLocalTrack(result.file)
        } else {
          setUploadStatuses(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, status: 'error', progress: 0, message: result.error || 'Error al subir' }
                : u
            )
          )
        }
      } catch (error) {
        setUploadStatuses(prev => 
          prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'error', progress: 0, message: 'Error inesperado' }
              : u
          )
        )
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeUpload = (id: string) => {
    setUploadStatuses(prev => prev.filter(u => u.id !== id))
  }

  const clearAll = () => {
    setUploadStatuses([])
  }

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Upload className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Music className="w-6 h-6 text-purple-400" />
                  Subir Música
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Área de subida */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-purple-400 bg-purple-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  Arrastra archivos de música aquí o
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  selecciona archivos
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  MP3, WAV, FLAC, M4A, OGG (máx. 50MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {/* Lista de archivos subiendo */}
              {uploadStatuses.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Archivos</h3>
                    <button
                      onClick={clearAll}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Limpiar
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {uploadStatuses.map((upload) => (
                      <motion.div
                        key={upload.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {upload.status === 'uploading' && (
                              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                            )}
                            {upload.status === 'success' && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                            {upload.status === 'error' && (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-sm text-white truncate">
                              {upload.file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeUpload(upload.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {upload.status === 'uploading' && (
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        )}
                        
                        {upload.message && (
                          <p className={`text-xs mt-1 ${
                            upload.status === 'success' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {upload.message}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 