'use client'

// Force dynamic rendering for error pages
export const dynamic = 'force-dynamic'

export default function GlobalError() {
  return (
    <html>
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Something went wrong!</h2>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.25rem'
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}