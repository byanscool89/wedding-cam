'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiArrowRight, FiCamera } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'wedding2024') {
      localStorage.setItem('admin-auth', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Password salah!')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #fafafa 0%, #fff5f5 25%, #fdf2f8 50%, #fce7f3 75%, #fafafa 100%)'
    }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-md mx-4 border border-pink-100">
        <div className="text-center mb-8">
          <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FiLock className="text-4xl text-pink-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Access</h2>
          <p className="text-gray-600 mt-2">Instan Keseharian Febyan</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-px w-8 bg-pink-300"></span>
            <FiCamera className="text-pink-500" />
            <span className="h-px w-8 bg-pink-300"></span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-center"
            />
          </div>
          
          {error && (
            <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
          >
            Masuk Galeri
            <FiArrowRight />
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-xs mt-6">
          🔒 Hanya untuk admin Febyan
        </p>
      </div>
    </div>
  )
}