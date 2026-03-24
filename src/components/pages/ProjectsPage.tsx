import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, ExternalLink } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      setProjects(result.items);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

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
              Our <span className="text-secondary">Projects</span>
            </h1>
            <p className="font-paragraph text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
              Showcasing our latest innovations and successful implementations across industries
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <div className="min-h-[600px]">
            {isLoading ? null : projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link to={`/projects/${project._id}`}>
                      <div className="group bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20 h-full flex flex-col">
                        {project.projectImage && (
                          <div className="relative h-72 overflow-hidden">
                            <Image
                              src={project.projectImage}
                              alt={project.projectTitle || 'Project'}
                              width={400}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-soft-shadow-gray to-transparent opacity-80" />
                          </div>
                        )}
                        <div className="p-8 space-y-4 flex-1 flex flex-col">
                          <h3 className="font-heading text-2xl font-bold text-primary-foreground group-hover:text-secondary transition-colors duration-300">
                            {project.projectTitle}
                          </h3>
                          <p className="font-paragraph text-foreground/70 line-clamp-3 flex-1">
                            {project.projectDescription}
                          </p>
                          
                          {project.clientName && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-paragraph text-foreground/60">Client:</span>
                              <span className="font-paragraph text-secondary font-semibold">
                                {project.clientName}
                              </span>
                            </div>
                          )}

                          {project.completionDate && (
                            <div className="flex items-center gap-2 text-sm text-foreground/60">
                              <Calendar className="h-4 w-4" />
                              <span className="font-paragraph">{formatDate(project.completionDate)}</span>
                            </div>
                          )}

                          {project.technologiesUsed && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologiesUsed.split(',').slice(0, 3).map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-lg text-xs font-paragraph text-secondary font-semibold"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center text-secondary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                              <span className="font-paragraph">View Details</span>
                              <ChevronRight className="ml-1 h-5 w-5" />
                            </div>
                            {project.projectUrl && (
                              <ExternalLink className="h-5 w-5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-foreground/50">No projects available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
