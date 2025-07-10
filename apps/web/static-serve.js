const express = require('express');
const path = require('path');

const app = express();
const port = 3004;

// Serve static files from the current directory
app.use(express.static('.'));

// Handle SPA routing - serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Static server running on http://0.0.0.0:${port}`);
  console.log(`Try accessing: http://localhost:${port}`);
  console.log(`Or: http://192.168.20.112:${port}`);
});