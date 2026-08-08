'use client'
import { useState } from 'react'
import CameraCapture from '@/components/CameraCapture'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { FiHeart, FiCheck, FiShare2 } from 'react-icons/fi'

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
      setTimeout(() => setUploaded(false), 3000)
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload photo')
      // Auto dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            Our Wedding 📸
          </h1>
          <p className="text-gray-600 text-sm">
            Capture & share your moments!
          </p>
        </div>

        {/* Camera */}
        <CameraCapture onCapture={handleCapture} isUploading={uploading} />
        
        {/* Upload Success */}
        {uploaded && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-bounce">
            <FiCheck className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-green-600 font-medium">Photo shared! 🎉</p>
            <p className="text-green-500 text-sm">Thank you! ❤️</p>
          </div>
        )}
        
        {/* Upload Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-1">Please try again</p>
          </div>
        )}

        {/* QR Code */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowQR(!showQR)}
            className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 active:scale-95 transition-all flex items-center gap-2 mx-auto shadow-lg"
          >
            <FiShare2 />
            {showQR ? 'Hide QR' : 'Share QR Code'}
          </button>
          
          {showQR && (
            <div className="mt-6">
              <QRCodeDisplay />
            </div>
          )}
        </div>

        {/* Admin link */}
        <div className="mt-12 text-center">
          <a href="/admin/login" className="text-gray-300 hover:text-gray-400 text-sm">•</a>
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs">
          <p>Made with <FiHeart className="inline text-pink-500" /> for our special day</p>
        </div>
      </div>
    </main>
  )
}