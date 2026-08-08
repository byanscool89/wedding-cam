'use client'
import { useState } from 'react'
import { FiLock, FiArrowRight } from 'react-icons/fi'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'wedding2024') {
      localStorage.setItem('admin-auth', 'true')
      onLogin(true)
    } else {
      setError('Wrong password!')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-4xl text-pink-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Access</h2>
          <p className="text-gray-600 mt-2">Enter password to view gallery</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
          />
          
          {error && (
            <p className="text-red-500 mt-2 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full mt-4 bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            Access Gallery
            <FiArrowRight />
          </button>
        </form>
      </div>
    </div>
  )
}