'use client'
import { useState } from 'react'
import CameraCapture from '@/components/CameraCapture'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { FiHeart, FiCheck, FiShare2, FiMapPin } from 'react-icons/fi'

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
      
      if (!response.ok) throw new Error(data.error || 'Upload failed')
      
      setUploaded(true)
      setTimeout(() => setUploaded(false), 4000)
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message)
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #fce4ec 0%, #fff5f7 25%, #ffffff 50%, #fff0f3 75%, #fce4ec 100%)'
    }}>
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
              opacity: 0.15
            }}
          >
            {['💕', '✨', '🌸', '💝', '🕊️', '💒', '💍'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Wedding Header */}
        <div className="text-center mb-8">
          {/* Couple Names */}
          <div className="mb-4">
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Imam & Arip
            </h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="h-px w-12 bg-pink-300"></span>
              <FiHeart className="text-pink-500 text-xl" />
              <span className="h-px w-12 bg-pink-300"></span>
            </div>
          </div>
          
          {/* Wedding Date */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg inline-block mb-4">
            <p className="text-gray-700 font-medium">💒 Wedding Day</p>
            <p className="text-2xl font-bold text-pink-600">08 . 08 . 2026</p>
          </div>
          
          <p className="text-gray-600 mt-3 font-medium">
            Capture Our Special Moments! 📸
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Take a photo to share your love & blessings
          </p>
        </div>

        {/* Camera Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-pink-100 mb-6">
          <CameraCapture onCapture={handleCapture} isUploading={uploading} />
        </div>
        
        {/* Status Messages */}
        {uploaded && (
          <div className="mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-4 shadow-lg animate-bounce text-center">
            <FiCheck className="text-3xl mx-auto mb-2" />
            <p className="font-bold text-lg">Thank You! 🎉</p>
            <p className="text-sm opacity-90">Your memory has been saved!</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full bg-white border-2 border-pink-300 text-pink-600 px-6 py-4 rounded-2xl hover:bg-pink-50 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg font-medium"
          >
            <FiShare2 className="text-xl" />
            {showQR ? 'Hide QR Code' : 'Share This Link 📱'}
          </button>
          
          {showQR && (
            <div className="mt-4 bg-white rounded-2xl p-6 shadow-lg">
              <QRCodeDisplay />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Made with <FiHeart className="inline text-pink-500 animate-pulse" /> by Imam & Arip
          </p>
          <a 
            href="/admin/login" 
            className="text-gray-300 hover:text-gray-400 text-xs"
          >
            •
          </a>
        </div>
      </div>
    </main>
  )
}