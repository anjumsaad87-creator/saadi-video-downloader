import { useState, useEffect, useRef, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

// ── Icons (inline SVG components) ────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  play: 'M5 3l14 9-14 9V3z',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  clock: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  history: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM3.05 11H1M23 12h-2M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  info: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 16v-4M12 8h.01',
  paste: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9V2z',
  youtube: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  install: 'M12 2v12M8 10l4 4 4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17',
};

// ── Format helpers ────────────────────────────────────────────────────────
function formatDuration(secs) {
  if (!secs) return null;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatViews(n) {
  if (!n) return null;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B views`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M views`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K views`;
  return `${n} views`;
}

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
}

function getPlatformIcon(platform) {
  const p = (platform || '').toLowerCase();
  if (p.includes('youtube')) return Icons.youtube;
  if (p.includes('facebook') || p.includes('fb')) return Icons.facebook;
  return Icons.play;
}

function detectPlatform(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube';
    if (host.includes('facebook') || host.includes('fb.watch')) return 'Facebook';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X';
    if (host.includes('vimeo')) return 'Vimeo';
    if (host.includes('dailymotion')) return 'Dailymotion';
    return 'Video';
  } catch { return null; }
}

const BADGE_COLORS = {
  MAX: '#e63c3c',
  '4K': '#9b59b6',
  '2K': '#6c5ce7',
  FHD: '#0984e3',
  HD: '#00b894',
  SD: '#636e72',
  MP3: '#f5c842',
};

// ── API calls ─────────────────────────────────────────────────────────────
// For static hosting (no Node.js), set VITE_API_BASE to your backend origin, e.g.
// https://api.saadimath.com
const API = import.meta.env.VITE_API_BASE || '/api';

async function fetchInfo(url) {
  const res = await fetch(`${API}/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch video info');
  return data;
}

// ── History helpers ───────────────────────────────────────────────────────
function loadHistory() {
  try {
    const next = localStorage.getItem('svd_history');
    if (next) return JSON.parse(next);
    const legacy = localStorage.getItem('vdl_history');
    if (legacy) {
      localStorage.setItem('svd_history', legacy);
      return JSON.parse(legacy);
    }
    return [];
  }
  catch { return []; }
}
function saveHistory(h) {
  try { localStorage.setItem('svd_history', JSON.stringify(h.slice(0, 50))); }
  catch {}
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [tab, setTab] = useState('download'); // 'download' | 'history'
  const [history, setHistory] = useState(loadHistory);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // ── PWA install prompt ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    if (window.matchMedia('(display-mode: standalone)').matches) setIsInstalled(true);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ── Clipboard paste on focus ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.target === inputRef.current) return;
      const paste = (e.clipboardData || window.clipboardData)?.getData('text');
      if (paste?.startsWith('http')) { setUrl(paste); }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') { setIsInstalled(true); setInstallPrompt(null); }
  };

  const handleFetch = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) { toast.error('Paste a video URL first'); inputRef.current?.focus(); return; }
    setLoading(true);
    setInfo(null);
    setSelectedQuality(null);
    try {
      const data = await fetchInfo(trimmed);
      setInfo(data);
      setSelectedQuality(data.qualities?.[0] || null);
      toast.success('Video found!', { icon: '🎬' });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch video info');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFetch();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setUrl('');
    setInfo(null);
    setSelectedQuality(null);
    inputRef.current?.focus();
  };

  const handleDownload = async () => {
    if (!info || !selectedQuality) return;

    setDownloading(true);
    setDownloadProgress(0);

    // Simulate progress since streaming doesn't give us real progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => prev < 85 ? prev + Math.random() * 8 : prev);
    }, 800);

    try {
      abortRef.current = new AbortController();
      const res = await fetch(`${API}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          format: selectedQuality.format,
          quality_id: selectedQuality.id,
          title: info.title,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Download failed');
      }

      // Get filename from headers
      const disposition = res.headers.get('content-disposition') || '';
      const filenameMatch = disposition.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || `video_${selectedQuality.id}.mp4`;

      setDownloadProgress(95);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      setDownloadProgress(100);

      // Save to history
      const historyItem = {
        id: Date.now(),
        title: info.title,
        thumbnail: info.thumbnail,
        platform: info.platform,
        quality: selectedQuality.label,
        url: url.trim(),
        date: new Date().toISOString(),
      };
      const newHistory = [historyItem, ...history];
      setHistory(newHistory);
      saveHistory(newHistory);

      toast.success(`Downloaded: ${selectedQuality.label}`, { icon: '✅', duration: 4000 });
    } catch (err) {
      if (err.name === 'AbortError') {
        toast('Download cancelled', { icon: '🚫' });
      } else {
        toast.error(err.message || 'Download failed');
      }
    } finally {
      clearInterval(progressInterval);
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const cancelDownload = () => {
    abortRef.current?.abort();
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
    toast('History cleared', { icon: '🗑️' });
  };

  const removeHistoryItem = (id) => {
    const newH = history.filter(h => h.id !== id);
    setHistory(newH);
    saveHistory(newH);
  };

  // ── Drag & Drop URL ────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const text = e.dataTransfer.getData('text');
    if (text?.startsWith('http')) setUrl(text);
  };

  const platform = url ? detectPlatform(url) : null;

  return (
    <div className="app" onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1c1c2a', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Sans, sans-serif' },
      }} />

      {/* ── Background grid ── */}
      <div className="bg-grid" />
      <div className="bg-gradient" />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <img
                src="/icons/icon-192.png"
                alt="Saadi Video Downloader"
                width="28"
                height="28"
                style={{ borderRadius: 8, display: 'block' }}
              />
            </div>
            <span className="logo-text">Saadi<span> Video Downloader</span></span>
          </div>

          <nav className="nav">
            <button className={`nav-btn ${tab === 'download' ? 'active' : ''}`} onClick={() => setTab('download')}>
              <Icon d={Icons.download} size={16} />
              Download
            </button>
            <button className={`nav-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
              <Icon d={Icons.history} size={16} />
              History
              {history.length > 0 && <span className="badge">{history.length}</span>}
            </button>
          </nav>

          {!isInstalled && installPrompt && (
            <button className="install-btn" onClick={handleInstall}>
              <Icon d={Icons.install} size={15} />
              Install App
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {/* ── Download Tab ── */}
        {tab === 'download' && (
          <div className="download-tab animate-fadeIn">
            {/* Hero */}
            <div className="hero animate-fadeUp">
              <div className="hero-eyebrow">
                <span className="dot" />
                HD Video Downloader
              </div>
              <h1 className="hero-title">
                Download Any<br />
                <span className="title-accent">Video Instantly</span>
              </h1>
              <p className="hero-sub">
                YouTube · Facebook · Instagram · TikTok · Twitter/X · Vimeo
              </p>
            </div>

            {/* URL Input Card */}
            <div className={`input-card animate-fadeUp ${dragOver ? 'drag-over' : ''}`} style={{ animationDelay: '0.1s' }}>
              {dragOver && <div className="drop-overlay">Drop URL here</div>}

              <div className="input-label">
                <Icon d={Icons.link} size={14} />
                Video URL
                {platform && <span className="platform-tag">{platform} detected</span>}
              </div>

              <div className="input-row">
                <div className="input-wrapper">
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="url-input"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {url && (
                    <button className="clear-btn" onClick={handleClear} title="Clear">
                      <Icon d={Icons.x} size={14} />
                    </button>
                  )}
                </div>

                <button className="paste-btn" onClick={handlePaste} title="Paste from clipboard">
                  <Icon d={Icons.paste} size={16} />
                  Paste
                </button>

                <button
                  className={`fetch-btn ${loading ? 'loading' : ''}`}
                  onClick={handleFetch}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner" />Fetching...</>
                  ) : (
                    <><Icon d={Icons.info} size={16} />Get Video</>
                  )}
                </button>
              </div>

              <div className="supported-platforms">
                {['YouTube', 'Facebook', 'Instagram', 'TikTok', 'Twitter/X', 'Vimeo', 'Dailymotion', '+1000 more'].map(p => (
                  <span key={p} className="platform-chip">{p}</span>
                ))}
              </div>
            </div>

            {/* Video Info Card */}
            {info && (
              <div className="video-card animate-fadeUp" style={{ animationDelay: '0.05s' }}>
                <div className="video-info">
                  {info.thumbnail && (
                    <div className="thumbnail-wrap">
                      <img src={info.thumbnail} alt={info.title} className="thumbnail" loading="lazy" />
                      <div className="thumb-play">
                        <Icon d={Icons.play} size={20} fill="white" stroke="none" />
                      </div>
                      {info.duration && (
                        <div className="thumb-duration">{formatDuration(info.duration)}</div>
                      )}
                    </div>
                  )}
                  <div className="video-meta">
                    <div className="video-platform">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={getPlatformIcon(info.platform)} />
                      </svg>
                      {info.platform}
                    </div>
                    <h2 className="video-title">{info.title}</h2>
                    <div className="video-stats">
                      {info.uploader && (
                        <span className="stat">
                          <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={12} />
                          {info.uploader}
                        </span>
                      )}
                      {info.view_count && <span className="stat"><Icon d={Icons.eye} size={12} />{formatViews(info.view_count)}</span>}
                      {info.duration && <span className="stat"><Icon d={Icons.clock} size={12} />{formatDuration(info.duration)}</span>}
                    </div>
                  </div>
                </div>

                {/* Quality Selector */}
                <div className="quality-section">
                  <div className="quality-label">Select Quality</div>
                  <div className="quality-grid">
                    {info.qualities?.map(q => (
                      <button
                        key={q.id}
                        className={`quality-btn ${selectedQuality?.id === q.id ? 'selected' : ''}`}
                        onClick={() => setSelectedQuality(q)}
                      >
                        <div className="q-badge" style={{ background: BADGE_COLORS[q.badge] || '#636e72' }}>
                          {q.badge}
                        </div>
                        <div className="q-label">{q.label}</div>
                        {q.filesize && <div className="q-size">{formatBytes(q.filesize)}</div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                {downloading ? (
                  <div className="download-progress-wrap">
                    <div className="progress-header">
                      <span>Downloading {selectedQuality?.label}…</span>
                      <span className="progress-pct">{Math.round(downloadProgress)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${downloadProgress}%` }} />
                    </div>
                    <button className="cancel-btn" onClick={cancelDownload}>
                      <Icon d={Icons.x} size={14} />
                      Cancel Download
                    </button>
                  </div>
                ) : (
                  <button className="download-btn" onClick={handleDownload} disabled={!selectedQuality}>
                    <Icon d={Icons.download} size={20} />
                    Download {selectedQuality?.label}
                    {selectedQuality?.id === 'audio' ? ' (MP3)' : ' (MP4)'}
                  </button>
                )}
              </div>
            )}

            {/* Tips */}
            {!info && !loading && (
              <div className="tips animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                <div className="tips-grid">
                  {[
                    { icon: Icons.paste, title: 'Paste URL', desc: 'Copy any video link and paste it above, or use Ctrl+V anywhere on the page.' },
                    { icon: Icons.download, title: 'Choose Quality', desc: 'Pick from 4K, 1080p, 720p HD or audio-only MP3 download.' },
                    { icon: Icons.install, title: 'Install App', desc: 'Install Saadi Video Downloader (SVD) for quick access — no browser needed.' },
                  ].map((tip, i) => (
                    <div key={i} className="tip-card" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                      <div className="tip-icon"><Icon d={tip.icon} size={18} /></div>
                      <div className="tip-content">
                        <div className="tip-title">{tip.title}</div>
                        <div className="tip-desc">{tip.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── History Tab ── */}
        {tab === 'history' && (
          <div className="history-tab animate-fadeIn">
            <div className="history-header">
              <h2 className="section-title">Download History</h2>
              {history.length > 0 && (
                <button className="clear-history-btn" onClick={clearHistory}>
                  <Icon d={Icons.trash} size={14} />
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Icon d={Icons.download} size={32} stroke="var(--text3)" /></div>
                <div className="empty-title">No downloads yet</div>
                <div className="empty-desc">Your download history will appear here.</div>
                <button className="empty-cta" onClick={() => setTab('download')}>Start Downloading</button>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item, i) => (
                  <div key={item.id} className="history-item animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="history-thumb" loading="lazy" />
                    )}
                    <div className="history-meta">
                      <div className="history-title">{item.title}</div>
                      <div className="history-details">
                        <span>{item.platform}</span>
                        <span className="sep">·</span>
                        <span>{item.quality}</span>
                        <span className="sep">·</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="history-actions">
                      <button className="redownload-btn" onClick={() => { setUrl(item.url); setTab('download'); handleFetch(); }} title="Re-download">
                        <Icon d={Icons.refresh} size={14} />
                      </button>
                      <button className="remove-btn" onClick={() => removeHistoryItem(item.id)} title="Remove">
                        <Icon d={Icons.trash} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>Saadi Video Downloader (SVD) uses yt-dlp · For personal use only · Respect copyright laws</p>
      </footer>
    </div>
  );
}
