'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoGallery from '@/components/PhotoGallery'
import { FiLogOut, FiCamera } from 'react-icons/fi'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('admin-auth')
    if (!auth) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin-auth')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-pink-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiCamera className="text-2xl text-pink-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Gallery</h1>
              <p className="text-xs text-gray-500">Instan Keseharian Febyan</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </nav>
      
      <PhotoGallery />
    </div>
  )
}