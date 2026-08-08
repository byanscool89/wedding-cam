'use client'
import { useState, useRef, useEffect } from 'react'
import { FiCamera, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi'

export default function CameraCapture({ onCapture, isUploading }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    startCamera()
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraReady(true)
      }
    } catch (err) {
      setError('Please allow camera access to take photos')
      console.error('Camera error:', err)
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
    startCamera()
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
    if (photo) {
      onCapture(photo)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null)
              startCamera()
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all text-sm"
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
      <div className="relative rounded-2xl overflow-hidden shadow-xl border-3 border-white bg-black">
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

      {/* Controls */}
      <div className="mt-6 flex justify-center gap-4">
        {!photo ? (
          <>
            <button
              onClick={switchCamera}
              className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all border-2 border-gray-200"
            >
              <FiRefreshCw className="text-xl text-gray-700" />
            </button>
            
            <button
              onClick={capturePhoto}
              disabled={!cameraReady || isUploading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 p-5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              <FiCamera className="text-2xl text-white" />
            </button>
            
            <div className="w-14"></div>
          </>
        ) : (
          <div className="flex gap-4 items-center">
            <button
              onClick={retakePhoto}
              disabled={isUploading}
              className="bg-white p-4 rounded-full shadow-lg border-2 border-red-300 active:scale-95 transition-all disabled:opacity-50"
            >
              <FiX className="text-xl text-red-500" />
            </button>
            
            <button
              onClick={confirmPhoto}
              disabled={isUploading}
              className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-full shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <FiCheck className="text-xl text-white" />
              )}
            </button>
            
            <span className="text-xs text-gray-500 ml-1">
              {isUploading ? 'Uploading...' : 'Confirm'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}