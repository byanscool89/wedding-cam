'use client'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'

export default function QRCodeDisplay() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.origin)
  }, [])

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Scan to Capture!</h3>
      <p className="text-gray-600 mb-6">Scan QR code with your phone camera</p>
      
      <div className="bg-white p-4 rounded-xl inline-block">
        {url && (
          <QRCode
            value={url}
            size={200}
            bgColor="#ffffff"
            fgColor="#ec4899"
            level="H"
          />
        )}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-pink-600">
        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="font-medium">Point your camera here</span>
      </div>
    </div>
  )
}