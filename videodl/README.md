# 🎬 Saadi Video Downloader (SVD)

A progressive web app (installable) to download videos from supported platforms using yt-dlp.

## ✨ Features

- **1000+ Supported Sites** via yt-dlp (YouTube, Facebook, Instagram, TikTok, Twitter/X, Vimeo, Dailymotion, etc.)
- **HD Quality Selection** — 4K, 2K, 1080p FHD, 720p HD, 480p SD, Audio-only MP3
- **PWA Installable** — Add to home screen on Android/iOS, works like a native app
- **Offline Support** — Service Worker caches the app shell
- **Download History** — Tracks all your downloads locally
- **Drag & Drop** — Drop a URL onto the app
- **Rate Limited API** — Prevents abuse
- **Cinematic Dark UI** — Stunning design with Bebas Neue typography

---

## 🚀 Deployment on Hostinger (LiteSpeed)

### Prerequisites
- Hostinger VPS or Business Hosting with Node.js support
- SSH access
- Node.js 18+ installed

### Option A: Hostinger Node.js Hosting (Recommended)

1. **Login to Hostinger hPanel**
2. Go to **Websites → Manage → Node.js**
3. Set Node.js version to **18.x** or higher
4. Set startup file to `server.js`

5. **Upload files via File Manager or Git:**
   ```bash
   # Via SSH
   ssh user@yourserver.com
   cd public_html  # or your app directory
   git clone https://github.com/yourrepo/videodl.git .
   ```

6. **Install dependencies and build:**
   ```bash
   npm run setup
   ```
   This installs backend deps AND builds the frontend.

7. **Configure environment:**
   ```bash
   cp .env.example .env
   nano .env
   # Set FRONTEND_URL=https://yourdomain.com
   ```

8. **Start the app:**
   ```bash
   # With PM2 (recommended for production)
   npm install -g pm2
   pm2 start server.js --name videodl
   pm2 save
   pm2 startup

   # Or just
   npm start
   ```

9. **The app serves everything** — Express serves the built React frontend AND handles API calls.

---

### Option B: Shared Hosting + External API

If you only have shared hosting (no Node.js):

1. Build the frontend locally:
   ```bash
   cd frontend
   npm install
   # Point the frontend to your backend API origin
   # Windows (PowerShell):
   $env:VITE_API_BASE='https://your-backend-domain.com'
   # macOS/Linux:
   # VITE_API_BASE='https://your-backend-domain.com'
   npm run build
   ```

2. Upload the `frontend/dist/` folder contents to `public_html/`

3. Deploy the backend (`server.js`, `package.json`) to a VPS/Render/Railway (must support Node.js + yt-dlp)

4. Set backend environment:
   - `FRONTEND_URL=https://svd.saadimath.com`

---

### Option C: Railway / Render / Fly.io (Easiest)

Click "Deploy to Railway" or use:
```bash
railway init
railway up
```

---

## 🛠️ Local Development

```bash
# 1. Install backend deps
npm install

# 2. Install frontend deps & start dev server
cd frontend
npm install
npm run dev   # starts Vite on http://localhost:5173

# 3. In another terminal, start backend
cd ..
npm run dev   # starts Express on http://localhost:3001
```

The Vite dev server proxies `/api` to `:3001` automatically.

---

## 📁 Project Structure

```
videodl/
├── server.js              # Express backend with yt-dlp
├── package.json           # Backend dependencies
├── .env.example           # Environment variables template
├── .htaccess              # LiteSpeed / Apache config
├── frontend/
│   ├── vite.config.js     # Vite + PWA plugin config
│   ├── index.html         # HTML entry point
│   ├── public/
│   │   └── icons/         # PWA icons (192, 512, 180px)
│   └── src/
│       ├── main.jsx       # React entry
│       ├── App.jsx        # Main app component
│       ├── App.css        # All styles
│       └── index.css      # Global reset + variables
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/info` | Get video metadata + quality options |
| POST | `/api/download` | Stream video download |
| POST | `/api/direct-url` | Get direct download URL |

### POST /api/info
```json
{ "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
```

### POST /api/download
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/...",
  "quality_id": "1080p",
  "title": "Video Title"
}
```

---

## ⚙️ yt-dlp Configuration

The app uses `yt-dlp-exec` which bundles yt-dlp automatically. It self-updates on startup.

**For YouTube authentication** (if you get bot-detection errors):
```bash
# Export cookies from your browser
yt-dlp --cookies-from-browser chrome --cookies /home/user/cookies.txt ""

# Set in .env:
YTDLP_COOKIES=/home/user/cookies.txt
```

Then update `server.js` to include `--cookies "${process.env.YTDLP_COOKIES}"` in the command.

---

## 🔒 Legal Notice

This tool is for **personal use only**. Always respect:
- YouTube's Terms of Service
- Facebook's Terms of Service  
- Copyright laws in your jurisdiction
- Platform-specific download restrictions

Do not use to download copyrighted content without permission.

---

## 📱 PWA Installation

- **Android (Chrome)**: Tap the "Install App" button in the header, or use Chrome's menu → "Add to Home Screen"
- **iOS (Safari)**: Share → Add to Home Screen
- **Desktop (Chrome/Edge)**: Click the install icon in the address bar

---

## 🐛 Troubleshooting

**"Failed to fetch video info"**
- The URL may be invalid or the video is private
- YouTube may be rate-limiting — wait a few minutes
- Try updating yt-dlp: `yt-dlp -U`

**"Download failed"**
- Age-restricted videos require authentication (cookies)
- DRM-protected content cannot be downloaded
- Try a different quality option

**PWA not installing**
- Must be served over HTTPS
- Check browser console for manifest errors

---

## 📄 License

MIT — Build freely, use responsibly.
