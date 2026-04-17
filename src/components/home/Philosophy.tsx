import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Rocket, Zap, Cpu } from 'lucide-react';

export const Philosophy = () => {
  const values = [
    { icon: Shield, title: "CYBER SECURE", desc: "Military-grade encryption for all digital assets." },
    { icon: Rocket, title: "HYPER SCALE", desc: "Architecture designed to grow with your ambition." },
    { icon: Zap, title: "ULTRA FAST", desc: "Sub-second latency across global networks." },
    { icon: Cpu, title: "AI NATIVE", desc: "Intelligence baked into every line of code." }
  ];

  return (
    <section id="philosophy" className="relative w-full py-24 sm:py-32 bg-background border-t border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full" />
      
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-secondary" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Philosophy</span>
              </div>
              <h2 className="font-heading text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                THE VEXOR<br />
                <span className="text-secondary opacity-80">STANDARD.</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-12">
              {values.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-6 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-secondary group-hover:shadow-glow-md transition-all duration-500">
                    <item.icon className="w-6 h-6 text-foreground/60 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-foreground tracking-[0.2em] text-[10px] uppercase">{item.title}</h3>
                    <p className="text-sm text-foreground/40 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 aspect-square glass-effect border-white/[0.05] flex items-center justify-center p-16 overflow-hidden rounded-[4rem]"
            >
               <div className="absolute inset-0 cyber-grid opacity-20" />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border border-dashed border-white/10 rounded-full flex items-center justify-center"
               >
                  <div className="w-3/4 h-3/4 border border-dashed border-white/10 rounded-full flex items-center justify-center">
                     <div className="w-1/2 h-1/2 border border-dashed border-white/10 rounded-full" />
                  </div>
               </motion.div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                     <div className="text-7xl md:text-9xl font-black text-foreground tracking-tighter">100</div>
                     <div className="text-[10px] font-black uppercase tracking-[0.6em] text-secondary">Efficiency Index</div>
                  </div>
               </div>
               
               {/* Ambient Glows Inside */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-purple/5 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
