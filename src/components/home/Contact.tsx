import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Send, Mail, Phone, Globe } from 'lucide-react';
import { ThankYouDialog } from '@/components/ThankYouDialog';

export const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    freqAlias: '',
    payloadData: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API transmission
    console.log('Transmitting signal...', formData);
    setIsSubmitted(true);
    // Reset form
    setFormData({ identity: '', freqAlias: '', payloadData: '' });
  };

  return (
    <section id="contact" className="relative w-full py-24 sm:py-32 bg-[#03050a] border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
         <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-secondary/10 to-transparent opacity-20" />
      </div>

      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="glass-effect rounded-[4rem] border-white/5 overflow-hidden shadow-soft-depth">
          <div className="grid lg:grid-cols-2">
            {/* Contact Info Side */}
            <div className="p-12 sm:p-24 space-y-20">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Initiate Signal</span>
                </div>
                <h2 className="font-heading text-6xl md:text-8xl font-black tracking-tighter leading-none">
                  READY TO<br />
                  <span className="text-secondary opacity-80">UPGRADE?</span>
                </h2>
              </div>
              
              <p className="font-paragraph text-2xl text-foreground/40 leading-relaxed font-medium max-w-md">
                 Join the elite group of visionaries architecting the future. Our systems are standing by.
              </p>

              <div className="space-y-12">
                <div className="flex items-center gap-8 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-secondary group-hover:shadow-glow-md transition-all">
                    <Phone className="w-5 h-5 text-foreground/40 group-hover:text-secondary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20 mb-1">Secure Line</p>
                    <p className="text-xl font-black text-foreground">+91 7599544335</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-secondary group-hover:shadow-glow-md transition-all">
                    <Mail className="w-5 h-5 text-foreground/40 group-hover:text-secondary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20 mb-1">Data Transmission</p>
                    <p className="text-xl font-black text-foreground">vexoritsolution@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-white/[0.01] p-12 sm:p-24 border-l border-white/5 relative scanner-surface">
              <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                <div className="grid sm:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 pl-4 border-l border-secondary">Identity</label>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={formData.identity}
                      onChange={(e) => setFormData({...formData, identity: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] px-8 py-5 focus:border-secondary/40 focus:bg-white/[0.04] outline-none transition-all text-foreground font-medium placeholder:text-foreground/20" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 pl-4 border-l border-secondary">Freq Alias</label>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required
                      value={formData.freqAlias}
                      onChange={(e) => setFormData({...formData, freqAlias: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] px-8 py-5 focus:border-secondary/40 focus:bg-white/[0.04] outline-none transition-all text-foreground font-medium placeholder:text-foreground/20" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 pl-4 border-l border-secondary">Payload Data</label>
                  <textarea 
                    rows={5} 
                    placeholder="Brief your technological requirements..." 
                    required
                    value={formData.payloadData}
                    onChange={(e) => setFormData({...formData, payloadData: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[3rem] px-8 py-6 focus:border-secondary/40 focus:bg-white/[0.04] outline-none transition-all text-foreground font-medium placeholder:text-foreground/20 resize-none"
                  ></textarea>
                </div>
                
                <button type="submit" className="futuristic-button w-full group py-6">
                  <span className="relative z-10 flex items-center justify-center gap-6 text-base">
                    TRANSMIT SIGNAL
                    <Send className="w-5 h-5 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
                  </span>
                  <div className="btn-glow" />
                </button>
              </form>
              
              {/* Bottom Decorative Grid */}
              <div className="absolute bottom-0 right-0 w-32 h-32 cyber-grid opacity-10" />
            </div>
          </div>
        </div>
      </div>

      <ThankYouDialog isOpen={isSubmitted} onClose={() => setIsSubmitted(false)} />
    </section>
  );
};
