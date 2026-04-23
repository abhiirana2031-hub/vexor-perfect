import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Shield, User, Mail, Building2, Briefcase, Phone, Globe, Activity, Search, X, Camera, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { UserProfiles } from '@/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

export default function ScannerView() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scannedUser, setScannedUser] = useState<UserProfiles | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error("Scanner stop error", err));
      }
    };
  }, []);

  const startScanner = async () => {
    setPermissionState('requesting');
    setError(null);
    
    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      
      const config = { 
        fps: 20, 
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      );
      
      setPermissionState('granted');
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setPermissionState('denied');
      setError("Camera permission denied or not available. Please allow access in browser settings.");
    }
  };

  async function onScanSuccess(decodedText: string) {
    if (scannerRef.current) {
      await scannerRef.current.stop();
    }
    
    setIsCameraActive(false);
    setPermissionState('idle');
    console.log("Neural Scanned Token:", decodedText);
    
    try {
      const data = JSON.parse(decodedText);
      if (data.type === 'user_id' && data.id) {
        setScannedResult(data.id);
        fetchUserProfile(data.id);
      } else {
        setError("Invalid QR Code protocol. Only Vexora Neural IDs are supported.");
      }
    } catch (e) {
      setError("Failed to decrypt neural token. Ensure you're scanning a valid Digital ID.");
    }
  }

  function onScanFailure(error: any) {
    // Standard fail loop
  }

  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await BaseCrudService.getById<UserProfiles>('userprofiles', userId);
      setScannedUser(user);
    } catch (err) {
      console.error("Error fetching scanned user:", err);
      setError("User profile not found in archives.");
      setIsCameraActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedUser(null);
    setScannedResult(null);
    setError(null);
    setIsCameraActive(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10">
            <Activity className={`w-3 h-3 text-secondary ${isCameraActive ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
               {isCameraActive ? 'Neural Link Active' : 'Scanner Offline'}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Neural Scanner</h2>
          <p className="text-foreground/40 text-sm font-medium">Verify operative credentials via high-fidelity QR synchronization.</p>
        </div>
        
        {scannedUser || isCameraActive ? (
          <Button 
            onClick={resetScanner}
            variant="outline"
            className="border-white/10 hover:bg-white/5 gap-2 h-12 px-6"
          >
            <X className="w-4 h-4" />
            {scannedUser ? 'Reset Scanner' : 'Abort Scan'}
          </Button>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        {!scannedUser ? (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="w-full max-w-lg aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl relative">
              {isCameraActive ? (
                 <>
                    <div id="reader" className="w-full h-full"></div>
                    {/* Overlay Decor */}
                    <div className="absolute inset-0 pointer-events-none border-[20px] border-[#03050a] rounded-[3rem]" />
                    <div className="absolute inset-8 pointer-events-none border border-secondary/20 rounded-[2rem] animate-pulse" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary/40 shadow-[0_0_15px_rgba(var(--secondary),0.5)] animate-scan-line" />
                 </>
              ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-12 text-center">
                    <motion.div 
                      animate={{ 
                        scale: permissionState === 'requesting' ? [1, 1.1, 1] : 1,
                        rotate: permissionState === 'requesting' ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ repeat: permissionState === 'requesting' ? Infinity : 0, duration: 0.5 }}
                      className="p-8 rounded-full bg-secondary/5 border border-secondary/20 border-dashed relative"
                    >
                       <Camera className={`w-16 h-16 ${permissionState === 'requesting' ? 'text-secondary' : 'text-secondary/40'}`} />
                       {permissionState === 'requesting' && (
                         <div className="absolute inset-0 rounded-full border-2 border-secondary animate-ping" />
                       )}
                    </motion.div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-black uppercase tracking-widest">Camera Authorization</h3>
                      <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] max-w-[200px] mx-auto">
                        We require neural optics access to synchronize with physical identification tokens.
                      </p>
                    </div>

                    <Button 
                       onClick={startScanner}
                       disabled={permissionState === 'requesting'}
                       className="bg-secondary text-secondary-foreground font-black uppercase tracking-[0.2em] px-10 h-16 rounded-2xl shadow-neon-cyan group relative overflow-hidden"
                    >
                       <span className="relative z-10 flex items-center gap-3">
                         {permissionState === 'requesting' ? 'Requesting Access...' : 'Initialize Lens'}
                         <Zap className={`w-4 h-4 group-hover:scale-125 transition-transform ${permissionState === 'requesting' ? 'animate-pulse' : ''}`} />
                       </span>
                       <motion.div 
                         className="absolute inset-0 bg-white/20"
                         initial={{ x: '-100%' }}
                         whileHover={{ x: '100%' }}
                         transition={{ duration: 0.5 }}
                       />
                    </Button>
                 </div>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl flex items-center gap-4 max-w-md w-full"
              >
                <Shield className="w-6 h-6 text-destructive flex-shrink-0" />
                <p className="text-xs font-black uppercase tracking-widest text-destructive">{error}</p>
              </motion.div>
            )}

            {isCameraActive && (
               <div className="text-center space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Align QR Identity Token within boundary</p>
                  <div className="flex justify-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
                     <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
                     <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]" />
                  </div>
               </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <Card className="lg:col-span-1 border-white/10 glass-effect p-8 !gap-0">
               <CardContent className="p-0 space-y-6">
                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-secondary/20 shadow-2xl">
                     {scannedUser.profilePhoto ? (
                        <Image 
                          src={scannedUser.profilePhoto}
                          alt={scannedUser.fullName}
                          className="w-full h-full object-cover"
                        />
                     ) : (
                        <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                           <User className="w-20 h-20 text-secondary/20" />
                        </div>
                     )}
                  </div>
                  <div className="text-center space-y-2">
                     <h3 className="text-3xl font-black tracking-tighter">{scannedUser.fullName}</h3>
                     <p className="text-secondary font-black uppercase tracking-widest text-[10px]">{scannedUser.jobTitle || 'Unassigned Role'}</p>
                  </div>
                  <div className="pt-4 flex justify-center gap-4">
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1 flex-1">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-[8px] font-black uppercase text-foreground/30">Status</span>
                        <span className="text-[10px] font-bold text-green-500 uppercase">Verified</span>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1 flex-1">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-[8px] font-black uppercase text-foreground/30">Access</span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase">Standard</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
               <div className="glass-effect p-10 !rounded-[2.5rem] border-white/10 space-y-10">
                  <div className="grid sm:grid-cols-2 gap-10">
                     <div className="space-y-2">
                        <div className="flex items-center gap-3 text-secondary mb-2">
                           <Mail className="w-4 h-4" />
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Neural Mail</span>
                        </div>
                        <p className="text-lg font-bold">{scannedUser.email || 'N/A'}</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3 text-secondary mb-2">
                           <Phone className="w-4 h-4" />
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Direct Comms</span>
                        </div>
                        <p className="text-lg font-bold">{scannedUser.phoneNumber || 'N/A'}</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3 text-secondary mb-2">
                           <Building2 className="w-4 h-4" />
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Affiliated Entity</span>
                        </div>
                        <p className="text-lg font-bold">{scannedUser.company || 'Vexora-Independent'}</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3 text-secondary mb-2">
                           <Globe className="w-4 h-4" />
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Global Node</span>
                        </div>
                        <p className="text-lg font-bold">{scannedUser.websiteUrl || 'No External Node'}</p>
                     </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-secondary">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Professional Synthesis</span>
                     </div>
                     <p className="text-foreground/60 leading-relaxed italic">
                        "{scannedUser.bio || 'This operative has not provided a neural bio description.'}"
                     </p>
                  </div>
               </div>

               <Button 
                  onClick={resetScanner}
                  className="w-full h-16 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl font-black uppercase tracking-[0.3em] text-xs"
               >
                  Authorize New Scan
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add these to global.css or local style block
// @keyframes scan-line {
//   0% { top: 0% }
//   100% { top: 100% }
// }
// .animate-scan-line { animation: scan-line 3s linear infinite; }
