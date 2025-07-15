import React from 'react'
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Job Board Platform</title>
        <meta name="description" content="AI-powered job board platform with Tech Island companies integration" />
      </Head>
      
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Job Board Platform</h1>
        <p>AI-powered job board platform with Tech Island companies integration.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Featured Companies</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>Prognosys Solutions</h3>
              <p>RegTech (Regulatory Technology) - Nicosia, Cyprus</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>AdTech Holding</h3>
              <p>Digital Advertising Technology - Limassol, Cyprus</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>3CX Ltd</h3>
              <p>Unified Communications - Nicosia, Cyprus</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>ACHELEC</h3>
              <p>Audio Visual Technology - Limassol, Cyprus</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>Recent Job Opportunities</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h4>Implementation Engineer</h4>
              <p>Prognosys Solutions • Nicosia, Cyprus • €35k - €45k</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h4>Software Developer</h4>
              <p>3CX Ltd • Nicosia, Cyprus • €40k - €55k</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h4>Audio Visual Systems Engineer</h4>
              <p>ACHELEC • Limassol, Cyprus • €32k - €42k</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}