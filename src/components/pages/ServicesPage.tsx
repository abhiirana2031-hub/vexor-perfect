import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


export default function ServicesPage() {
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Services>('services');
      setServices(result.items || []);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.08),transparent_70%)]" />
        
        <div className="relative z-10 max-w-[100rem] w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 md:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-neon-cyan/10 border border-secondary/20 mb-4">
              <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
              <span className="text-xs font-paragraph font-bold tracking-widest uppercase text-secondary">
                Our Services
              </span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Our <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">Services</span>
            </h1>
            
            <p className="font-paragraph text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Cutting-edge technology solutions engineered for transformation and growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-[100rem] mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner />
            </div>
          ) : services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link to={`/services/${service._id}`}>
                    <div className="group relative bg-background/80 backdrop-blur-xl border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-glow-lg h-full flex flex-col">
                      {/* Hover Gradient Background */}
                      <div className="absolute -inset-[1px] bg-gradient-neon rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500" />
                      
                      {/* Icon Layer */}
                      <div className="relative h-48 overflow-hidden bg-secondary/5 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                        <div className="relative z-10 p-8 rounded-full bg-secondary/10 border border-secondary/20 group-hover:scale-110 group-hover:shadow-glow-sm transition-all duration-500">
                          <DynamicIcon 
                            name={service.serviceIcon || 'Sparkles'} 
                            className="w-16 h-16 text-secondary" 
                          />
                        </div>
                        {/* Animated background glow */}
                        <div className="absolute w-32 h-32 bg-secondary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                      </div>


                      <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
                        {/* Content */}
                        <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors duration-300">
                          {service.serviceName}
                        </h3>
                        
                        {service.shortDescription && (
                          <p className="font-paragraph text-foreground/70 text-sm md:text-base flex-1 mb-4">
                            {service.shortDescription}
                          </p>
                        )}

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-secondary group-hover:gap-3 transition-all duration-300 mt-auto">
                          <span className="font-paragraph font-semibold">Learn More</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="font-paragraph text-xl text-foreground/50">No services available at the moment</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
