'use client'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'

export default function QRCodeDisplay() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.origin)
  }, [])

  return (
    <div className="text-center">
      <p className="text-gray-600 mb-3 font-medium">Scan QR Code ini 📱</p>
      <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
        {url && (
          <QRCode
            value={url}
            size={180}
            bgColor="#ffffff"
            fgColor="#ec4899"
            level="H"
          />
        )}
      </div>
      <p className="text-gray-500 mt-3 text-sm">Buka kamera HP & scan kode di atas</p>
      <p className="text-gray-400 text-xs mt-1">Bagikan ke teman-temanmu!</p>
    </div>
  )
}