require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const os = require('os');
const { create: createYtDlp } = require('yt-dlp-exec');
const https = require('https');
const http = require('http');

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3001;

// Hostinger (and most Node hosting) runs behind a reverse proxy and sets
// X-Forwarded-* headers. This is required for correct rate-limiting.
app.set('trust proxy', 1);

// ── Security & Middleware ──────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(s => s.trim()).filter(Boolean)
    : '*',
  methods: ['GET', 'POST'],
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please wait 15 minutes.' },
});
app.use('/api/', apiLimiter);

// ── Serve Frontend Build ──────────────────────────────────────────────────
const frontendDist = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// ── Helpers ───────────────────────────────────────────────────────────────
const SUPPORTED_DOMAINS = [
  'youtube.com', 'youtu.be', 'www.youtube.com',
  'm.youtube.com', 'music.youtube.com',
  'facebook.com', 'fb.watch', 'www.facebook.com',
  'm.facebook.com', 'web.facebook.com',
  'instagram.com', 'www.instagram.com',
  'twitter.com', 'x.com', 'www.twitter.com',
  'tiktok.com', 'www.tiktok.com',
  'vimeo.com', 'www.vimeo.com',
  'dailymotion.com', 'www.dailymotion.com',
];

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
      SUPPORTED_DOMAINS.some(d => parsed.hostname === d || parsed.hostname.endsWith('.' + d));
  } catch { return false; }
}

function getYtDlp() {
  // Use yt-dlp-exec Node API so we don't depend on a global yt-dlp binary.
  // This is critical on hosts where /bin/sh can't find `yt-dlp`.
  const localBin = process.platform === 'win32'
    ? path.join(__dirname, 'bin', 'yt-dlp.exe')
    : path.join(__dirname, 'bin', 'yt-dlp');
  const localPy = path.join(__dirname, 'bin', 'yt-dlp.py');

  // Some hosts mount app directories as `noexec` (EACCES when spawning binaries).
  // If python3 is available, use the Python script fallback to avoid execute-bit issues.
  if (process.platform !== 'win32' && fs.existsSync(localPy)) {
    return createYtDlp('python3', { 
      processOptions: { 
        // Run: python3 <script> ...args
        // yt-dlp-exec will append args after the executable; we inject the script first.
        env: process.env,
      },
      // Prepend script path as the first argument.
      args: [localPy],
    });
  }

  // Prefer our downloaded binary if present.
  if (fs.existsSync(localBin)) {
    return createYtDlp(localBin);
  }

  // Fallback: default yt-dlp-exec behavior (may still fail on some hosts).
  return require('yt-dlp-exec');
}

function getYtDlpCommonArgs() {
  const args = [
    '--no-playlist',
    '--no-warnings',
    '--geo-bypass',
    '--geo-bypass-country US',
    '--socket-timeout 20',
    '--retries 3',
    '--fragment-retries 3',
    '--retry-sleep 1:3',
    '--concurrent-fragments 4',
    '--add-header "referer: https://www.youtube.com/"',
    '--add-header "user-agent: Mozilla/5.0"',
  ];

  if (process.env.YTDLP_COOKIES) {
    // NOTE: file path must exist on the server.
    args.push(`--cookies "${process.env.YTDLP_COOKIES.replace(/"/g, '\\"')}"`);
  }
    if (process.env.YTDLP_PROXY) {
      args.push(`--proxy "${process.env.YTDLP_PROXY.replace(/"/g, '\\"')}"`);
    }
  return args;
}

