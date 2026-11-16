/* ═══════════════════════════════════════════════════════════
   server.js — static server + neural narration for Play & Learn

   Serves `www/` for local development (`npm start`) and on Render, and
   exposes GET /tts (Microsoft Edge Read Aloud via msedge-tts) so desktop
   and Android can use a neural voice. Binds to $PORT when the host
   provides one, so it works on Render / Railway / Fly.
   ═══════════════════════════════════════════════════════════ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

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
    "media-src 'self' blob:",
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
   Neural narration — Microsoft Edge Read Aloud via msedge-tts

   No API key. The browser asks /tts?text=…&lang=zh; we synthesize on the
   server and return { audio: base64 mp3, words: [...] }. The client prefers
   this on desktop and Android, and falls back to the device's own TTS when
   it cannot reach us or when the network is down.

   This is an unofficial Microsoft endpoint. It sounds far better than
   eSpeak on Linux, but it is not a paid SLA; the fallback is the point.
   ───────────────────────────────────────── */
const TTS_VOICES = { zh: 'zh-CN-XiaoxiaoNeural', en: 'en-US-AriaNeural' };
const TTS_MAX_TEXT = 400;
const TTS_CACHE_MAX = 120;
const TTS_CACHE = new Map();
const ttsHits = new Map();
let edgeTts = null;

async function loadEdgeTts() {
  if (!edgeTts) edgeTts = await import('msedge-tts');
  return edgeTts;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* Edge returns word boundaries in 100-nanosecond units. Map each spoken word
   back to the original string so the page can highlight it. */
function mapWords(meta, text) {
  const out = [];
  let cursor = 0;
  const list = (meta && meta.Metadata) || [];
  list.forEach(m => {
    if (!m || m.Type !== 'WordBoundary') return;
    const d = m.Data || {};
    const raw = (d.text && d.text.Text) || '';
    if (!raw) return;
    let idx = text.indexOf(raw, cursor);
    if (idx < 0) idx = Math.min(cursor, text.length);
    const startChar = idx;
    const endChar = Math.min(text.length, idx + raw.length);
    cursor = endChar;
    out.push({
      text: raw,
      start: Math.max(0, (d.Offset || 0) / 1e7),
      end: Math.max(0, ((d.Offset || 0) + (d.Duration || 0)) / 1e7),
      startChar: startChar,
      endChar: endChar
    });
  });
  return out;
}

function ttsAllowed(req) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) || 'unknown';
  const now = Date.now();
  let b = ttsHits.get(ip);
  if (!b || now - b.t > 60000) { b = { t: now, n: 0 }; ttsHits.set(ip, b); }
  b.n++;
  if (ttsHits.size > 500) {
    for (const [k, v] of ttsHits) if (now - v.t > 120000) ttsHits.delete(k);
  }
  return b.n <= 100;
}

async function synthesize(text, lang, rate) {
  const mod = await loadEdgeTts();
  const voice = TTS_VOICES[lang] || TTS_VOICES.zh;
  const tts = new mod.MsEdgeTTS({ connectionTimeoutMs: 12000, synthesisTimeoutMs: 30000 });
  await tts.setMetadata(voice, mod.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
    wordBoundaryEnabled: true
  });

  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'jke-tts-'));
  try {
    const out = await tts.toFile(dir, escapeXml(text), { rate: rate });
    const audio = await fs.promises.readFile(out.audioFilePath);
    let meta = { Metadata: [] };
    if (out.metadataFilePath) {
      try { meta = JSON.parse(await fs.promises.readFile(out.metadataFilePath, 'utf8')); } catch (e) {}
    }
    return { audio: audio, words: mapWords(meta, text), voice: voice };
  } finally {
    fs.promises.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

function replyJson(res, status, obj, extra) {
  const body = JSON.stringify(obj);
  const headers = Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD'
  }, SECURITY, extra || {});
  res.writeHead(status, headers);
  res.end(body);
}

async function handleTts(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return replyJson(res, 405, { error: 'method not allowed' });
  }

  let text = (url.searchParams.get('text') || '').trim();
  const lang = (url.searchParams.get('lang') || 'zh').toLowerCase().startsWith('en') ? 'en' : 'zh';
  let rate = parseFloat(url.searchParams.get('rate') || '0.95');
  if (!isFinite(rate)) rate = 0.95;
  rate = Math.max(0.5, Math.min(1.4, rate));

  if (!text) return replyJson(res, 400, { error: 'text required' });
  if (text.length > TTS_MAX_TEXT) return replyJson(res, 400, { error: 'text too long' });
  if (!ttsAllowed(req)) return replyJson(res, 429, { error: 'slow down' });

  const key = crypto.createHash('sha256').update(lang + '|' + rate + '|' + text).digest('hex');
  let hit = TTS_CACHE.get(key);
  if (!hit) {
    try {
      hit = await synthesize(text, lang, rate);
    } catch (e) {
      console.error('tts failed:', e && e.message);
      return replyJson(res, 502, { error: 'tts unavailable' });
    }
    if (TTS_CACHE.size >= TTS_CACHE_MAX) TTS_CACHE.delete(TTS_CACHE.keys().next().value);
    TTS_CACHE.set(key, hit);
  }

  const body = JSON.stringify({
    voice: hit.voice,
    words: hit.words,
    audio: hit.audio.toString('base64')
  });

  res.writeHead(200, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'public, max-age=86400',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD',
    'X-TTS-Voice': hit.voice
  }, SECURITY));

  if (req.method === 'HEAD') return res.end();
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

  let urlObj;
  try {
    urlObj = new URL(req.url || '/', 'http://localhost');
  } catch (e) {
    return reply(res, 400, 'Bad request');
  }
  if (urlObj.pathname === '/tts') {
    handleTts(req, res, urlObj).catch(e => {
      console.error('tts handler failed:', e && e.message);
      try { replyJson(res, 502, { error: 'tts failed' }); } catch (e2) {}
    });
    return;
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
