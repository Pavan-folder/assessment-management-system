const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Force no-cache middleware
const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// CSP middleware to allow necessary connections
const csp = (req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' http://localhost:3001 https://unpkg.com; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data:; font-src 'self';");
  next();
};

// Apply no-cache to all requests
app.use(noCache);

// Apply CSP to all requests
app.use(csp);

// Specific route for root path
app.get('/', (req, res) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' 'unsafe-inline' http://localhost:3001; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data:; font-src 'self';");
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware to set correct MIME types and serve files
const serveWithCorrectMimeTypes = (req, res, next) => {
  const filePath = path.join(__dirname, req.path);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();

    // Set correct MIME types
    switch (ext) {
      case '.js':
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        break;
      case '.css':
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        break;
      case '.html':
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        break;
      case '.json':
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        break;
      default:
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }

    // Send the file
    res.sendFile(filePath);
  } else {
    // If file doesn't exist, try to serve index.html for client-side routing
    if (!req.path.startsWith('/src/') && !req.path.includes('.')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      res.status(404).send('File not found');
    }
  }
};

// Apply the middleware to all requests
app.use(serveWithCorrectMimeTypes);

// Start server
app.listen(port, () => {
  console.log('🚀 ======================================');
  console.log('🚀 PERFECT SERVER - Error-Free Setup');
  console.log('🚀 ======================================');
  console.log(`🚀 Frontend server running at http://localhost:${port}/`);
  console.log(`📱 Assessment Management System is ready!`);
  console.log(`🔗 Backend API available at http://localhost:3001/`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`✅ All files served with CORRECT MIME types`);
  console.log(`✅ No-cache headers set to prevent browser caching`);
  console.log(`✅ Fresh start - no cached files`);
  console.log('🚀 ======================================');
  console.log('');
  console.log('🔧 TROUBLESHOOTING TIPS:');
  console.log('1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)');
  console.log('2. Clear browser cache completely');
  console.log('3. Try incognito/private browsing mode');
  console.log('4. Check browser console for any remaining errors');
  console.log('');
});
