import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, ExternalLink, User, Code, ChevronRight, Activity, Sparkles, Layers, Github } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AmbientCursor, DepthScroll } from '@/components/home/shared/Common';

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

  const title = project?.projectTitle || (project as any)?.title || "Confidential Project";
  const image = project?.projectImage || (project as any)?.image;

  return (
    <div className="min-h-screen bg-[#03050a] text-foreground selection:bg-secondary/30">
      <AmbientCursor />
      <DepthScroll />
      <Header />

      <main className="pt-40 pb-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 blur-[150px] rounded-full animate-mesh-panning" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full animate-mesh-panning" style={{ animationDelay: '-5s' }} />
          <div className="absolute inset-0 cyber-grid opacity-10" />
        </div>

        <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-40 space-y-8"
              >
                <LoadingSpinner />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Decrypting Node Data...</p>
              </motion.div>
            ) : !project ? (
              <motion.div 
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-40 space-y-12"
              >
                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/[0.02]">
                  <Activity className="w-4 h-4 text-destructive" />
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-destructive">Error: Node Not Found</span>
                </div>
                <h2 className="font-heading text-6xl md:text-8xl font-black tracking-tighter">
                  PROJECT <span className="text-foreground/20">VOID</span>
                </h2>
                <Link to="/projects">
                  <button className="futuristic-button">
                    <span className="relative z-10 flex items-center gap-4">
                       <ArrowLeft className="w-4 h-4" />
                       Return to Archives
                    </span>
                    <div className="btn-glow" />
                  </button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-24"
              >
                {/* Back Link */}
                <Link to="/projects" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-secondary transition-all">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                  Back to Archives
                </Link>

                {/* Hero Header */}
                <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-end">
                  <div className="space-y-8 md:space-y-12">
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-4 px-5 py-2 md:px-6 rounded-full border border-white/10 bg-white/[0.02]"
                      >
                        <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                        <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-secondary">Project Details</span>
                      </motion.div>

                      <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black leading-[0.9] tracking-tighter"
                      >
                        {title.split(' ').map((word, i) => (
                           <span key={i} className={i === 1 ? 'text-secondary' : ''}>{word} </span>
                        ))}
                      </motion.h1>

                      <div className="flex flex-wrap gap-8 md:gap-12 pt-4 md:pt-8">
                         {project.clientName && (
                            <div className="space-y-2 text-left">
                               <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20">Client Node</p>
                               <p className="text-lg md:text-xl font-black tracking-tight">{project.clientName}</p>
                            </div>
                         )}
                         {project.completionDate && (
                            <div className="space-y-2">
                               <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20">Final Deployment</p>
                               <p className="text-lg md:text-xl font-black tracking-tight">{formatDate(project.completionDate)}</p>
                            </div>
                         )}
                      </div>
                  </div>

                  <div className="lg:text-right pb-4 mt-8 md:mt-0 flex flex-col md:flex-row lg:justify-end gap-6">
                     {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto">
                          <button className="futuristic-button w-full md:w-auto border-white/5 bg-white/[0.03]">
                             <span className="relative z-10 flex items-center justify-center gap-4">
                                Source Repository
                                <Github className="w-4 h-4" />
                             </span>
                             <div className="btn-glow opacity-20" />
                          </button>
                        </a>
                     )}
                     {project.projectUrl && (
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto">
                          <button className="futuristic-button w-full md:w-auto">
                             <span className="relative z-10 flex items-center justify-center gap-4">
                                Launch Static Node
                                <ExternalLink className="w-4 h-4" />
                             </span>
                             <div className="btn-glow" />
                          </button>
                        </a>
                     )}
                  </div>
                </div>

                {/* Main Media & Info Grid */}
                <div className="grid lg:grid-cols-3 gap-12">
                  {/* Image Layer */}
                  <div className="lg:col-span-2 group">
                    <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/10 glass-effect-hover shadow-soft-depth">
                       {image ? (
                          <Image
                             src={image}
                             alt={title}
                             width={1200}
                             className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s]"
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                             <Layers className="w-24 h-24 text-white/5" />
                          </div>
                       )}
                       <div className="absolute inset-0 glass-noise pointer-events-none opacity-20" />
                    </div>
                  </div>

                  {/* Info Sidebar */}
                  <div className="space-y-8">
                    <div className="glass-effect !rounded-[2.5rem] p-10 border-white/10 space-y-10">
                       <div className="space-y-6">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Mission Parameters</h3>
                          <p className="text-xl text-foreground/60 leading-relaxed font-medium">
                             {project.projectDescription || "No documentation provided for this secure deployment node."}
                          </p>
                       </div>

                       {project.technologiesUsed && (
                          <div className="space-y-6 border-t border-white/5 pt-10">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Engineered Tech Stack</h3>
                             <div className="flex flex-wrap gap-3">
                                {project.technologiesUsed.split(',').map((tech, idx) => (
                                   <span key={idx} className="px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                      {tech.trim()}
                                   </span>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="glass-effect !rounded-[2.5rem] p-10 border-white/10 bg-secondary/5 relative overflow-hidden group">
                       <div className="relative z-10 space-y-6">
                          <h3 className="text-2xl font-black tracking-tighter">Ready for Deployment?</h3>
                          <p className="text-sm text-foreground/50 leading-relaxed">Let's synchronize your next industrial vision with our neural engineering team.</p>
                          <Link to="/contact">
                             <button className="futuristic-button w-full">
                                <span className="relative z-10">Initialize Sync</span>
                                <div className="btn-glow" />
                             </button>
                          </Link>
                       </div>
                       <Activity className="absolute bottom-6 right-6 w-12 h-12 text-secondary/10 group-hover:text-secondary/20 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Key Achievements (High-Fidelity Grid) */}
                <div className="grid md:grid-cols-3 gap-8">
                   {[
                      { l: 'Efficiency', v: '+45%', d: 'Operational throughput enhancement across all nodes.' },
                      { l: 'Security', v: 'Lvl 4', d: 'End-to-end neural encryption and protocol safeguarding.' },
                      { l: 'Uptime', v: '99.9%', d: 'Synchronized cluster reliability in production cycles.' }
                   ].map((item, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="glass-effect !rounded-[2.5rem] p-10 border-white/5 space-y-6"
                      >
                         <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20">{item.l}</p>
                         <h4 className="text-6xl font-black text-secondary tracking-tighter">{item.v}</h4>
                         <p className="text-sm text-foreground/40 leading-relaxed">{item.d}</p>
                      </motion.div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
