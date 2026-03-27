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

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3001;

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

function getYtDlpPath() {
  // Try yt-dlp-exec binary path, then fallback to system yt-dlp
  try {
    return require('yt-dlp-exec').path || 'yt-dlp';
  } catch {
    return 'yt-dlp';
  }
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

async function getVideoInfo(url) {
  const ytDlp = getYtDlpPath();
  const cmd = [
    `"${ytDlp}"`,
    ...getYtDlpCommonArgs(),
    '--dump-json',
    `"${url}"`,
  ].join(' ');
  const { stdout } = await execAsync(cmd, { timeout: 45000 });
  return JSON.parse(stdout.trim());
}

async function updateYtDlp() {
  try {
    const ytDlp = getYtDlpPath();
    await execAsync(`"${ytDlp}" -U`, { timeout: 60000 });
    console.log('yt-dlp updated successfully');
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
    if (err.message.includes('Private video') || err.message.includes('not available')) {
      return res.status(400).json({ error: 'This video is private or unavailable.' });
    }
    if (err.message.includes('age')) {
      return res.status(400).json({ error: 'Age-restricted video. Cannot download.' });
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

  const ytDlp = getYtDlpPath();
  const formatArg = format.replace(/"/g, '\\"');

  const cmd = [
    `"${ytDlp}"`,
    `--format "${formatArg}"`,
    '--merge-output-format mp4',
    ...getYtDlpCommonArgs(),
    `--output "${outputTemplate}"`,
    isAudio ? '--extract-audio --audio-format mp3 --audio-quality 0' : '',
    `"${cleanUrl}"`,
  ].filter(Boolean).join(' ');

  try {
    console.log(`Downloading [${quality_id}]: ${cleanUrl}`);
    await execAsync(cmd, { timeout: 15 * 60 * 1000 }); // 15 min timeout

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
    const ytDlp = getYtDlpPath();
    const { stdout } = await execAsync(
      `"${ytDlp}" --get-url --format "${format}" --no-playlist "${url.trim()}"`,
      { timeout: 30000 }
    );
    const urls = stdout.trim().split('\n').filter(Boolean);
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
app.listen(PORT, () => {
  console.log(`\n🎬 Saadi Video Downloader (SVD) server running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health\n`);
  // Update yt-dlp on startup
  updateYtDlp();
});
