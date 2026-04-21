import React, { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Services as ServiceType, Projects as ProjectType, Testimonials as TestimonialType } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Modular Sections
import { Hero } from '@/components/home/Hero';
import { Philosophy } from '@/components/home/Philosophy';
import { Services } from '@/components/home/Services';
import { Projects } from '@/components/home/Projects';
import { Testimonials } from '@/components/home/Testimonials';

// Shared High-Fidelity Utils
import { AmbientCursor, DepthScroll } from '@/components/home/shared/Common';

export default function HomePage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [servicesResult, projectsResult, testimonialsResult] = await Promise.all([
        BaseCrudService.getAll<ServiceType>('services', [], { limit: 6, isFeatured: true }),
        BaseCrudService.getAll<ProjectType>('projects', [], { limit: 4, isFeatured: true }),
        BaseCrudService.getAll<TestimonialType>('testimonials', [], { limit: 3 })
      ]);
      setServices(servicesResult.items);
      setProjects(projectsResult.items);
      setTestimonials(testimonialsResult.items);
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 selection:text-secondary-foreground overflow-x-clip">
      {/* High-Fidelity Global Layers */}
      <AmbientCursor />
      <DepthScroll />
      
      {/* Navigation Layer */}
      <Header />

      {/* Main Orchestration */}
      <main className="relative z-10 w-full overflow-hidden">
        <Hero />
        
        <div className="relative">
           {/* Section Connectors / Ambient Glows */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-gradient-to-b from-secondary to-transparent opacity-20" />
           
           <Philosophy />
           <Services services={services} isLoading={isLoading} />
           <Projects projects={projects} isLoading={isLoading} />
           <Testimonials testimonials={testimonials} isLoading={isLoading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
