'use client'
import { useState, useEffect } from 'react'
import { FiDownload, FiTrash2, FiImage, FiUser } from 'react-icons/fi'

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
    const interval = setInterval(fetchPhotos, 10000)
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

  const deletePhoto = async (id) => {
    if (!confirm('Yakin mau hapus foto ini?')) return
    
    try {
      const response = await fetch(`/api/photos/${id}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== id))
        if (selectedPhoto && selectedPhoto.id === id) {
          setSelectedPhoto(null)
        }
      } else {
        alert('Gagal menghapus foto')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Gagal menghapus foto')
    }
  }

  const downloadAll = () => {
    photos.forEach((photo, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = photo.public_url
        link.download = photo.file_name || `febyan-${index + 1}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 300)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat galeri...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">📸 Galeri Keseharian</h2>
          <p className="text-gray-600 mt-1">
            {photos.length} momen tersimpan
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPhotos}
            className="px-4 py-2 bg-white rounded-xl hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all"
          >
            🔄 Refresh
          </button>
          {photos.length > 0 && (
            <button
              onClick={downloadAll}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2 rounded-xl hover:from-pink-600 hover:to-rose-600 flex items-center gap-2 text-sm font-medium shadow-lg transition-all"
            >
              <FiDownload />
              Download Semua
            </button>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-medium">Belum ada foto</p>
          <p className="text-gray-400">Foto akan muncul setelah ada yang mengabadikan momen</p>
          <button
            onClick={fetchPhotos}
            className="mt-4 text-pink-600 underline text-sm"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div
              key={photo.id}
              className="relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.public_url}
                alt="Daily moment"
                className="w-full aspect-square object-cover"
              />
              
              {/* Sender name */}
              {photo.sender_name && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm flex items-center gap-1">
                    <FiUser className="text-xs" />
                    {photo.sender_name}
                  </p>
                  {photo.created_at && (
                    <p className="text-white/70 text-xs mt-1">
                      {new Date(photo.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              )}
              
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <a
                    href={photo.public_url}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-3 rounded-full hover:scale-110 transition-all shadow-lg"
                    title="Download"
                  >
                    <FiDownload className="text-gray-800" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePhoto(photo.id)
                    }}
                    className="bg-red-500 p-3 rounded-full hover:scale-110 transition-all shadow-lg"
                    title="Hapus"
                  >
                    <FiTrash2 className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 z-50 bg-black/30 w-12 h-12 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
          
          <div className="max-w-5xl max-h-[90vh] text-center">
            <img
              src={selectedPhoto.public_url}
              alt="Selected"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            
            {selectedPhoto.sender_name && (
              <p className="text-white mt-4 flex items-center justify-center gap-2 text-lg">
                <FiUser />
                <span className="font-medium">{selectedPhoto.sender_name}</span>
              </p>
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            <a
              href={selectedPhoto.public_url}
              download
              className="bg-white text-gray-800 px-6 py-3 rounded-full hover:bg-gray-100 transition-all shadow-xl flex items-center gap-2 font-medium"
            >
              <FiDownload />
              Download
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deletePhoto(selectedPhoto.id)
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all shadow-xl flex items-center gap-2 font-medium"
            >
              <FiTrash2 />
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  )
}