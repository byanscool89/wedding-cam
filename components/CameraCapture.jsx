'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { FiCamera, FiRefreshCw, FiX } from 'react-icons/fi'

export default function CameraCapture({ onCapture, isUploading }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')
  const [loading, setLoading] = useState(true)

  const startCamera = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      
      // Cek apakah browser support camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device/browser')
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setCameraReady(true)
        setError(null)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera access denied. Please allow camera access and refresh.')
    } finally {
      setLoading(false)
    }
  }, [facingMode])

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
    startCamera()
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      const photoData = canvas.toDataURL('image/jpeg', 0.9)
      setPhoto(photoData)
      
      // Auto upload langsung
      if (onCapture) {
        onCapture(photoData)
      }
    } catch (err) {
      console.error('Capture error:', err)
      setError('Failed to capture photo. Please try again.')
    }
  }

  const retakePhoto = () => {
    setPhoto(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mb-4"></div>
        <p className="text-gray-600">Starting camera...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center w-full max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              startCamera()
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 mr-2"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 mt-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Camera View or Photo Preview */}
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
            onLoadedMetadata={() => setCameraReady(true)}
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center gap-4">
        {!photo ? (
          <>
            <button
              onClick={switchCamera}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <FiRefreshCw className="text-2xl text-gray-700" />
            </button>
            <button
              onClick={capturePhoto}
              disabled={!cameraReady || isUploading}
              className="bg-white p-6 rounded-full shadow-lg hover:scale-110 transition-all border-4 border-pink-300 disabled:opacity-50"
            >
              <FiCamera className="text-3xl text-pink-600" />
            </button>
            <div className="w-16"></div>
          </>
        ) : (
          <>
            <button
              onClick={retakePhoto}
              disabled={isUploading}
              className="bg-red-500 p-4 rounded-full shadow-lg hover:bg-red-600 text-white transition-all disabled:opacity-50"
            >
              <FiX className="text-2xl" />
            </button>
            {isUploading && (
              <div className="bg-blue-500 p-4 rounded-full shadow-lg text-white">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}