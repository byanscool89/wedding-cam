'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoGallery from '@/components/PhotoGallery'
import { FiLogOut } from 'react-icons/fi'

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
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </nav>
      
      <PhotoGallery />
    </div>
  )
}