async function downloadToFile(url, filePath, headers = {}) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

  const client = url.startsWith('https:') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(url, { headers }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(downloadToFile(res.headers.location, filePath, headers));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const out = fs.createWriteStream(filePath, { mode: 0o600 });
      res.pipe(out);
      out.on('finish', () => out.close(resolve));
      out.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function ensureRemoteCookies() {
  const cookiesUrl = process.env.YTDLP_COOKIES_URL;
  if (!cookiesUrl) return;

  // Do not log the URL (it may contain secrets).
  const dest = path.join(os.tmpdir(), 'svd-cookies.txt');
  const headers = {};
  if (process.env.YTDLP_COOKIES_AUTH) {
    headers['Authorization'] = process.env.YTDLP_COOKIES_AUTH;
  }

  try {
    await downloadToFile(cookiesUrl, dest, headers);
    process.env.YTDLP_COOKIES = dest;
    const st = await fs.promises.stat(dest);
    console.log(`Cookies file downloaded for yt-dlp (bytes=${st.size}).`);
  } catch (e) {
    console.warn(`Cookies download failed: ${e.message}`);
  }
}

async function getCookiesStatus() {
  const cookiesPath = process.env.YTDLP_COOKIES;
  if (!cookiesPath) return { configured: false };
  try {
    const st = await fs.promises.stat(cookiesPath);
    return { configured: true, exists: true, bytes: st.size, mtimeMs: st.mtimeMs, path: cookiesPath };
  } catch {
    return { configured: true, exists: false, path: cookiesPath };
  }
}

async function getVideoInfo(url) {
  const ytDlp = getYtDlp();
  const stdout = await ytDlp(url, {
    dumpJson: true,
    noPlaylist: true,
    noWarnings: true,
    geoBypass: true,
    geoBypassCountry: 'US',
    socketTimeout: 20,
    retries: 3,
    fragmentRetries: 3,
    retrySleep: '1:3',
    concurrentFragments: 4,
    addHeader: ['referer: https://www.youtube.com/', 'user-agent: Mozilla/5.0'],
    ...(process.env.YTDLP_COOKIES ? { cookies: process.env.YTDLP_COOKIES } : {}),
    ...(process.env.YTDLP_PROXY ? { proxy: process.env.YTDLP_PROXY } : {}),
  });
  return JSON.parse(String(stdout).trim());
}

async function updateYtDlp() {
  try {
    // yt-dlp-exec manages yt-dlp internally; updating via CLI may not exist on hosts.
    // Keep this as a best-effort no-op.
    console.log('yt-dlp update skipped (managed by yt-dlp-exec)');
  } catch (e) {
    console.warn('yt-dlp update skipped:', e.message);
  }
}

// ── API Routes ────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get video info + available formats
app.post('/api/info', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required.' });
  }

  const cleanUrl = url.trim();
  if (!isValidUrl(cleanUrl)) {
    return res.status(400).json({ error: 'Unsupported URL. Please use YouTube, Facebook, Instagram, TikTok, Twitter/X, Vimeo, or Dailymotion links.' });
  }

  try {
    // If remote cookies are configured but missing/empty (common after restarts), try to fetch again.
    if (process.env.YTDLP_COOKIES_URL) {
      const st = await getCookiesStatus();
      if (!st.configured || !st.exists || !st.bytes) {
        await ensureRemoteCookies();
      }
    }

    const info = await getVideoInfo(cleanUrl);

    // Build quality options from formats
    const videoFormats = (info.formats || [])
      .filter(f => f.vcodec && f.vcodec !== 'none' && f.ext === 'mp4')
      .sort((a, b) => (b.height || 0) - (a.height || 0));

    const seen = new Set();
    const qualities = [];

    // Add merged mp4 options
    const heightLabels = [2160, 1440, 1080, 720, 480, 360, 240, 144];
    for (const h of heightLabels) {
      const fmt = videoFormats.find(f => f.height === h);
      if (fmt && !seen.has(h)) {
        seen.add(h);
        qualities.push({
          id: `${h}p`,
          label: h >= 1080 ? `${h}p HD` : h >= 720 ? `${h}p HD` : `${h}p`,
          height: h,
          format: `bestvideo[height<=${h}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`,
          filesize: fmt.filesize || fmt.filesize_approx || null,
          badge: h >= 1080 ? (h >= 2160 ? '4K' : h >= 1440 ? '2K' : 'FHD') : h >= 720 ? 'HD' : 'SD',
        });
      }
    }

    // Always add best + audio-only
    qualities.unshift({
      id: 'best',
      label: 'Best Quality',
      height: null,
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
      badge: 'MAX',
    });
    qualities.push({
      id: 'audio',
      label: 'Audio Only',
      height: null,
      format: 'bestaudio[ext=m4a]/bestaudio',
      badge: 'MP3',
    });

    const response = {
      title: info.title || 'Unknown Title',
      thumbnail: info.thumbnail || null,
      duration: info.duration || null,
      uploader: info.uploader || info.channel || null,
      view_count: info.view_count || null,
      platform: info.extractor_key || info.extractor || 'Unknown',
      qualities: qualities.slice(0, 8),
      description: (info.description || '').slice(0, 200),
    };

    res.json(response);
  } catch (err) {
    console.error('Info error:', err.message);
    const msg = String(err?.message || '');
    if (msg.toLowerCase().includes("sign in to confirm you're not a bot") || msg.toLowerCase().includes('not a bot') || msg.toLowerCase().includes('cookies-from-browser') || msg.toLowerCase().includes('use --cookies')) {
      return res.status(400).json({
        error: 'YouTube requires verification on server IPs. Add cookies (YTDLP_COOKIES) or try again later.'
      });
    }
    if (msg.includes('Private video') || msg.includes('not available')) {
      return res.status(400).json({ error: 'This video is private or unavailable.' });
    }
    if (msg.toLowerCase().includes('age') && msg.toLowerCase().includes('restricted')) {
      return res.status(400).json({ error: 'Age-restricted video. Sign-in (cookies) is required.' });
    }
    res.status(500).json({ error: 'Failed to fetch video info. The URL may be invalid or the platform may be temporarily unavailable.' });
  }
});

