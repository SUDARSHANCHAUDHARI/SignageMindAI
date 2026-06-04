import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SignageMind AI',
  description: 'Expert AI chatbot for digital signage support — signage devices, Tizen, webOS, FireOS, Windows, Iframe troubleshooting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
