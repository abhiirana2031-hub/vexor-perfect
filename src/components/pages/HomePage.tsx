import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services as ServiceType, Projects as ProjectType, Testimonials as TestimonialType } from '@/entities';
import HeroSection from '@/components/home/HeroSection';
import Footer from '@/components/Footer';
import { GLASS_STYLES, SERIF, CALENDLY_URL } from '@/lib/design';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { useScroll, useTransform } from 'framer-motion';
import VeldaraBackground from '@/components/VeldaraBackground';
import ScrollTransitionCards from '@/components/home/ScrollTransitionCards';

/* ── Fade-in on scroll utility ── */
const FadeUp = ({ children, delay = 0, className = '' }: any) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}>
    {children}
  </motion.div>
);

/* ── Section label ── */
const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
    <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium">{text}</span>
  </div>
);

/* ── Calendly loader ── */
function useCalendly() {
  useEffect(() => {
    if (document.getElementById('calendly-js')) return;
    const s = document.createElement('script');
    s.id = 'calendly-js';
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

/* ═══════════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);
  useCalendly();

  useEffect(() => {
    Promise.all([
      BaseCrudService.getAll<ServiceType>('services', [], { limit: 6, isFeatured: true }),
      BaseCrudService.getAll<ProjectType>('projects', [], { limit: 4, isFeatured: true }),
      BaseCrudService.getAll<TestimonialType>('testimonials', [], { limit: 3 }),
    ]).then(([s, p, t]) => {
      setServices(s.items); setProjects(p.items); setTestimonials(t.items);
    }).finally(() => setLoading(false));
  }, []);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 350], [1, 0.96]);

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden relative">
      <VeldaraBackground />
      <style>{GLASS_STYLES}</style>

      {/* ── Hero ── */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale, transformOrigin: 'center bottom' }} className="w-full relative z-10">
        <HeroSection />
      </motion.div>

      {/* ── Stats bar ── */}
      <section className="border-y border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {[
            { val: '500+', label: 'Projects Delivered' },
            { val: '200+', label: 'Happy Clients' },
            { val: '15+', label: 'Years Experience' },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="text-3xl md:text-4xl text-white mb-1" style={SERIF}>{s.val}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/35">{s.label}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <SectionLabel text="What We Do" />
            <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
              <h2 className="text-4xl md:text-5xl text-white tracking-tight" style={SERIF}>
                Services Built<br /><span className="italic text-white/50">to Scale</span>
              </h2>
              <Link to="/services" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                All Services <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {loading
              ? [...Array(6)].map((_, i) => <div key={i} className="h-24 sm:h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)
              : services.map((s, i) => (
                <FadeUp key={s._id} delay={i * 0.06}>
                  <Link to={`/services/${s.slug || s._id}`}
                    className="liquid-glass rounded-2xl overflow-hidden group flex flex-col hover:bg-white/[0.03] transition-colors h-full">
                    
                    {/* Visual Area */}
                    <div className="h-20 sm:h-44 relative overflow-hidden bg-white/[0.01]">
                      {s.serviceImage ? (
                        <>
                          <img src={s.serviceImage} alt={s.serviceName} className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000 0%, transparent 60%)' }} />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <DynamicIcon name={s.serviceIcon || 'Code2'} className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white/70" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-medium text-xs sm:text-lg mb-1 sm:mb-2 group-hover:text-white/90 transition-colors truncate" style={SERIF}>{s.serviceName}</h3>
                        <p className="text-white/40 text-[9px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">{s.shortDescription}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] sm:text-xs text-white/30 group-hover:text-white/60 transition-colors pt-2 mt-2 sm:pt-4 sm:mt-4 border-t border-white/5">
                        Learn more <ChevronRight size={10} />
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
          </div>
        </div>
      </section>

      {/* ── Scroll Transition Cards (Veldara Masking Reveal) ── */}
      <ScrollTransitionCards />

      {/* ── Featured Projects ── */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <SectionLabel text="Our Work" />
            <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
              <h2 className="text-4xl md:text-5xl text-white tracking-tight" style={SERIF}>
                Featured<br /><span className="italic text-white/50">Projects</span>
              </h2>
              <Link to="/projects" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                All Work <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {loading
              ? [...Array(4)].map((_, i) => <div key={i} className="h-28 sm:h-72 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)
              : projects.map((p, i) => {
                const title = p.projectTitle || 'Confidential Protocol';
                const image = p.projectImage;
                const techs = (p.technologiesUsed || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 3);
                return (
                  <FadeUp key={p._id} delay={i * 0.08}>
                    <Link to={`/projects/${p._id}`}
                      className="liquid-glass rounded-2xl overflow-hidden group block hover:bg-white/[0.03] transition-colors">
                      <div className="h-24 sm:h-52 relative overflow-hidden bg-white/[0.02]">
                        {image
                          ? <img src={image} alt={title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                          : <div className="w-full h-full flex items-center justify-center text-white/10 text-3xl sm:text-5xl" style={SERIF}>V</div>}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000 0%, transparent 50%)' }} />
                      </div>
                      <div className="p-3 sm:p-6">
                        <h3 className="text-white font-medium mb-1.5 text-xs sm:text-lg leading-tight truncate" style={SERIF}>{title}</h3>
                        <div className="flex gap-1.5 flex-wrap">
                          {techs.map(t => (
                            <span key={t} className="text-[7px] sm:text-[10px] uppercase tracking-wider text-white/30 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"
                              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </FadeUp>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <SectionLabel text="How We Work" />
            <h2 className="text-4xl md:text-5xl text-white tracking-tight mb-16" style={SERIF}>
              From Idea<br /><span className="italic text-white/50">to Launch</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {[
              { n: '01', title: 'Discovery', desc: 'We deep-dive into your requirements, goals and competitive landscape.' },
              { n: '02', title: 'Strategy', desc: 'Architecture planning, tech stack selection and execution roadmap.' },
              { n: '03', title: 'Design', desc: 'High-fidelity mockups and interactive prototypes built for conversion.' },
              { n: '04', title: 'Development', desc: 'Modular, scalable code using best-in-class frameworks.' },
              { n: '05', title: 'QA & Launch', desc: 'Rigorous testing across all devices, then secure cloud deployment.' },
              { n: '06', title: 'Growth', desc: 'Ongoing support, analytics and continuous feature improvements.' },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="flex gap-5 group">
                  <span className="text-[11px] font-medium text-white/20 pt-0.5 shrink-0 w-6">{step.n}</span>
                  <div className="border-t border-white/8 pt-5 flex-1">
                    <h3 className="text-white font-medium mb-2">{step.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="py-28 px-6 border-b border-white/5">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <SectionLabel text="Client Stories" />
              <h2 className="text-4xl md:text-5xl text-white tracking-tight mb-14" style={SERIF}>
                Trusted by<br /><span className="italic text-white/50">Visionaries</span>
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <FadeUp key={t._id} delay={i * 0.08}>
                  <div className="liquid-glass rounded-2xl p-7 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex gap-0.5 mb-5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={11} className={j < (t.rating || 5) ? 'text-white/80 fill-white/80' : 'text-white/15'} />
                        ))}
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed italic">"{t.reviewText}"</p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/8">
                      <p className="text-white text-sm font-medium">{t.clientName}</p>
                      <p className="text-white/35 text-xs mt-0.5">{t.clientRoleCompany || 'Client'}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Booking CTA ── */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <SectionLabel text="Book a Call" />
            <h2 className="text-4xl md:text-5xl text-white tracking-tight mb-4" style={SERIF}>
              Let's Build<br /><span className="italic text-white/50">Something Great</span>
            </h2>
            <p className="text-white/40 text-sm mb-14 max-w-md">
              30 minutes. No obligation. Walk away with a clear roadmap for your project.
            </p>
          </FadeUp>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-4">
              {['Free 30-min strategy consultation', 'Custom project roadmap', 'Tech stack recommendations', 'Transparent cost estimation'].map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-white/55 text-sm">{b}</span>
                </div>
              ))}
            </div>
            <div className="lg:col-span-8">
              <div className="liquid-glass rounded-2xl overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="calendly-inline-widget" data-url={CALENDLY_URL}
                  style={{ minWidth: '320px', height: '430px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
