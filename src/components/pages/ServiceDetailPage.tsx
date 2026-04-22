import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';


export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Services | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const allServices = await BaseCrudService.getAll<Services>('services');
      const foundService = allServices.items.find(s => s.slug === id || s._id === id);
      setService(foundService || null);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : !service ? (
            <div className="text-center py-20 space-y-6">
              <h2 className="font-heading text-4xl font-bold text-primary-foreground">
                Service Not Found
              </h2>
              <p className="font-paragraph text-xl text-foreground/70">
                The service you're looking for doesn't exist.
              </p>
              <Link to="/services">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Services
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Link to="/services">
                  <Button
                    variant="outline"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-6 py-3 font-semibold rounded-lg transition-all duration-300"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Services
                  </Button>
                </Link>
              </motion.div>

              {/* Service Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-6">
                  <h1 className="font-heading text-5xl lg:text-7xl font-bold text-primary-foreground">
                    {service.serviceName}
                  </h1>
                  {service.isFeatured && (
                    <span className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-paragraph text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-paragraph text-2xl text-foreground/70 leading-relaxed">
                  {service.shortDescription}
                </p>
              </motion.div>

              {/* Service Icon Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-16"
              >
                <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-secondary/20 bg-secondary/5 flex items-center justify-center group">
                  {/* Background Accents */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.1),transparent_70%)]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full animate-pulse" />
                  
                  {/* The Icon */}
                  <div className="relative z-10 p-16 rounded-[2.5rem] bg-background/40 backdrop-blur-xl border border-secondary/20 shadow-glow-sm group-hover:scale-110 group-hover:shadow-glow-md transition-all duration-700">
                    <DynamicIcon 
                      name={service.serviceIcon || 'Sparkles'} 
                      className="w-32 h-32 md:w-48 md:h-48 text-secondary" 
                    />
                  </div>

                  {/* Aesthetic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </motion.div>


              {/* Service Details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid lg:grid-cols-3 gap-12"
              >
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-10 space-y-6">
                    <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                      Service Overview
                    </h2>
                    <p className="font-paragraph text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
                      {service.detailedDescription || service.shortDescription}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-10 space-y-6">
                    <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                      Key Features
                    </h2>
                    <ul className="space-y-4">
                      {[
                        'Cutting-edge technology implementation',
                        'Scalable and secure solutions',
                        'Expert consultation and support',
                        'Custom-tailored to your needs',
                        'Ongoing maintenance and updates',
                        'Comprehensive documentation'
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                          <span className="font-paragraph text-lg text-foreground/80">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-8 space-y-6 sticky top-32">
                    <h3 className="font-heading text-2xl font-bold text-primary-foreground">
                      Get Started
                    </h3>
                    <p className="font-paragraph text-foreground/70">
                      Ready to transform your business with this service?
                    </p>
                    <Link to="/contact">
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                        Contact Us
                      </Button>
                    </Link>
                    <div className="pt-6 border-t border-secondary/20 space-y-4">
                      <h4 className="font-heading text-lg font-bold text-primary-foreground">
                        Need Help?
                      </h4>
                      <p className="font-paragraph text-sm text-foreground/70">
                        Our team is here to answer any questions you may have about this service.
                      </p>
                      <a
                        href="mailto:vexoritsolution@gmail.com"
                        className="font-paragraph text-secondary hover:underline block"
                      >
                        vexoritsolution@gmail.com
                      </a>
                      <a
                        href="tel:+917599544335"
                        className="font-paragraph text-secondary hover:underline block"
                      >
                        +91 75995 44335
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
