'use client'
import { useState, useRef, useEffect } from 'react'
import { FiCamera, FiRefreshCw, FiX } from 'react-icons/fi'

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
    
    // Auto upload
    if (onCapture) {
      onCapture(photoData)
    }
  }

  const retakePhoto = () => {
    setPhoto(null)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              startCamera()
            }}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Camera/Photo */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black">
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
      <div className="mt-6 flex justify-center gap-4">
        {!photo ? (
          <>
            <button
              onClick={switchCamera}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white"
            >
              <FiRefreshCw className="text-2xl text-gray-700" />
            </button>
            <button
              onClick={capturePhoto}
              disabled={isUploading}
              className="bg-white p-6 rounded-full shadow-lg hover:scale-110 transition-all border-4 border-pink-300 disabled:opacity-50"
            >
              <FiCamera className="text-3xl text-pink-600" />
            </button>
            <div className="w-16"></div>
          </>
        ) : (
          <button
            onClick={retakePhoto}
            disabled={isUploading}
            className="bg-red-500 p-4 rounded-full shadow-lg hover:bg-red-600 text-white disabled:opacity-50"
          >
            <FiX className="text-2xl" />
          </button>
        )}
      </div>
      
      {isUploading && (
        <div className="mt-4 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-pink-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Uploading...</p>
        </div>
      )}
    </div>
  )
}