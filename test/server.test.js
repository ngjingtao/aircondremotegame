/* Hammers the server with the exact things that used to kill it. */
const http = require('http');

const tests = [
  ['/', 'normal page'],
  ['/%E0%A4%A', 'malformed percent-encoding'],
  ['/%', 'lone percent'],
  ['/%ZZ', 'invalid hex'],
  ['/..%2fpackage.json', 'encoded traversal'],
  ['/%2e%2e/package.json', 'encoded dotdot'],
  ['/train/../../package.json', 'plain traversal'],
  ['/_devicelab.html', 'dev-only page'],
  ['/../server.js', 'outside root'],
  ['/nope.html', 'missing file'],
  ['/train', 'dir without slash'],
  ['/icons/icon-180.png', 'cacheable asset'],
  ['/shared/ui.css', 'stylesheet'],
  ['/%00x', 'control character'],
  ['/train/%E0%A4%A', 'bad encoding deeper in'],
  ['/' + 'a'.repeat(3000), 'absurdly long path']
];

function req(path, method) {
  return new Promise(resolve => {
    const r = http.request({ host: 'localhost', port: 5173, path, method: method || 'GET' }, res => {
      let n = 0;
      res.on('data', c => { n += c.length; });
      res.on('end', () => resolve({
        status: res.statusCode,
        type: res.headers['content-type'],
        cache: res.headers['cache-control'],
        csp: res.headers['content-security-policy'] || '',
        bytes: n
      }));
    });
    r.on('error', e => resolve({ error: e.code || e.message }));
    r.end();
  });
}

(async () => {
  let bad = 0;
  for (const [p, label] of tests) {
    const r = await req(p);
    const ok = r.status && r.status < 500;
    if (!ok) bad++;
    console.log(
      (ok ? 'ok  ' : 'FAIL') + ' ' +
      String(r.status || r.error).padEnd(7) +
      (r.type || '').padEnd(34) +
      label.padEnd(30) + p.slice(0, 34)
    );
  }

  /* the whole point: is it still alive afterwards? */
  const alive = await req('/');
  console.log('\nafter everything, GET / -> ' + (alive.status || alive.error));

  /* ── the CSP must not need 'unsafe-inline' ──
     It only did because of the pre-paint language script in every <head> and
     two stray style="..." attributes. Both are gone, so if this ever comes back
     an inline script or style has crept in again. */
  console.log('\n— Content-Security-Policy —');
  const csp = alive.csp || '';
  const inline = /unsafe-inline/.test(csp);
  console.log((inline ? 'FAIL' : 'ok  ') + ' no unsafe-inline in the CSP');
  if (inline) bad++;
  const hasBoth = /script-src 'self'(;|$)/.test(csp) && /style-src 'self'(;|$)/.test(csp);
  console.log((hasBoth ? 'ok  ' : 'FAIL') + " script-src and style-src both 'self' only");
  if (!hasBoth) bad++;
  console.log('     ' + csp);

  /* and a HEAD, which health checks use */
  const head = await req('/', 'HEAD');
  console.log('HEAD / -> ' + (head.status || head.error));

  /* security headers present? */
  console.log('CSP header present: ' + head.csp);
  console.log('asset cache-control: ' + head.cache);

  const asset = await req('/icons/icon-180.png');
  console.log('png cache-control: ' + asset.cache);

  process.exit(bad || !alive.status ? 1 : 0);
})();
