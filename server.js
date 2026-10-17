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
  '.webmanifest': 'application/manifest+json; charset=utf-8',
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

/* files that are long-lived and can be cached hard */
const CACHEABLE = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.mp3']);

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
  /* everything is local; nothing should ever be loaded from elsewhere.
     No 'unsafe-inline' anywhere: the pre-paint language script lives in
     shared/prepaint.js and the last two inline style attributes moved into the
     stylesheets. Adding an inline <script> or style="..." back will now break
     on the next deploy, which is the point — test/server.test.js checks. */
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "media-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'self'"
  ].join('; ')
};

function reply(res, status, body, extra) {
  res.writeHead(status, Object.assign({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  }, SECURITY, extra || {}));
  res.end(body);
}

/* ─────────────────────────────────────────
   Resolve a URL to a file inside ROOT.
   Returns { file } or { status } — never throws.
   ───────────────────────────────────────── */
function resolveFile(urlPath) {
  let clean;
  try {
    clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch (e) {
    /* malformed percent-encoding — a bad request, not a crash */
    return { status: 400, message: 'Bad request' };
  }

  /* no NUL bytes or control characters */
  if (/[\u0000-\u001f]/.test(clean)) return { status: 400, message: 'Bad request' };

  const withIndex = clean.endsWith('/') ? clean + 'index.html' : clean;

  /* never serve the dev-only pages or dotfiles */
  const parts = withIndex.split('/').filter(Boolean);
  if (parts.some(seg => seg.startsWith('_') || seg.startsWith('.'))) {
    return { status: 404, message: 'Not found' };
  }

  const full = path.resolve(ROOT, '.' + withIndex);

  /* never escape the web root */
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) {
    return { status: 403, message: 'Forbidden' };
  }
  return { file: full };
}

function sendFile(res, file, stat, req) {
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const headers = Object.assign({
    'Content-Type': type,
    'Content-Length': stat.size
  }, SECURITY);

  if (CACHEABLE.has(ext)) {
    /* icons, images, fonts — safe to keep for a day */
    headers['Cache-Control'] = 'public, max-age=86400';
  } else {
    /* HTML, CSS and JS: the service worker handles offline, so always revalidate */
    headers['Cache-Control'] = 'no-cache';
  }

  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();

  const stream = fs.createReadStream(file);
  stream.on('error', () => { try { res.destroy(); } catch (e) {} });
  stream.pipe(res);
}

/* ─────────────────────────────────────────
   Request handler
   ───────────────────────────────────────── */
function handle(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return reply(res, 405, 'Method not allowed');
  }

  const resolved = resolveFile(req.url || '/');
  if (resolved.status) return reply(res, resolved.status, resolved.message);

  fs.stat(resolved.file, (err, stat) => {
    /* "/train" without a trailing slash should still find /train/index.html */
    if ((err || stat.isDirectory()) && !resolved.file.endsWith('index.html')) {
      const asDir = path.join(resolved.file, 'index.html');
      if (!asDir.startsWith(ROOT + path.sep)) return reply(res, 404, 'Not found');
      return fs.stat(asDir, (err2, stat2) => {
        if (err2 || !stat2.isFile()) return reply(res, 404, 'Not found');
        sendFile(res, asDir, stat2, req);
      });
    }
    if (err || !stat.isFile()) return reply(res, 404, 'Not found');
    sendFile(res, resolved.file, stat, req);
  });
}

const server = http.createServer((req, res) => {
  /* a thrown handler must never take the whole site down */
  try {
    handle(req, res);
  } catch (e) {
    console.error('request failed:', req.method, req.url, e && e.message);
    try { reply(res, 500, 'Server error'); } catch (e2) {}
  }
});

/* last-resort guards: log and keep serving */
process.on('uncaughtException', err => {
  console.error('uncaught:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', err => {
  console.error('unhandled rejection:', err);
});

server.listen(PORT, HOST, () => {
  console.log('Play & Learn — serving ' + ROOT);
  console.log('Listening on http://localhost:' + PORT);
});
