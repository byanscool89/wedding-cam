'use client'
import { useState } from 'react'
import CameraCapture from '@/components/CameraCapture'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import GuestGallery from '@/components/GuestGallery'
import { FiHeart, FiCheck, FiShare2, FiCamera, FiImage } from 'react-icons/fi'

export default function Home() {
  const [showQR, setShowQR] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState(null)

  const handleCapture = async (photoData, senderName, resetCamera) => {
    setUploading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: photoData,
          senderName: senderName 
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Upload failed')
      
      setUploaded(true)
      
      setTimeout(() => {
        setUploaded(false)
        setUploading(false)
        if (resetCamera) resetCamera()
      }, 2000)
      
    } catch (err) {
      setError(err.message)
      console.error('Upload error:', err)
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #fafafa 0%, #fff5f5 25%, #fdf2f8 50%, #fce7f3 75%, #fafafa 100%)'
    }}>
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${1.2 + Math.random() * 1.5}rem`,
              opacity: 0.12,
              animation: 'float 6s ease-in-out infinite'
            }}
          >
            {['📸', '✨', '🎬', '💫', '🌟', '🎯', '💡', '🔥'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 mb-4 shadow-lg">
            <p className="text-pink-600 font-medium text-sm tracking-wider">📸 DAILY MOMENTS</p>
          </div>
          
          <h1 className="text-5xl font-bold mb-3" style={{
            background: 'linear-gradient(to right, #ec4899, #f43f5e, #e11d48, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Febyan
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 bg-pink-300"></span>
            <span className="text-2xl">🎬</span>
            <span className="h-px w-16 bg-pink-300"></span>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg">
            <p className="text-gray-600 text-sm">Capture every moment ✨</p>
            <p className="text-xl font-bold text-pink-600">Instan Keseharian</p>
          </div>
        </div>

        {/* Camera Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-pink-100 mb-6">
          <div className="text-center mb-4">
            <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
              <FiCamera className="text-pink-500" />
              Instan Capture
            </p>
            <p className="text-gray-500 text-sm mt-1">Abadikan momen keseharianmu sekarang juga!</p>
          </div>
          
          <CameraCapture onCapture={handleCapture} isUploading={uploading} />
        </div>
        
        {/* Status Messages */}
        {uploading && (
          <div className="mb-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl p-4 shadow-lg text-center">
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="font-medium">Mengupload momenmu...</p>
          </div>
        )}
        
        {uploaded && (
          <div className="mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-4 shadow-lg text-center animate-bounce">
            <FiCheck className="text-3xl mx-auto mb-2" />
            <p className="font-bold text-lg">Tersimpan! 🎉</p>
            <p className="text-sm">Momen keseharianmu berhasil diabadikan!</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-red-700 underline text-sm mt-1">
              Tutup
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => {
              setShowGallery(!showGallery)
              if (showQR) setShowQR(false)
            }}
            className="w-full bg-white border-2 border-pink-300 text-pink-600 px-6 py-4 rounded-2xl hover:bg-pink-50 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg font-medium"
          >
            <FiImage className="text-xl" />
            {showGallery ? 'Sembunyikan Galeri' : 'Lihat Galeri Keseharian 📸'}
          </button>
          
          <button
            onClick={() => {
              setShowQR(!showQR)
              if (showGallery) setShowGallery(false)
            }}
            className="w-full bg-white border-2 border-pink-300 text-pink-600 px-6 py-4 rounded-2xl hover:bg-pink-50 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg font-medium"
          >
            <FiShare2 className="text-xl" />
            {showQR ? 'Sembunyikan QR' : 'Bagikan Link 📱'}
          </button>
        </div>

        {/* Gallery Section */}
        {showGallery && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-pink-100">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">📸 Galeri Keseharian</h2>
            <GuestGallery />
          </div>
        )}
        
        {/* QR Code */}
        {showQR && (
          <div className="mb-8 bg-white rounded-3xl p-6 shadow-xl">
            <QRCodeDisplay />
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-gray-400 text-sm">
            Instan Keseharian <span className="font-bold text-pink-500">Febyan</span> ✨
          </p>
          <p className="text-gray-300 text-xs mt-1">Capture. Share. Remember.</p>
          <a href="/admin/login" className="text-gray-300 hover:text-gray-400 text-xs mt-2 inline-block">
            •
          </a>
        </div>
      </div>
    </main>
  )
}