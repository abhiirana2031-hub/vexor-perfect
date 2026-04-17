import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { Testimonials as TestimonialType } from '@/entities';
import { Image } from '@/components/ui/image';
import { SectionHeading } from './shared/Common';

interface TestimonialsProps {
  testimonials: TestimonialType[];
  isLoading: boolean;
}

export const Testimonials = ({ testimonials, isLoading }: TestimonialsProps) => {
  return (
    <section id="testimonials" className="relative w-full py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(0,217,255,0.03),transparent_70%)]" />
      
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <SectionHeading 
          subtitle="Strategic Partnerships"
          title="TRUSTED BY"
          highlight="VISIONARIES"
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          {isLoading ? (
             [...Array(3)].map((_, i) => (
              <div key={i} className="h-80 glass-effect rounded-[2.5rem] animate-pulse" />
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card hover:bg-white/[0.04] p-12 flex flex-col justify-between group h-full border-white/5"
              >
                <div className="space-y-8">
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className={`w-3 h-3 ${i < (testimonial.rating || 5) ? 'text-secondary' : 'text-white/10'} group-hover:scale-125 transition-transform`} />
                    ))}
                  </div>
                  <p className="font-paragraph text-xl text-foreground/40 italic leading-relaxed font-medium group-hover:text-foreground/60 transition-colors">
                    "{testimonial.reviewText}"
                  </p>
                </div>
                
                <div className="mt-12 flex items-center gap-6 border-t border-white/5 pt-8">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden ring-4 ring-white/[0.02]">
                     <Image
                        src={testimonial.clientImage || 'https://static.wixstatic.com/media/47e7bb_a0d934450b2c4f1ab21d4c235925a4f3~mv2.png?originWidth=128&originHeight=128'}
                        alt={testimonial.clientName || 'Client'}
                        width={100}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                     />
                  </div>
                  <div>
                    <h4 className="font-black text-foreground text-xs uppercase tracking-[0.2em]">{testimonial.clientName}</h4>
                    <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">
                      {testimonial.clientRoleCompany || 'Strategic Partner'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full text-center py-24 opacity-10 font-black uppercase tracking-[0.5em] text-xs">Awaiting Transmission...</div>
          )}
        </div>
      </div>
    </section>
  );
};
