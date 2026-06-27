import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { Shield, User, Mail, Building2, Briefcase, Phone, Globe, Activity, X, Camera, Zap, Clock, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { UserProfiles } from '@/entities';
import { Image } from '@/components/ui/image';

// ─── Scan History Helpers ───────────────────────────────────────────────────
interface ScanRecord {
  userId: string;
  userName: string;
  userEmail?: string;
  scannedAt: number; // timestamp ms
}

const HISTORY_KEY = 'vexor_scan_history';

function loadHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const all: ScanRecord[] = JSON.parse(raw);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return all.filter(r => r.scannedAt > cutoff);
  } catch { return []; }
}

function saveToHistory(record: ScanRecord) {
  const history = loadHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// ─── QR Decode via statically imported jsQR ─────────────────────────────────
function decodeQRFromVideo(video: HTMLVideoElement): string | null {
  if (video.videoWidth === 0 || video.videoHeight === 0) return null;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  return code?.data || null;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ScannerView() {
  const [scannedUser, setScannedUser] = useState<UserProfiles | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isScanning = useRef(false);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    isScanning.current = false;
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setPermissionState('requesting');
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera API not available. Please use a modern browser (Chrome, Firefox, Edge) with HTTPS.');
      setPermissionState('denied');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setPermissionState('granted');

      // Give React a tick to render the video element
      await new Promise(r => setTimeout(r, 150));

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Start QR scanning loop
      isScanning.current = true;
      scanIntervalRef.current = setInterval(() => {
        if (!isScanning.current || !videoRef.current) return;
        try {
          const result = decodeQRFromVideo(videoRef.current);
          if (result) {
            isScanning.current = false;
            stopCamera();
            handleQRResult(result);
          }
        } catch (e) {
          // continue scanning
        }
      }, 300);

    } catch (err: any) {
      setPermissionState('denied');
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Click the camera icon in your browser\'s address bar and allow access, then try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application. Close other apps and try again.');
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const handleQRResult = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      if (data.type === 'user_id' && data.id) {
        fetchUserProfile(data.id);
      } else {
        setError('Invalid QR code. Only Vexor Digital IDs are supported.');
      }
    } catch {
      setError('Could not read QR data. Ensure you\'re scanning a valid Vexor Digital ID.');
    }
  };

  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await BaseCrudService.getById<UserProfiles>('userprofiles', userId);
      setScannedUser(user);
      // Save to history
      const record: ScanRecord = {
        userId: user._id!,
        userName: user.fullName || 'Unknown',
        userEmail: user.email,
        scannedAt: Date.now(),
      };
      saveToHistory(record);
      setHistory(loadHistory());
    } catch {
      setError('User profile not found in registry.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    stopCamera();
    setScannedUser(null);
    setError(null);
    setPermissionState('idle');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
            <Activity className={`w-3 h-3 text-white ${isCameraActive ? 'animate-pulse' : 'opacity-30'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              {isCameraActive ? 'Camera Active' : 'Scanner Offline'}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Neural Scanner</h2>
          <p className="text-white/40 text-sm">Verify operative credentials via QR identity token.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(h => !h)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-semibold uppercase tracking-wider transition-all ${
              showHistory ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            History ({history.length})
          </button>
          {(scannedUser || isCameraActive) && (
            <button
              onClick={resetScanner}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-[11px] font-semibold uppercase tracking-wider transition-all"
            >
              <X className="w-4 h-4" />
              {scannedUser ? 'New Scan' : 'Stop'}
            </button>
          )}
        </div>
      </div>

      {/* 24-Hour History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/70 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last 24 Hours
                </h3>
                <span className="text-[10px] text-white/30 uppercase tracking-widest">{history.length} scans</span>
              </div>
              {history.length === 0 ? (
                <p className="text-center text-white/20 text-xs uppercase tracking-widest py-6">No scans recorded in the last 24 hours</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {history.map((record, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{record.userName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{record.userName}</p>
                        <p className="text-[10px] text-white/30 truncate">{record.userEmail || record.userId}</p>
                      </div>
                      <span className="text-[10px] text-white/30 uppercase tracking-wider flex-shrink-0">{timeAgo(record.scannedAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Fetching Neural Profile...</p>
            </div>
          </motion.div>
        ) : !scannedUser ? (
          <motion.div key="scanner" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-6">
            {/* Camera viewport */}
            <div className="w-full max-w-md aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 bg-black relative">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  {/* Scan overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-8 border border-white/20 rounded-2xl" />
                    <motion.div
                      className="absolute left-8 right-8 h-0.5 bg-white/40"
                      animate={{ top: ['15%', '85%', '15%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Corner markers */}
                    {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
                      <div key={i} className={`absolute ${pos} w-5 h-5 border-white/60 ${
                        i === 0 ? 'border-t-2 border-l-2 rounded-tl-lg' :
                        i === 1 ? 'border-t-2 border-r-2 rounded-tr-lg' :
                        i === 2 ? 'border-b-2 border-l-2 rounded-bl-lg' :
                        'border-b-2 border-r-2 rounded-br-lg'
                      }`} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-10 text-center">
                  <motion.div
                    animate={{ scale: permissionState === 'requesting' ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="p-8 rounded-full bg-white/5 border border-white/10 border-dashed relative"
                  >
                    <Camera className={`w-16 h-16 ${permissionState === 'requesting' ? 'text-white' : 'text-white/20'}`} />
                    {permissionState === 'requesting' && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    )}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">Camera Access</h3>
                    <p className="text-[11px] text-white/30 uppercase tracking-wider max-w-[200px] mx-auto">
                      Allow camera permission to scan QR identity tokens
                    </p>
                  </div>
                  <button
                    onClick={startCamera}
                    disabled={permissionState === 'requesting'}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {permissionState === 'requesting' ? 'Requesting...' : 'Initialize Lens'}
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-start gap-4 max-w-md w-full">
                <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {isCameraActive && (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                Point camera at a Vexor QR Identity Token
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-5">
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                {scannedUser.profilePhoto ? (
                  <Image src={scannedUser.profilePhoto} alt={scannedUser.fullName || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <User className="w-16 h-16 text-white/10" />
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black tracking-tighter text-white">{scannedUser.fullName}</h3>
                <p className="text-[11px] text-white/40 uppercase tracking-widest">{scannedUser.jobTitle || 'No Role Assigned'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <Activity className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block">Status</span>
                  <span className="text-[11px] font-bold text-green-400">Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <Shield className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block">Access</span>
                  <span className="text-[11px] font-bold text-blue-400">Standard</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Mail, label: 'Neural Mail', value: scannedUser.email || 'N/A' },
                  { icon: Phone, label: 'Direct Comms', value: scannedUser.phoneNumber || 'N/A' },
                  { icon: Building2, label: 'Affiliated Entity', value: scannedUser.company || 'Independent' },
                  { icon: Globe, label: 'Global Node', value: scannedUser.websiteUrl || 'None' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white/30">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase tracking-widest">{label}</span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{value}</p>
                  </div>
                ))}
              </div>

              {scannedUser.bio && (
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-2">
                  <div className="flex items-center gap-2 text-white/30">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-[9px] uppercase tracking-widest">Bio</span>
                  </div>
                  <p className="text-sm text-white/60 italic leading-relaxed">"{scannedUser.bio}"</p>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs text-white/60 hover:text-white transition-all"
              >
                Authorize New Scan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
