/* ═══════════════════════════════════════════════════════════
   scripts/stamp.js — stamp the service worker cache version

   The cache name in www/sw.js used to be bumped by hand, so it was
   easy to forget and ship a stale PWA. This rewrites it with the
   current build id instead:

     • RENDER_GIT_COMMIT (set by Render)
     • or GITHUB_SHA (set by GitHub Actions)
     • or `git rev-parse --short HEAD`
     • or, failing all that, a hash of the www file list

   Wired into the Render build command and the npm postinstall hook.
   ═══════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const WWW = path.join(ROOT, 'www');
const SW = path.join(WWW, 'sw.js');

function fromGit() {
  const env = process.env.RENDER_GIT_COMMIT || process.env.GITHUB_SHA || process.env.SOURCE_VERSION;
  if (env && env.length >= 7) return env.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim().slice(0, 7);
  } catch (e) { return null; }
}

/* fall back to hashing every file's size + mtime so a change still bumps it */
function fromFiles(dir) {
  const h = crypto.createHash('sha1');
  (function walk(d) {
    fs.readdirSync(d).sort().forEach(name => {
      const full = path.join(d, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) { if (name !== 'node_modules') walk(full); }
      else if (name !== 'sw.js') h.update(name + ':' + st.size + ':' + st.mtimeMs);
    });
  })(dir);
  return h.digest('hex').slice(0, 7);
}

const id = fromGit() || fromFiles(WWW);
const src = fs.readFileSync(SW, 'utf8');
const next = src.replace(/const CACHE = '[^']*';/, `const CACHE = 'play-learn-${id}';`);

if (next === src) {
  console.log('sw.js cache already at play-learn-' + id);
} else {
  fs.writeFileSync(SW, next);
  console.log('sw.js cache stamped play-learn-' + id);
}
