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
      console.log('Starting upload...')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photoData })
      })
      
      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }
      
      setUploaded(true)
      setTimeout(() => setUploaded(false), 4000)
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-serif font-bold text-pink-600 mb-2">
            💒 Imam & Arip
          </h1>
          <p className="text-gray-600 text-sm">
            Capture our special moments! 📸
          </p>
        </div>

        {/* Camera */}
        <CameraCapture onCapture={handleCapture} isUploading={uploading} />
        
        {/* Upload Success */}
        {uploaded && (
          <div className="mt-4 bg-green-100 border-2 border-green-300 rounded-2xl p-4 text-center">
            <FiCheck className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-green-600 font-bold">Photo Shared! 🎉</p>
            <p className="text-green-500 text-sm">Thank you! ❤️</p>
          </div>
        )}
        
        {/* Upload Error */}
        {error && (
          <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 text-sm font-medium">{error}</p>
            <p className="text-red-500 text-xs mt-1">Please try again</p>
          </div>
        )}

        {/* QR Code */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowQR(!showQR)}
            className="bg-white border-2 border-pink-300 text-pink-600 px-6 py-4 rounded-2xl hover:bg-pink-50 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg font-medium w-full"
          >
            <FiShare2 />
            {showQR ? 'Hide QR' : 'Share QR Code'}
          </button>
          
          {showQR && (
            <div className="mt-4">
              <QRCodeDisplay />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Made with <FiHeart className="inline text-pink-500" /> by Imam & Arip
          </p>
          <a href="/admin/login" className="text-gray-300 text-xs">•</a>
        </div>
      </div>
    </main>
  )
}