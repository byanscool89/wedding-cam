'use client'
import { useState } from 'react'
import CameraCapture from '@/components/CameraCapture'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { FiHeart, FiCamera, FiCheck, FiShare2 } from 'react-icons/fi'

export default function Home() {
  const [showQR, setShowQR] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState(null)

  const handleCapture = async (photoData) => {
    setUploading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photoData })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }
      
      setUploaded(true)
      setTimeout(() => setUploaded(false), 5000)
    } catch (err) {
      setError(err.message)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">💕</div>
        <div className="absolute top-20 right-20 text-3xl animate-float animation-delay-2000 opacity-20">✨</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-float animation-delay-4000 opacity-20">🌸</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-float opacity-20">💝</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Our Wedding Moments
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Capture & share your favorite moments with us!
          </p>
          <p className="text-gray-500 flex items-center justify-center gap-2">
            <FiCamera className="text-pink-500" />
            Take a photo to join our memory collection
          </p>
        </div>

        {/* Camera Section */}
        <div className="max-w-lg mx-auto">
          <CameraCapture onCapture={handleCapture} isUploading={uploading} />
          
          {/* Status Messages */}
          {uploading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-blue-600 font-medium">Uploading your photo...</p>
            </div>
          )}
          
          {uploaded && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-bounce">
              <FiCheck className="text-3xl text-green-600 mx-auto mb-2" />
              <p className="text-green-600 font-medium">Photo shared successfully! 🎉</p>
              <p className="text-green-500 text-sm">Thank you for capturing this moment!</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 underline mt-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* QR Code Section */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowQR(!showQR)}
            className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-all flex items-center gap-2 mx-auto"
          >
            <FiShare2 />
            {showQR ? 'Hide QR Code' : 'Show QR Code to Share'}
          </button>
          
          {showQR && (
            <div className="mt-8 flex justify-center">
              <QRCodeDisplay />
            </div>
          )}
        </div>

        {/* Admin Link - tersembunyi */}
<div className="mt-8 text-center">
  <a 
    href="/admin/login" 
    className="text-gray-300 hover:text-gray-400 text-sm transition-colors"
  >
    •
  </a>
</div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>Made with <FiHeart className="inline text-pink-500" /> for our special day</p>
        </div>
      </div>
    </main>
  )
}