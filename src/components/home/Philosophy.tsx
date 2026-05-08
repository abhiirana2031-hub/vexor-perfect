import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, BarChart3, Globe, Rocket, CheckCircle2, UserCheck, Timer, Award } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group relative p-8 glass-effect !rounded-[2.5rem] border-white/5 hover:bg-white/[0.03] transition-all duration-500 overflow-hidden"
  >
    <div className="relative z-10 flex flex-col gap-6">
      <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:border-secondary transition-all duration-500">
        <Icon className="w-7 h-7 text-secondary" />
      </div>
      <div className="space-y-3">
        <h3 className="font-black text-foreground tracking-[0.2em] text-xs uppercase">{title}</h3>
        <p className="text-sm text-foreground/40 font-medium leading-relaxed">{desc}</p>
      </div>
      <div className="flex justify-end">
         <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-secondary group-hover:text-secondary transition-all">
            <Rocket className="w-3 h-3 rotate-45" />
         </div>
      </div>
    </div>
    {/* Decorative background class */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[80px] rounded-full group-hover:bg-secondary/10 transition-all" />
  </motion.div>
);

const FloatingBadge = ({ icon: Icon, value, label, position, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className={`absolute ${position} z-20 glass-effect p-4 !rounded-2xl border-white/10 flex items-center gap-4 shadow-glow-cyan/5 min-w-[160px]`}
  >
    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
      <Icon className="w-5 h-5 text-secondary" />
    </div>
    <div>
      <p className="text-sm font-black text-foreground">{value}</p>
      <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40">{label}</p>
    </div>
  </motion.div>
);

const StatItem = ({ label, value, icon: Icon }: any) => (
  <div className="flex flex-col md:flex-row items-center gap-4 px-8 border-r border-white/5 last:border-none w-full md:w-auto text-center md:text-left py-4 md:py-0">
    <Icon className="w-6 h-6 text-secondary" />
    <div>
      <p className="text-xl font-black text-foreground tracking-tighter">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 whitespace-nowrap">{label}</p>
    </div>
  </div>
);

export const Philosophy = () => {
  const features = [
    { icon: Shield, title: "CYBER SECURE", desc: "Military-grade encryption and advanced security protocols to protect what matters." },
    { icon: BarChart3, title: "HYPER SCALE", desc: "Architectures built to scale with your vision — no limits, no bottlenecks." },
    { icon: Zap, title: "ULTRA FAST", desc: "Optimized for speed and efficiency with sub-second latency across the globe." },
    { icon: Cpu, title: "AI NATIVE", desc: "Intelligence integrated into every layer of code to deliver smarter experiences." }
  ];

  return (
    <section id="philosophy" className="relative w-full py-24 sm:py-32 bg-[#03050a] border-t border-white/[0.05] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="space-y-10 mb-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-secondary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Our Standard</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <h2 className="font-heading text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Built for Performance.<br />
              Engineered for <span className="text-secondary animate-glow-pulse">Excellence.</span>
            </h2>
            <p className="font-paragraph text-lg text-foreground/40 max-w-xl leading-relaxed font-medium">
              We don't just build digital products — we build robust, scalable, and future-ready solutions that drive real business impact.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Feature Grid */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>

          {/* Central Visualization */}
          <div className="lg:col-span-7 relative h-[600px] flex items-center justify-center">
             
             {/* Main Central Card */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative z-10 w-full max-w-[450px] aspect-square glass-effect !rounded-[4rem] border-white/5 bg-[#0a0a0f]/80 p-12 flex flex-col items-center justify-center shadow-glow-cyan/10 overflow-hidden"
             >
                <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                
                {/* Header inside card */}
                <div className="absolute top-10 left-0 right-0 text-center space-y-2">
                   <div className="flex items-center justify-center gap-4">
                      <div className="w-8 h-px bg-secondary/40" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/60">Vexor Efficiency Index</span>
                      <div className="w-8 h-px bg-secondary/40" />
                   </div>
                </div>

                {/* Progress Circle */}
                <div className="relative w-full aspect-square flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle 
                         cx="50%" cy="50%" r="42%" 
                         className="stroke-white/[0.03] fill-none" 
                         strokeWidth="8"
                      />
                      <motion.circle 
                         cx="50%" cy="50%" r="42%" 
                         className="stroke-secondary fill-none" 
                         strokeWidth="8"
                         strokeDasharray="264"
                         initial={{ strokeDashoffset: 264 }}
                         whileInView={{ strokeDashoffset: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                         strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-8xl md:text-[10rem] font-black text-foreground tracking-tighter"
                      >
                        100
                      </motion.span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 -mt-4">Out of 100</p>
                   </div>
                </div>

                {/* Bottom Action in card */}
                <div className="absolute bottom-10">
                   <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-secondary/20 bg-secondary/5">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Maximum Efficiency</span>
                   </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[100px] rounded-full" />
             </motion.div>

             {/* Floating Badges */}
             <FloatingBadge 
               icon={Shield} 
               value="99.9%" 
               label="Uptime" 
               position="top-[5%] left-0" 
               delay={1.2} 
             />
             <FloatingBadge 
               icon={Award} 
               value="500+" 
               label="Projects Delivered" 
               position="top-[20%] right-0" 
               delay={1.4} 
             />
             <FloatingBadge 
               icon={Globe} 
               value="50+" 
               label="Countries Served" 
               position="bottom-[20%] left-0" 
               delay={1.6} 
             />
             <FloatingBadge 
               icon={Rocket} 
               value="2x" 
               label="Faster Delivery" 
               position="bottom-[5%] right-0" 
               delay={1.8} 
             />

             {/* Ambient Floating Cubes (Visual flair) */}
             {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ 
                    duration: 5 + i, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                  className="absolute w-8 h-8 glass-effect border-white/10 rounded-lg -z-10 opacity-20"
                  style={{
                    top: `${20 + (i * 15)}%`,
                    left: `${10 + (i * 20)}%`
                  }}
                />
             ))}
          </div>
        </div>

        {/* Bottom Statistics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-24 glass-effect !rounded-[2.5rem] border-white/5 py-10 px-12 flex flex-wrap justify-between items-center bg-[#05050a]/50 backdrop-blur-3xl shadow-soft-depth"
        >
          <StatItem icon={UserCheck} value="500+" label="Happy Clients" />
          <StatItem icon={Cpu} value="2M+" label="Lines of Code" />
          <StatItem icon={Shield} value="99.9%" label="System Uptime" />
          <StatItem icon={Timer} value="24/7" label="Expert Support" />
          <StatItem icon={Award} value="100%" label="Client Satisfaction" />
        </motion.div>
      </div>

      {/* Decorative Large Background Label */}
      <div className="absolute top-1/2 left-[-10%] text-[20rem] font-black text-white/[0.01] rotate-90 select-none pointer-events-none tracking-tighter">
        VEXOR STANDARD
      </div>
    </section>
  );
};
