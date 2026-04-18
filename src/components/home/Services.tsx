import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Services as ServiceType } from '@/entities';
import { Image } from '@/components/ui/image';
import { SectionHeading } from './shared/Common';

interface ServicesProps {
  services: ServiceType[];
  isLoading: boolean;
}

export const Services = ({ services, isLoading }: ServicesProps) => {
  return (
    <section id="services" className="relative w-full py-24 sm:py-32 bg-background overflow-hidden preserve-3d">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <SectionHeading 
          subtitle="Precision Expertise"
          title="FUTURE-READY"
          highlight="ARCHITECTURE"
          description="We deploy high-performance engineering systems that power the world's most innovative business structures."
          align="left"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-[450px] glass-effect rounded-[2.5rem] animate-pulse" />
            ))
          ) : services.length > 0 ? (
            services.map((service, idx) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group h-full"
              >
                <Link to={`/services/${service.slug || service._id}`} className="block h-full">
                  <div className="relative h-full glass-card border-white/[0.03] p-0 flex flex-col overflow-hidden hover:border-secondary/20 transition-all duration-700">
                    {/* Visual Layer */}
                    <div className="relative h-64 overflow-hidden">
                      {service.serviceImage ? (
                        <Image
                          src={service.serviceImage}
                          alt={service.serviceName || 'Service'}
                          width={800}
                          className="w-full h-full object-cover opacity-90 transition-all duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/[0.02]" />
                      )}
                      
                      {/* Gradient Overlay for Depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                      
                      {/* Badge in image for "Floating" Look */}
                      <div className="absolute top-8 left-8">
                         <div className="px-4 py-1.5 rounded-full glass-effect border-white/10 text-[9px] font-black tracking-widest uppercase text-foreground/60 group-hover:text-secondary transition-colors">
                            {service.isFeatured ? 'Featured Core' : 'Architecture'}
                         </div>
                      </div>
                    </div>

                    {/* Content Layer */}
                    <div className="p-10 flex-1 flex flex-col justify-between">
                      <div className="space-y-6">
                        <h3 className="font-heading text-3xl font-black text-foreground tracking-tighter leading-none group-hover:text-secondary transition-colors">
                          {service.serviceName}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/40 leading-relaxed font-medium">
                          {service.shortDescription}
                        </p>
                      </div>

                      <div className="pt-10 flex items-center justify-between border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 group-hover:text-secondary group-hover:tracking-[0.6em] transition-all duration-700">
                          Configure
                        </span>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all">
                          <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:text-black" />
                        </div>
                      </div>
                    </div>

                    {/* Scanning Sweep Effect */}
                    <div className="absolute inset-x-0 h-[2px] bg-secondary/20 -top-[2px] group-hover:animate-scanner opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full h-64 glass-effect flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Data unavailable</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
