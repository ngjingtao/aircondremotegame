/* ═══════════════════════════════════════════════════════════
   server.js — zero-dependency static server for Play & Learn

   Used for local development (`npm start`) and on Render.
   Binds to $PORT when the host provides one, so it works on
   Render / Railway / Fly without extra configuration.
   ═══════════════════════════════════════════════════════════ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'www');
const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function reply(res, status, body, type, head) {
  res.writeHead(status, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
  });
  if (head) return res.end();
  res.end(body);
}

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const withIndex = clean.endsWith('/') ? clean + 'index.html' : clean;
  const full = path.resolve(ROOT, '.' + withIndex);

  /* never escape the web root */
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return reply(res, 405, 'Method not allowed');
  }

  let file = resolveFile(req.url || '/');
  if (!file) return reply(res, 403, 'Forbidden');

  fs.stat(file, (err, stat) => {
    /* "/train" without a trailing slash should still find /train/index.html */
    if ((err || stat.isDirectory()) && !file.endsWith('index.html')) {
      file = path.join(file, 'index.html');
      return fs.stat(file, (err2, stat2) => {
        if (err2 || !stat2.isFile()) return reply(res, 404, 'Not found');
        send(res, file, stat2, req);
      });
    }
    if (err || !stat.isFile()) return reply(res, 404, 'Not found');
    send(res, file, stat, req);
  });
});

function send(res, file, stat, req) {
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

server.listen(PORT, HOST, () => {
  console.log('Play & Learn — serving ' + ROOT);
  console.log('Listening on http://localhost:' + PORT);
});
