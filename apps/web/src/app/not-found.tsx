// Force dynamic rendering for not-found page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function NotFound() {
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
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#111', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#666', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem'
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