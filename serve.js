// serve.js — static file server for Valases website
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname);
const PORT = process.env.PORT || parseInt(process.argv[2], 10) || 2506;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain',
  '.xml':  'text/xml',
  '.mp4':  'video/mp4',
};

const server = http.createServer((req, res) => {
  // Strip query string
  const parsed = url.parse(req.url);
  let pathname = parsed.pathname;

  // Default to index.html
  if (pathname === '/' || pathname === '') pathname = '/index.html';

  // Resolve to absolute path, preventing directory traversal
  const filePath = path.join(ROOT, pathname);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try appending .html
      fs.readFile(filePath + '.html', (err2, data2) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: ' + pathname);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data2);
        }
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n✅ Valases site running at: http://localhost:${PORT}\n`);
  console.log('Pages:');
  console.log(`  Home     → http://localhost:${PORT}/index.html`);
  console.log(`  Pricing  → http://localhost:${PORT}/pricing.html`);
  console.log(`  Demo     → http://localhost:${PORT}/demo.html`);
  console.log(`  Hiring   → http://localhost:${PORT}/hiring.html`);
  console.log(`  Onboard  → http://localhost:${PORT}/onboarding.html`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});
