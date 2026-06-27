import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { Image } from '@/components/ui/image';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SERIF } from '@/lib/design';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Projects | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const projectData = await BaseCrudService.getById<Projects>('projects', id);
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const title = project?.projectTitle || 'Confidential Project';
  const image = project?.projectImage;
  const techList = project?.technologiesUsed
    ? project.technologiesUsed.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <PageShell>
      {isLoading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !project ? (
        <div className="max-w-5xl mx-auto px-6 py-32 text-center space-y-6">
          <h2 className="text-4xl text-white font-bold" style={SERIF}>Project Not Found</h2>
          <p className="text-white/50 max-w-md mx-auto">The project you are looking for does not exist or has been archived.</p>
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
      ) : (
        <>
          <PageHero
            label="Case Study"
            title={title}
            titleItalic="Systems Architecture"
            subtitle={project.projectDescription || 'A custom software solution built for scale.'}
          />

          <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
              <Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-8">
                <ArrowLeft size={14} /> Back to archives
              </Link>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visual & Overview */}
              <div className="lg:col-span-8 space-y-6">
                {/* Visual Area */}
                <div className="liquid-glass rounded-2xl overflow-hidden aspect-[16/9] bg-white/[0.01]">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover opacity-60"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <Layers size={48} />
                    </div>
                  )}
                </div>

                {/* Key Achievements Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { l: 'Efficiency', v: '+45%', d: 'Throughput optimization' },
                    { l: 'Security', v: 'AES-256', d: 'Secure safeguards' },
                    { l: 'Uptime', v: '99.9%', d: 'High availability' }
                  ].map((item, i) => (
                    <div key={i} className="liquid-glass rounded-xl p-5 text-center">
                      <p className="text-[8px] uppercase tracking-wider text-white/20 mb-1">{item.l}</p>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-0.5" style={SERIF}>{item.v}</h4>
                      <p className="text-[9px] text-white/30 leading-snug">{item.d}</p>
                    </div>
                  ))}
                </div>

                {/* Project Specs */}
                <div className="liquid-glass rounded-2xl p-8 md:p-10 space-y-5">
                  <h2 className="text-xl text-white font-medium" style={SERIF}>Project Specs</h2>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    {project.clientName && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/25">Client</span>
                        <p className="text-sm font-medium text-white/70 mt-1">{project.clientName}</p>
                      </div>
                    )}
                    {project.completionDate && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/25">Final Deployment</span>
                        <p className="text-sm font-medium text-white/70 mt-1">{formatDate(project.completionDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Tech & Deployment */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                {/* Meta details */}
                <div className="liquid-glass rounded-2xl p-8 space-y-6">
                  {techList.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-white/30 font-medium mb-3">Engineered Tech</h4>
                      <div className="flex flex-wrap gap-2">
                        {techList.map(t => (
                          <span key={t} className="text-[10px] uppercase tracking-wider text-white/50 px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white rounded-full py-3 text-black text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors"
                      >
                        Launch Project <ExternalLink size={14} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full liquid-glass rounded-full py-3 text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors"
                      >
                        Source Code <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Contact CTA card */}
                <div className="liquid-glass rounded-2xl p-8 bg-white/[0.01]">
                  <h3 className="text-lg font-semibold text-white mb-2" style={SERIF}>Ready to Deploy?</h3>
                  <p className="text-white/40 text-xs leading-relaxed mb-6">
                    Synchronize your product vision with our software engineering team.
                  </p>
                  <Link
                    to="/contact"
                    className="w-full bg-white/10 hover:bg-white/15 text-white rounded-full py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Initialize Sync <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}
