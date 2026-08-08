'use client'
import { useState, useRef, useEffect } from 'react'
import { FiCamera, FiRefreshCw, FiCheck, FiX, FiUpload } from 'react-icons/fi'

export default function CameraCapture({ onCapture, isUploading }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
  }

  const startCamera = async () => {
    try {
      stopCamera()
      setError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Could not access camera. Please allow camera permission.')
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    const photoData = canvas.toDataURL('image/jpeg', 0.9)
    setPhoto(photoData)
  }

  const retakePhoto = () => {
    setPhoto(null)
  }

  const confirmPhoto = () => {
    if (photo && onCapture) {
      onCapture(photo)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-md shadow-lg">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null)
              startCamera()
            }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Frame */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-pink-400 rounded-tl-2xl z-10"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pink-400 rounded-tr-2xl z-10"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-pink-400 rounded-bl-2xl z-10"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-pink-400 rounded-br-2xl z-10"></div>
        
        {/* Watermark */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full">
          <p className="text-xs font-semibold text-pink-600">💑 Imam & Arip</p>
        </div>
        
        {photo ? (
          <img src={photo} alt="Captured" className="w-full" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        {!photo ? (
          <>
            <button
              onClick={switchCamera}
              className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-gray-200"
            >
              <FiRefreshCw className="text-2xl text-gray-700" />
            </button>
            
            <button
              onClick={capturePhoto}
              disabled={isUploading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 p-5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-50"
            >
              <FiCamera className="text-3xl text-white" />
            </button>
            
            <div className="w-16"></div>
          </>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={retakePhoto}
              disabled={isUploading}
              className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-red-300 disabled:opacity-50"
            >
              <FiX className="text-2xl text-red-500" />
            </button>
            
            <button
              onClick={confirmPhoto}
              disabled={isUploading}
              className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <FiCheck className="text-2xl text-white" />
              )}
            </button>
            
            <span className="text-xs text-gray-500 self-center ml-2">
              {isUploading ? 'Uploading...' : 'Confirm'}
            </span>
          </div>
        )}
      </div>
      
      {/* Instruction */}
      {!photo && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Tap the pink button to capture 📸
        </p>
      )}
    </div>
  )
}