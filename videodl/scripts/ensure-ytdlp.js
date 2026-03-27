const fs = require('fs');
const path = require('path');
const https = require('https');

const platform = process.platform;
const arch = process.arch;

// Hostinger Node.js apps typically run on Linux.
// Some hosts mount the filesystem with `noexec`, causing EACCES when spawning binaries.
// To be resilient, we download BOTH:
// - a native binary (best if executable)
// - a Python script fallback (can be invoked via python3)
const OUT_DIR = path.join(__dirname, '..', 'bin');
const OUT_FILE = platform === 'win32' ? path.join(OUT_DIR, 'yt-dlp.exe') : path.join(OUT_DIR, 'yt-dlp');
const OUT_PY = path.join(OUT_DIR, 'yt-dlp.py');

function log(msg) {
  process.stdout.write(`[ensure-ytdlp] ${msg}\n`);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return resolve(download(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      reject(err);
    });
  });
}

async function main() {
  log(`platform=${platform} arch=${arch}`);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  if (fs.existsSync(OUT_FILE)) {
    log(`yt-dlp already present at ${OUT_FILE}`);
  }

  if (fs.existsSync(OUT_PY)) {
    log(`yt-dlp python already present at ${OUT_PY}`);
  }

  // Official release URLs
  if (!fs.existsSync(OUT_FILE)) {
    const url = platform === 'win32'
      ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
      : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
    log(`downloading ${url} -> ${OUT_FILE}`);
    await download(url, OUT_FILE);
    if (platform !== 'win32') {
      try { fs.chmodSync(OUT_FILE, 0o755); } catch {}
    }
  }

  if (!fs.existsSync(OUT_PY)) {
    const pyUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.py';
    log(`downloading ${pyUrl} -> ${OUT_PY}`);
    await download(pyUrl, OUT_PY);
  }

  log('done');
}

main().catch((err) => {
  log(`failed: ${err.message}`);
  // Don't hard-fail install on some hosts; the app can still run for non-yt-dlp routes.
  process.exitCode = 0;
});
