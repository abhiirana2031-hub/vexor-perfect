import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThankYouDialog: React.FC<ThankYouDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#03050a]/90 backdrop-blur-2xl border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-secondary/20 blur-[80px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-accent-teal/10 blur-[80px] rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 text-center space-y-8">
          {/* Success Icon Animation */}
          <div className="relative mx-auto w-24 h-24">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
              className="absolute inset-0 bg-gradient-neon rounded-3xl flex items-center justify-center shadow-neon-cyan/40 shadow-2xl"
            >
              <Check className="w-12 h-12 text-background stroke-[3px]" />
            </motion.div>
            
            {/* Outer Ring Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 border-2 border-secondary rounded-3xl"
            />
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tighter text-foreground">
                THANK <span className="text-secondary">YOU!</span>
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              className="font-paragraph text-sm sm:text-base text-foreground leading-relaxed"
            >
              We have received your message. Our team will get back to you as soon as possible.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onClose}
              className="w-full h-14 bg-white/5 hover:bg-secondary hover:text-secondary-foreground border border-white/10 hover:border-secondary transition-all duration-500 rounded-2xl font-black uppercase tracking-widest text-xs group"
            >
              <span className="flex items-center gap-3">
                Got It
                <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-[0.03] pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
};
