import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Github, ExternalLink } from 'lucide-react';
import { Projects as ProjectType } from '@/entities';
import { Image } from '@/components/ui/image';

interface ProjectsProps {
  projects: ProjectType[];
  isLoading: boolean;
}

export const Projects = ({ projects, isLoading }: ProjectsProps) => {
  return (
    <section id="projects" className="relative w-full py-24 sm:py-32 bg-[#03050a] overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full animate-mesh-panning opacity-50" />
         <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full animate-mesh-panning opacity-50" style={{ animationDelay: '-5s' }} />
         <div className="absolute inset-0 cyber-grid opacity-10" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Heading matching the screenshot */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8 border-b border-white/5 pb-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Featured <span className="text-secondary">Projects</span>
            </h2>
            <p className="text-foreground/50 text-sm md:text-base font-medium max-w-md">
              A glimpse into the digital ecosystems we've engineered for global visionaries.
            </p>
          </div>
          <Link to="/projects" className="text-secondary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all hover:text-white">
            All Work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[16/10] glass-effect rounded-[2rem] animate-pulse" />
            ))
          ) : projects.length > 0 ? (
            projects.map((project, idx) => {
              const title = project.projectTitle || (project as any).title || "Confidential Protocol";
              const image = project.projectImage || (project as any).image;
              const tech = (project.technologiesUsed || (project as any).technologies)?.split(',')[0] || "Innovation";
              const description = project.projectDescription || "A secure industrial deployment designed for high-performance optimization.";
              const repoLink = project.repoUrl;

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-soft-depth hover:border-white/10 transition-all duration-500 group"
                >
                  {/* Image Area (Top Half) */}
                  <div className="relative h-[250px] sm:h-[300px] w-full overflow-hidden bg-[#0a0c10]">
                    {image ? (
                      <Image
                        src={image}
                        alt={title}
                        width={1200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers className="w-20 h-20 text-white/5" />
                      </div>
                    )}
                    
                    {/* Badge absolute near the bottom-left of the image */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 h-32 flex items-end">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-[#082b35]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-secondary/20">
                        {tech}
                      </span>
                    </div>
                  </div>

                  {/* Content Area (Bottom Half) */}
                  <div className="p-8 md:p-10 flex flex-col flex-1 bg-gradient-to-b from-white/[0.01] to-transparent">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">
                      {title}
                    </h3>
                    <p className="text-foreground/50 text-sm leading-relaxed mb-10 line-clamp-2">
                      {description}
                    </p>
                    
                    {/* Links Row */}
                    <div className="mt-auto flex items-center gap-8">
                      <Link 
                        to={`/projects/${project._id}`} 
                        className="flex items-center gap-2 text-sm font-bold text-white hover:text-secondary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </Link>
                      
                      <a 
                        href={repoLink || "#"} 
                        target={repoLink ? "_blank" : "_self"} 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-white transition-colors cursor-pointer"
                      >
                        <Github className="w-4 h-4" />
                        Repo
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
             <div className="col-span-full h-96 glass-effect flex items-center justify-center border-white/5 rounded-[4rem]">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground/20">Nexus Archives Empty</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};
