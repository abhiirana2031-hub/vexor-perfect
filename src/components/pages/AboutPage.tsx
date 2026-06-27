import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Code2, ArrowUpRight, ChevronRight, Activity, Cpu } from 'lucide-react';
import { TeamMembers } from '@/entities';
import { BaseCrudService } from '@/integrations';
import PageShell from '@/components/PageShell';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { SERIF } from '@/lib/design';

const VIDEO_FEATURED = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4';
const VIDEO_PHILOSOPHY = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';
const VIDEO_SERVICE_1 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';
const VIDEO_SERVICE_2 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

export default function AboutPage() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useInView Refs for separate components
  const aboutRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" });

  const featuredRef = useRef(null);
  const isFeaturedInView = useInView(featuredRef, { once: true, margin: "-100px" });

  const philosophyRef = useRef(null);
  const isPhilosophyInView = useInView(philosophyRef, { once: true, margin: "-100px" });

  const servicesRef = useRef(null);
  const isServicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  const teamRef = useRef(null);
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<TeamMembers>('teammembers');
      const sortedMembers = result.items.sort((a, b) =>
        (a.displayOrder || 999) - (b.displayOrder || 999)
      );
      setTeamMembers(sortedMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell className="bg-black text-white min-h-screen">
      {/* ────────────────── SECTION 2: ABOUT MANIFESTO ────────────────── */}
      <section 
        ref={aboutRef}
        className="bg-black pt-40 md:pt-48 pb-14 md:pb-20 px-6 overflow-hidden relative"
      >
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          {/* Label */}
          <motion.p
            animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-sm tracking-[0.25em] uppercase font-medium"
          >
            // About Us
          </motion.p>

          {/* Heading */}
          <motion.h1
            animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight uppercase font-light"
          >
            Pioneering <span className="italic text-white/60 font-serif-display" style={SERIF}>software</span> for<br className="hidden md:block" />
            minds that <span className="italic text-white/60 font-serif-display" style={SERIF}>create, build, and scale.</span>
          </motion.h1>
        </div>
      </section>

      {/* ────────────────── SECTION 3: FEATURED VIDEO ────────────────── */}
      <section 
        ref={featuredRef}
        className="bg-black pt-6 md:pt-10 pb-24 md:pb-36 px-6 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            animate={isFeaturedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl overflow-hidden aspect-video relative group bg-white/[0.01] border border-white/5"
          >
            <video
              src={VIDEO_FEATURED}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 z-10">
              <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
                <p className="text-white/40 text-[10px] tracking-widest uppercase font-bold mb-3">// Our Approach</p>
                <p className="text-white text-xs md:text-sm leading-relaxed font-light">
                  We believe in the power of precision-driven architecture. Every project starts with a complex engineering challenge, and every solution creates a new benchmark for system performance.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/projects')}
                className="liquid-glass rounded-full px-8 py-3.5 text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/5 transition-colors shrink-0"
              >
                Explore Work
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────── SECTION 4: PHILOSOPHY ────────────────── */}
      <section 
        ref={philosophyRef}
        className="bg-black py-28 md:py-40 px-6 overflow-hidden border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
          {/* Heading */}
          <motion.h2
            animate={isPhilosophyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight uppercase"
          >
            Innovation <span className="italic text-white/45 font-serif-display font-light" style={SERIF}>then x</span> Vision
          </motion.h2>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left: Video */}
            <motion.div
              animate={isPhilosophyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-3xl overflow-hidden aspect-[4/3] bg-white/[0.01] border border-white/5"
            >
              <video
                src={VIDEO_PHILOSOPHY}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right: Text Blocks */}
            <motion.div
              animate={isPhilosophyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 md:space-y-12"
            >
              {/* Block 1 */}
              <div className="space-y-4">
                <p className="text-white/40 text-[10px] tracking-widest uppercase font-bold">// Choose Your Space</p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                  Every meaningful digital breakthrough begins at the intersection of disciplined strategy and clean software architecture. We operate at that crossroads, translating enterprise requirements into modular, lightning-fast web systems.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10" />

              {/* Block 2 */}
              <div className="space-y-4">
                <p className="text-white/40 text-[10px] tracking-widest uppercase font-bold">// Shape The Future</p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                  We believe that the best systems emerge when computational complexity meets functional design. Our engineering workflow is optimized to remove structural bottlenecks, producing software that scales effortlessly under load.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 5: SERVICES / WHAT WE DO ────────────────── */}
      <section 
        ref={servicesRef}
        className="bg-black py-28 md:py-40 px-6 overflow-hidden border-t border-white/5 relative"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />

        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          {/* Header Row */}
          <motion.div
            animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="flex justify-between items-end border-b border-white/5 pb-8"
          >
            <h2 className="text-3xl md:text-5xl text-white tracking-tight uppercase">What We Do</h2>
            <span className="text-white/40 text-sm tracking-widest uppercase hidden md:inline font-medium">// Our Services</span>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <motion.div
              animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="liquid-glass rounded-3xl overflow-hidden group flex flex-col justify-between min-h-[480px]"
            >
              <div className="aspect-video overflow-hidden relative bg-white/[0.01]">
                <video
                  src={VIDEO_SERVICE_1}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-white/40 text-[9px] tracking-widest uppercase font-bold">// Strategy</span>
                  <div className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white">
                    <Activity size={14} />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-medium uppercase">Research & Insight</h3>
                  <p className="text-white/50 text-xs leading-relaxed font-light max-w-[42ch]">
                    We dig deep into technical logic, server constraints, and user experience telemetry to surface the architectural insights that guarantee robust runtime reliability.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="liquid-glass rounded-3xl overflow-hidden group flex flex-col justify-between min-h-[480px]"
            >
              <div className="aspect-video overflow-hidden relative bg-white/[0.01]">
                <video
                  src={VIDEO_SERVICE_2}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-white/40 text-[9px] tracking-widest uppercase font-bold">// Craft</span>
                  <div className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white">
                    <Cpu size={14} />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-medium uppercase">Design & Execution</h3>
                  <p className="text-white/50 text-xs leading-relaxed font-light max-w-[42ch]">
                    From schema migrations to custom UI transitions, we obsess over every single component detail to ship digital experiences that load instantly and perform flawlessly.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 6: OUR TEAM (DYNAMIC) ────────────────── */}
      <section 
        ref={teamRef}
        className="bg-black py-28 px-6 overflow-hidden border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header Row */}
          <motion.div
            animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="flex justify-between items-end border-b border-white/5 pb-8"
          >
            <h2 className="text-3xl md:text-5xl text-white tracking-tight uppercase">Bespoke Engineering</h2>
            <span className="text-white/40 text-sm tracking-widest uppercase hidden md:inline font-medium">// The Squad</span>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
              {teamMembers.map((member, idx) => {
                // Resolve profile photos from backend API correctly
                let profilePhoto = member.profilePhoto;
                if (profilePhoto && profilePhoto.startsWith('/') && !profilePhoto.startsWith('//')) {
                  const apiBase = import.meta.env.PUBLIC_API_URL || '';
                  if (apiBase) {
                    profilePhoto = `${apiBase.replace(/\/$/, '')}${profilePhoto}`;
                  }
                }

                return (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/team/${member._id}`)}
                  >
                    <div className="liquid-glass rounded-2xl sm:rounded-3xl overflow-hidden group hover:bg-white/[0.03] transition-colors h-full flex flex-col justify-between min-h-[160px] sm:min-h-[420px]">
                      <div>
                        {profilePhoto ? (
                          <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.01]">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                            <img
                              src={profilePhoto}
                              alt={member.fullName || 'Team Member'}
                              className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-700"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                          </div>
                        ) : (
                          <div className="relative aspect-[4/5] bg-white/[0.01] flex items-center justify-center text-white/5 text-3xl sm:text-6xl italic" style={SERIF}>
                            Vexor
                          </div>
                        )}
                        <div className="p-2 sm:p-6">
                          <h3 className="text-white font-medium text-[10px] sm:text-lg mb-0.5 sm:mb-1 truncate" style={SERIF}>
                            {member.fullName}
                          </h3>
                          <p className="text-[7px] sm:text-[9px] text-white/30 uppercase tracking-widest font-semibold mb-1 sm:mb-3 truncate">
                            {member.jobTitle}
                          </p>
                          {member.bio && (
                            <p className="text-white/40 text-[9px] sm:text-xs leading-relaxed line-clamp-3 font-light hidden sm:block">
                              {member.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-6 pb-6 hidden sm:block">
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[9px] uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                          <span>Interactive profile</span>
                          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl liquid-glass">
              <p className="text-sm text-white/40">No team members listed yet.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
