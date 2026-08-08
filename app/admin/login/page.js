'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLogin from '@/components/AdminLogin'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (success) => {
    if (success) {
      router.push('/admin/dashboard')
    }
  }

  return <AdminLogin onLogin={handleLogin} />
}