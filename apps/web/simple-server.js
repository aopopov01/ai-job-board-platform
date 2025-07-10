const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Basic routing for SPA
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Simple response for now - just show that server is working
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <head><title>Job Board Platform</title></head>
      <body>
        <h1>🎉 Job Board Platform Server is Running!</h1>
        <p>Your Next.js application is ready to test.</p>
        <p>Server is listening on all interfaces (0.0.0.0:3005)</p>
        <p>Access this from Windows at: http://192.168.20.112:3005</p>
        <p>Current time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

const PORT = 3005;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 Access from Windows: http://192.168.20.112:${PORT}`);
  console.log(`📱 Local access: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});