// Stream download
app.post('/api/download', async (req, res) => {
  const { url, format, quality_id } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: 'URL and format are required.' });
  }

  const cleanUrl = url.trim();
  if (!isValidUrl(cleanUrl)) {
    return res.status(400).json({ error: 'Invalid or unsupported URL.' });
  }

  const tmpDir = os.tmpdir();
  const fileId = uuidv4();
  const isAudio = quality_id === 'audio';
  const outputTemplate = path.join(tmpDir, `${fileId}.%(ext)s`);

  const ytDlp = getYtDlp();

  try {
    console.log(`Downloading [${quality_id}]: ${cleanUrl}`);
    await ytDlp(cleanUrl, {
      format,
      mergeOutputFormat: 'mp4',
      output: outputTemplate,
      noPlaylist: true,
      noWarnings: true,
      geoBypass: true,
      geoBypassCountry: 'US',
      socketTimeout: 20,
      retries: 3,
      fragmentRetries: 3,
      retrySleep: '1:3',
      concurrentFragments: 4,
      addHeader: ['referer: https://www.youtube.com/', 'user-agent: Mozilla/5.0'],
      ...(process.env.YTDLP_COOKIES ? { cookies: process.env.YTDLP_COOKIES } : {}),
      ...(process.env.YTDLP_PROXY ? { proxy: process.env.YTDLP_PROXY } : {}),
      ...(isAudio ? { extractAudio: true, audioFormat: 'mp3', audioQuality: 0 } : {}),
    }, { timeout: 15 * 60 * 1000 });

    // Find the output file
    const files = fs.readdirSync(tmpDir).filter(f => f.startsWith(fileId));
    if (!files.length) throw new Error('Downloaded file not found');

    const filePath = path.join(tmpDir, files[0]);
    const ext = path.extname(files[0]).slice(1);
    const stat = fs.statSync(filePath);

    // Sanitize title for filename
    const safeTitle = (req.body.title || 'video')
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 80);

    const downloadName = `${safeTitle}_${quality_id}.${ext}`;

    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('X-Download-Size', stat.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      // Cleanup temp file after 10s
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch {}
      }, 10000);
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.end();
    });

  } catch (err) {
    console.error('Download error:', err.message);
    // Cleanup on error
    try {
      const files = fs.readdirSync(tmpDir).filter(f => f.startsWith(fileId));
      files.forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
    } catch {}

    const msg = String(err?.message || 'Download failed');
    const isTimeout = msg.toLowerCase().includes('timed out');
    res.status(isTimeout ? 504 : 500).json({
      error: 'Download failed. The video may have DRM protection, be geo-blocked, or require authentication.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Proxy download info (get direct URL for client-side download)
app.post('/api/direct-url', async (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) return res.status(400).json({ error: 'Missing params' });

  try {
    const ytDlp = getYtDlp();
    const stdout = await ytDlp(url.trim(), {
      getUrl: true,
      format,
      noPlaylist: true,
      ...(process.env.YTDLP_COOKIES ? { cookies: process.env.YTDLP_COOKIES } : {}),
      ...(process.env.YTDLP_PROXY ? { proxy: process.env.YTDLP_PROXY } : {}),
    }, { timeout: 45000 });
    const urls = String(stdout).trim().split('\n').filter(Boolean);
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve direct URL.' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  const index = path.join(frontendDist, 'index.html');
  if (fs.existsSync(index)) {
    res.sendFile(index);
  } else {
    res.status(404).send('Frontend not built. Run: npm run build:frontend');
  }
});

// ── Start ─────────────────────────────────────────────────────────────────
async function start() {
  // Fetch cookies (optional) for providers that require sign-in/bot verification.
  if (process.env.YTDLP_COOKIES_URL) {
    await ensureRemoteCookies();
    const st = await getCookiesStatus();
    if (st.exists) console.log(`Cookies status: ready (bytes=${st.bytes}).`);
    else console.warn('Cookies status: configured but file is missing.');
  }

  app.listen(PORT, () => {
    console.log(`\n🎬 Saadi Video Downloader (SVD) server running on port ${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api/health\n`);
    // Update yt-dlp on startup
    updateYtDlp();
  });
}

start();
