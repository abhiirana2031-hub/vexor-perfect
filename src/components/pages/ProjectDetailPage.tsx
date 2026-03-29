import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ExternalLink, User, Code } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : !project ? (
            <div className="text-center py-20 space-y-6">
              <h2 className="font-heading text-4xl font-bold text-primary-foreground">
                Project Not Found
              </h2>
              <p className="font-paragraph text-xl text-foreground/70">
                The project you're looking for doesn't exist.
              </p>
              <Link to="/projects">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Projects
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
                <Link to="/projects">
                  <Button
                    variant="outline"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-6 py-3 font-semibold rounded-lg transition-all duration-300"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Projects
                  </Button>
                </Link>
              </motion.div>

              {/* Project Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <h1 className="font-heading text-5xl lg:text-7xl font-bold text-primary-foreground mb-6">
                  {project.projectTitle}
                </h1>
                <p className="font-paragraph text-2xl text-foreground/70 leading-relaxed mb-8">
                  {project.projectDescription}
                </p>

                {/* Project Meta */}
                <div className="flex flex-wrap gap-6">
                  {project.clientName && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-foreground/60">Client</p>
                        <p className="font-paragraph text-lg font-semibold text-primary-foreground">
                          {project.clientName}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-foreground/60">Completed</p>
                        <p className="font-paragraph text-lg font-semibold text-primary-foreground">
                          {formatDate(project.completionDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.projectUrl && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-foreground/60">Live Project</p>
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-paragraph text-lg font-semibold text-secondary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Project Image */}
              {project.projectImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-16"
                >
                  <div className="relative h-[600px] rounded-3xl overflow-hidden border border-secondary/20 shadow-2xl shadow-secondary/20">
                    <Image
                      src={project.projectImage}
                      alt={project.projectTitle || 'Project'}
                      width={1200}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                </motion.div>
              )}

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid lg:grid-cols-3 gap-12"
              >
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-10 space-y-6">
                    <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                      Project Overview
                    </h2>
                    <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                      {project.projectDescription}
                    </p>
                  </div>

                  {/* Technologies Used */}
                  {project.technologiesUsed && (
                    <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-10 space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-center">
                          <Code className="h-6 w-6 text-secondary" />
                        </div>
                        <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                          Technologies Used
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {project.technologiesUsed.split(',').map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-6 py-3 bg-secondary/10 border border-secondary/30 rounded-xl font-paragraph text-base text-secondary font-semibold hover:bg-secondary/20 transition-colors duration-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Achievements */}
                  <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-10 space-y-6">
                    <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                      Key Achievements
                    </h2>
                    <ul className="space-y-4">
                      {[
                        'Successfully delivered on time and within budget',
                        'Exceeded client expectations with innovative solutions',
                        'Implemented scalable and maintainable architecture',
                        'Achieved high performance and security standards',
                        'Provided comprehensive documentation and training'
                      ].map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                          <span className="font-paragraph text-lg text-foreground/80">
                            {achievement}
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
                      Start Your Project
                    </h3>
                    <p className="font-paragraph text-foreground/70">
                      Ready to bring your vision to life? Let's discuss your project.
                    </p>
                    <Link to="/contact">
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                        Contact Us
                      </Button>
                    </Link>

                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-6 py-6 text-lg font-semibold rounded-lg transition-all duration-300"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Visit Live Site
                        </Button>
                      </a>
                    )}

                    <div className="pt-6 border-t border-secondary/20 space-y-4">
                      <h4 className="font-heading text-lg font-bold text-primary-foreground">
                        Project Inquiry
                      </h4>
                      <p className="font-paragraph text-sm text-foreground/70">
                        Have questions about this project or want to discuss a similar solution?
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
