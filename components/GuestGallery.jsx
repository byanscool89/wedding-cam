'use client'
import { useState, useEffect } from 'react'
import { FiImage, FiDownload, FiUser } from 'react-icons/fi'

export default function GuestGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    fetchPhotos()
    const interval = setInterval(fetchPhotos, 15000)
    return () => clearInterval(interval)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading memories...</p>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <FiImage className="text-5xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No photos yet</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to capture a moment!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {photos.map(photo => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <img
              src={photo.public_url}
              alt="Wedding moment"
              className="w-full aspect-square object-cover"
            />
            
            {/* Sender name badge */}
            {photo.sender_name && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs flex items-center gap-1">
                  <FiUser className="text-xs" />
                  {photo.sender_name}
                </p>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <a
                href={photo.public_url}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-3 rounded-full hover:scale-110 transition-all shadow-lg"
              >
                <FiDownload className="text-gray-800 text-lg" />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-4">
        {photos.length} precious moments captured 💕
      </p>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 z-50"
          >
            ✕
          </button>
          
          <div className="max-w-4xl max-h-[85vh] text-center">
            <img
              src={selectedPhoto.public_url}
              alt="Selected"
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            
            {/* Sender name in lightbox */}
            {selectedPhoto.sender_name && (
              <p className="text-white mt-3 flex items-center justify-center gap-2">
                <FiUser />
                <span className="font-medium">{selectedPhoto.sender_name}</span>
              </p>
            )}
          </div>
          
          <a
            href={selectedPhoto.public_url}
            download
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full hover:bg-gray-100 transition-all shadow-xl flex items-center gap-2 font-medium"
          >
            <FiDownload />
            Download Photo
          </a>
        </div>
      )}
    </>
  )
}