import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SERIF } from '@/lib/design';

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

  const keyFeatures = [
    'Cutting-edge technology implementation',
    'Scalable and secure solutions',
    'Expert consultation and support',
    'Custom-tailored to your needs',
    'Ongoing maintenance and updates',
    'Comprehensive documentation'
  ];

  return (
    <PageShell>
      {isLoading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !service ? (
        <div className="max-w-5xl mx-auto px-6 py-32 text-center space-y-6">
          <h2 className="text-4xl text-white font-bold" style={SERIF}>Service Not Found</h2>
          <p className="text-white/50 max-w-md mx-auto">The capability you are looking for does not exist or has been archived.</p>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>
      ) : (
        <>
          <PageHero
            label="Capability Details"
            title={service.serviceName}
            titleItalic="Overview & Scope"
            subtitle={service.shortDescription}
          />

          <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
              <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-8">
                <ArrowLeft size={14} /> Back to capabilities
              </Link>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Main Content (Overview + Features) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Visual Icon card */}
                <div
                  className="liquid-glass rounded-2xl p-10 flex items-center justify-center relative bg-white/[0.01]"
                  style={{ minHeight: '260px' }}
                >
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)' }} />
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <DynamicIcon name={service.serviceIcon || 'Code2'} className="w-10 h-10 text-white/80" />
                  </div>
                </div>

                {/* Service Overview */}
                <div className="liquid-glass rounded-2xl p-8 md:p-10 space-y-4">
                  <h2 className="text-2xl text-white font-medium" style={SERIF}>Overview</h2>
                  <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                    {service.detailedDescription || service.shortDescription}
                  </p>
                </div>

                {/* Key Features */}
                <div className="liquid-glass rounded-2xl p-8 md:p-10 space-y-5">
                  <h2 className="text-2xl text-white font-medium" style={SERIF}>Key Features</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-white/60 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar CTA */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="liquid-glass rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Get Started</h3>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Ready to build your next-generation system with this capability?
                    </p>
                  </div>

                  <Link
                    to="/contact"
                    className="w-full bg-white rounded-full py-3 text-black text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors"
                  >
                    Start Project <ChevronRight size={14} />
                  </Link>

                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-white/30 font-medium">Need Help?</h4>
                    <div className="space-y-1">
                      <a href="mailto:hello@vexoritsolutions.site" className="text-sm text-white/55 hover:text-white block transition-colors">
                        hello@vexoritsolutions.site
                      </a>
                      <a href="tel:+917599544335" className="text-sm text-white/55 hover:text-white block transition-colors">
                        +91 75995 44335
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}
