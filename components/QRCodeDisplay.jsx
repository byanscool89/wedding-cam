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
      <p className="text-gray-600 mt-3 font-medium">Scan to open camera 📷</p>
      <p className="text-gray-400 text-xs mt-1">Share this with other guests!</p>
    </div>
  )
}