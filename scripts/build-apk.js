/* ═══════════════════════════════════════════════════════════
   scripts/build-apk.js — build a debug APK on any platform

   The old npm script was `cd android && gradlew.bat assembleDebug`,
   which only worked on Windows and only from npm. This runs the
   right wrapper wherever you are.
   ═══════════════════════════════════════════════════════════ */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ANDROID = path.join(__dirname, '..', 'android');
const win = process.platform === 'win32';
const wrapper = path.join(ANDROID, win ? 'gradlew.bat' : 'gradlew');

if (!fs.existsSync(wrapper)) {
  console.error('No Gradle wrapper at ' + wrapper);
  process.exit(1);
}

if (!win) {
  try { fs.chmodSync(wrapper, 0o755); } catch (e) {}
}

const res = spawnSync(wrapper, ['assembleDebug'].concat(process.argv.slice(2)), {
  cwd: ANDROID,
  stdio: 'inherit',
  shell: win
});

process.exit(res.status === null ? 1 : res.status);
