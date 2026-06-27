import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SERIF } from '@/lib/design';
import VeldaraBackground from '@/components/VeldaraBackground';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4';

const ICONS = [
  'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z', // code
  'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 12H5v-2h6v2zm9 0h-6v-2h6v2zm0-4H5V8h15v4z', // terminal
  'M12 2L1 7l11 5 11-5-11-5zM2 12l10 5 10-5M2 17l10 5 10-5' // layers
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Projects>('projects');
      setProjects(result.items || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const springProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const rotateX = useTransform(springProgress, [0, 1], [12, -12]);
  const translateY = useTransform(springProgress, [0, 1], [40, -40]);
  const scale = useTransform(springProgress, [0, 0.5, 1], [0.96, 1, 0.96]);
  const opacity = useTransform(springProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <PageShell className="min-h-screen bg-black">
      <VeldaraBackground />
      <PageHero
        label="Archives"
        title="Bespoke Implementations"
        titleItalic="Systems In Production"
        subtitle="A catalogue of secure software products, microservices platforms, and complex data applications compiled for production environments."
        videoSrc={VIDEO_SRC}
      />

      {/* Projects Grid */}
      <section ref={sectionRef} className="max-w-5xl mx-auto px-6 py-20 relative z-10 perspective-[1000px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : projects.length > 0 ? (
          <motion.div 
            style={{ rotateX, y: translateY, scale, opacity, transformStyle: 'preserve-3d' }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6"
          >
            {projects.map((project, idx) => {
              const title = project.projectTitle || 'Confidential Protocol';
              const tags = (project.technologiesUsed || '')
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
                .slice(0, 4);
              const desc = project.projectDescription || 'No description provided.';
              const iconPath = ICONS[idx % ICONS.length];

              // Prepend API Base URL to relative image paths to load images correctly from the backend
              let finalImg = project.projectImage;
              if (finalImg && finalImg.startsWith('/') && !finalImg.startsWith('//')) {
                const apiBase = import.meta.env.PUBLIC_API_URL || '';
                if (apiBase) {
                  finalImg = `${apiBase.replace(/\/$/, '')}${finalImg}`;
                }
              }

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <Link
                    to={`/projects/${project._id}`}
                    className="liquid-glass rounded-[1.25rem] overflow-hidden flex flex-col justify-between group hover:bg-white/[0.03] transition-colors h-full"
                  >
                    {/* Visual Area */}
                    <div className="h-20 sm:h-32 w-full relative overflow-hidden bg-white/[0.02] border-b border-white/5">
                      {finalImg ? (
                        <img
                          src={finalImg}
                          alt={title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-2xl font-light italic" style={SERIF}>
                          Vexor IT
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>

                    {/* Content Details */}
                    <div className="p-2.5 sm:p-5 flex flex-col justify-between flex-grow">
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-4">
                        {/* Nested square icon container */}
                        <div
                          className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white"
                          >
                            <path d={iconPath} />
                          </svg>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                          {tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[6px] sm:text-[8px] text-white/70 whitespace-nowrap"
                              style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Text */}
                      <div className="mt-4">
                        <h3 className="text-xs sm:text-lg text-white font-medium mb-1.5 italic uppercase tracking-tight leading-none" style={SERIF}>
                          {title}
                        </h3>
                        <p className="text-white/60 text-[9px] sm:text-xs leading-relaxed line-clamp-2 font-light">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-20 rounded-2xl liquid-glass">
            <p className="text-sm text-white/40">No case studies catalogued yet.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
