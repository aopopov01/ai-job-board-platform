import React from 'react'

export const metadata = {
  title: 'Job Board Platform',
  description: 'AI-powered job board platform with Tech Island companies integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui' }}>
        {children}
      </body>
    </html>
  )
}