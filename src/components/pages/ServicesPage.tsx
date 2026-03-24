import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Services>('services');
      setServices(result.items);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = filter === 'featured' 
    ? services.filter(s => s.isFeatured) 
    : services;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 px-8 lg:px-16">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="font-heading text-6xl lg:text-8xl font-bold text-primary-foreground">
              Our <span className="text-secondary">Services</span>
            </h1>
            <p className="font-paragraph text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
              Comprehensive technology solutions designed to accelerate your digital transformation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="w-full pb-12">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setFilter('all')}
              className={`px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              All Services
            </Button>
            <Button
              onClick={() => setFilter('featured')}
              className={`px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
                filter === 'featured'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              Featured
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <div className="min-h-[600px]">
            {isLoading ? null : filteredServices.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, idx) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link to={`/services/${service.slug || service._id}`}>
                      <div className="group bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20 h-full flex flex-col">
                        {service.serviceImage && (
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={service.serviceImage}
                              alt={service.serviceName || 'Service'}
                              width={400}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-soft-shadow-gray to-transparent opacity-60" />
                            {service.isFeatured && (
                              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-paragraph text-sm font-semibold">
                                Featured
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-8 space-y-4 flex-1 flex flex-col">
                          <h3 className="font-heading text-2xl font-bold text-primary-foreground group-hover:text-secondary transition-colors duration-300">
                            {service.serviceName}
                          </h3>
                          <p className="font-paragraph text-foreground/70 line-clamp-3 flex-1">
                            {service.shortDescription}
                          </p>
                          <div className="flex items-center text-secondary font-semibold group-hover:translate-x-2 transition-transform duration-300 pt-4">
                            <span className="font-paragraph">Learn More</span>
                            <ChevronRight className="ml-1 h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-foreground/50">
                  {filter === 'featured' ? 'No featured services available' : 'No services available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
