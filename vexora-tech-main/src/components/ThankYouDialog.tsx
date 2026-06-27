import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThankYouDialog: React.FC<ThankYouDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/90 backdrop-blur-3xl border border-white/15 p-0 overflow-hidden rounded-[2rem] shadow-[0_24px_50px_rgba(0,0,0,0.8)]">
        {/* Animated Subtle Glows */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/[0.03] blur-[60px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-white/[0.02] blur-[60px] rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 text-center space-y-6">
          {/* Success Check Icon */}
          <div className="relative mx-auto w-20 h-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: 0.1 
              }}
              className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            >
              <Check className="w-10 h-10 text-black stroke-[3px]" />
            </motion.div>
            
            {/* Pulsing Ring */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 border-2 border-white/20 rounded-2xl"
            />
          </div>

          {/* Typography */}
          <div className="space-y-3 pt-2">
            <h2 className="text-2xl font-light tracking-[0.2em] text-white uppercase">
              TRANSMISSION <span className="font-semibold">RECEIVED</span>
            </h2>
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-light max-w-xs mx-auto">
              Your vision has been compiled. Our operations team will initiate dialogue within the next 24 hours.
            </p>
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <button
              onClick={onClose}
              className="w-full h-13 bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Initialize Workspace</span>
              <Sparkles className="w-3.5 h-3.5 fill-black" />
            </button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
