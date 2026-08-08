'use client'
import { useState, useEffect } from 'react'
import { FiDownload, FiTrash2, FiImage } from 'react-icons/fi'

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos')
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePhoto = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    
    try {
      const response = await fetch(`/api/photos/${id}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        // Hapus dari state
        setPhotos(photos.filter(p => p.id !== id))
        
        // Tutup lightbox
        if (selectedPhoto && selectedPhoto.id === id) {
          setSelectedPhoto(null)
        }
      } else {
        alert('Failed to delete photo')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete photo')
    }
  }

  const downloadAll = () => {
    photos.forEach(photo => {
      const link = document.createElement('a')
      link.href = photo.public_url
      link.download = photo.file_name || 'wedding-photo.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading photos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Wedding Gallery</h1>
          <p className="text-gray-600 mt-2">
            {photos.length} precious moments captured
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPhotos}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
          >
            🔄 Refresh
          </button>
          {photos.length > 0 && (
            <button
              onClick={downloadAll}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2 text-sm"
            >
              <FiDownload />
              Download All
            </button>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20">
          <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl">No photos yet</p>
          <p className="text-gray-400">Photos will appear here as guests capture them</p>
          <button
            onClick={fetchPhotos}
            className="mt-4 text-pink-600 underline"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div
              key={photo.id}
              className="relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.public_url}
                alt="Wedding moment"
                className="w-full h-48 object-cover"
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <a
                    href={photo.public_url}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-2 rounded-full hover:scale-110 transition-all"
                  >
                    <FiDownload className="text-gray-800" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePhoto(photo.id)
                    }}
                    className="bg-red-500 p-2 rounded-full hover:scale-110 transition-all"
                  >
                    <FiTrash2 className="text-white" />
                  </button>
                </div>
              </div>
              
              {photo.created_at && (
                <div className="p-2 text-xs text-gray-500">
                  {new Date(photo.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 left-4 text-white text-3xl hover:text-gray-300 z-50"
          >
            ✕
          </button>
          
          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhoto.public_url}
              alt="Selected photo"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <a
              href={selectedPhoto.public_url}
              download
              className="bg-white p-3 rounded-full hover:scale-110 transition-all"
            >
              <FiDownload className="text-xl" />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deletePhoto(selectedPhoto.id)
              }}
              className="bg-red-500 p-3 rounded-full hover:scale-110 transition-all"
            >
              <FiTrash2 className="text-xl text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}