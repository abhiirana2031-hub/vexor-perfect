import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              <span className="text-xs font-paragraph font-bold tracking-widest uppercase text-secondary">Our Work</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Our <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">Projects</span>
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Showcasing successful implementations across diverse industries
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-[100rem] mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link to={`/projects/${project._id}`}>
                    <div className="group relative bg-background/80 backdrop-blur-xl border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-glow-lg flex flex-col h-full">
                      <div className="absolute -inset-[1px] bg-gradient-neon rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500" />
                      <div className="relative h-48 overflow-hidden z-0 bg-gradient-to-br from-secondary/20 via-neon-cyan/10 to-neon-purple/20">
                        {project.projectImage ? (
                          <Image
                            src={project.projectImage}
                            alt={project.projectTitle || 'Project'}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/30 to-neon-cyan/20">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-neon/20 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-secondary" />
                              </div>
                              <p className="text-xs text-secondary/60 font-semibold">Project</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                      </div>
                      <div className="relative z-10 p-6 md:p-8 flex flex-col flex-1">
                        <h3 className="font-heading text-2xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                          {project.projectTitle}
                        </h3>
                        {project.projectDescription && (
                          <p className="font-paragraph text-foreground/70 text-sm mb-4 flex-1 line-clamp-2">
                            {project.projectDescription}
                          </p>
                        )}
                        {project.clientName && (
                          <div className="text-xs text-secondary/70 mb-4">
                            <span className="font-semibold">{project.clientName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-secondary group-hover:gap-3 transition-all duration-300 mt-auto">
                          <span className="font-paragraph font-semibold">View Project</span>
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
              <p className="font-paragraph text-xl text-foreground/50">No projects available at the moment</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
