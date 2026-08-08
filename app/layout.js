import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Febyan Instans',
  description: 'Capture our special moments together!',
  manifest: '/manifest.json',
  themeColor: '#ec4899',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-rose-100">
          {children}
        </div>
      </body>
    </html>
  )
  
}

