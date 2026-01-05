import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pickle Inventory Scout',
  description: 'Find trending dresses and maximize your rental ROI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
