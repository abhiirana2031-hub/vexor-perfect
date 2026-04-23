import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Send, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThankYouDialog({ isOpen, onClose }: ThankYouDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#03050a] border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(var(--secondary),0.1)] rounded-[3rem]">
        <div className="relative p-12 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            {/* Animated Icon Header */}
            <div className="relative">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center relative z-20"
              >
                <ShieldCheck className="h-12 w-12 text-secondary" />
              </motion.div>
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-secondary/20 rounded-3xl blur-2xl z-10" 
              />
            </div>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary mb-2 block">Signal Encrypted</span>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic text-foreground">
                  Transmission<br />
                  <span className="text-secondary">Successful</span>
                </h2>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-foreground/50 font-medium leading-relaxed max-w-xs mx-auto"
              >
                Your data packet has been successfully uploaded to our core archives. Our operatives will analyze the payload and establish a secure downlink shortly.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full pt-4"
            >
              <button
                onClick={onClose}
                className="futuristic-button w-full h-16 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
                  Terminate Session
                  <Send className="w-4 h-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </span>
                <div className="btn-glow" />
              </button>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/20" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
