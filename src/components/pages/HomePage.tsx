// HPI 1.7-G
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Rocket, 
  ChevronRight, 
  Cpu, 
  Globe, 
  Database, 
  Layers, 
  Code, 
  Terminal,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services, Projects, Testimonials } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// --- Utility Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-secondary origin-left z-50"
      style={{ scaleX }}
    />
  );
};

const SectionHeading = ({ 
  subtitle, 
  title, 
  highlight, 
  description, 
  align = "center" 
}: { 
  subtitle: string; 
  title: string; 
  highlight?: string; 
  description?: string;
  align?: "left" | "center" | "right";
}) => {
  return (
    <div className={`mb-12 sm:mb-16 ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-4 sm:mb-6"
      >
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span className="text-xs font-paragraph font-bold tracking-widest uppercase text-secondary">
          {subtitle}
        </span>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-4 sm:mb-6"
      >
        {title} {highlight && <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent-teal">{highlight}</span>}
      </motion.h2>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`font-paragraph text-base sm:text-lg md:text-xl text-foreground/60 max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

const TechTicker = () => {
  const techs = [
    "REACT", "NODE.JS", "TYPESCRIPT", "MONGODB", "AWS", "DOCKER", "NEXT.JS", "TAILWIND", "GRAPHQL", "REDIS"
  ];
  
  return (
    <div className="w-full bg-soft-shadow-gray/30 border-y border-white/5 overflow-hidden py-4 sm:py-6 backdrop-blur-sm">
      <div className="flex whitespace-nowrap">
        <motion.div 
          className="flex gap-8 sm:gap-16 items-center"
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...techs, ...techs, ...techs, ...techs].map((tech, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4 text-foreground/30 font-heading font-bold text-sm sm:text-2xl tracking-tighter">
              <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-secondary/50" />
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function HomePage() {
  // --- Data Fidelity Protocol: Canonical Data Sources ---
  const [services, setServices] = useState<Services[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fidelity Protocol: Preservation ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [servicesResult, projectsResult, testimonialsResult] = await Promise.all([
        BaseCrudService.getAll<Services>('services', [], { limit: 6 }),
        BaseCrudService.getAll<Projects>('projects', [], { limit: 6 }),
        BaseCrudService.getAll<Testimonials>('testimonials', [], { limit: 3 })
      ]);
      setServices(servicesResult.items);
      setProjects(projectsResult.items);
      setTestimonials(testimonialsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Animation Hooks ---
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 selection:text-secondary-foreground overflow-x-clip">
      <ScrollProgress />
      <Header />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 lg:pt-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,191,255,0.08),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute top-1/4 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-secondary/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" 
          />
          <motion.div 
            style={{ y: useTransform(scrollY, [0, 1000], [0, -200]) }}
            className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-accent-teal/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" 
          />
        </div>

        <div className="relative z-10 w-full max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="h-[1px] w-8 sm:w-12 bg-secondary" />
                <span className="font-paragraph text-secondary tracking-[0.2em] text-xs sm:text-sm font-bold uppercase">
                  Architecting the Future
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-white"
              >
                Precision.<br />
                Power.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent-teal to-secondary bg-[length:200%_auto] animate-gradient">
                  Progress.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-paragraph text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/60 max-w-2xl leading-relaxed border-l-2 border-white/10 pl-3 sm:pl-6"
              >
                VEXOR-IT SOLUTIONS fuses cutting-edge engineering with visionary design. We build scalable, secure, and high-performance digital ecosystems for the modern enterprise.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6 pt-2 sm:pt-4"
              >
                <Link to="/services">
                  <Button className="h-12 sm:h-14 px-6 sm:px-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm sm:text-lg font-semibold rounded-none border-r-4 border-r-accent-teal transition-all hover:pl-12 group w-full sm:w-auto">
                    Explore Solutions
                    <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-10 border-white/20 hover:bg-white/5 text-foreground text-sm sm:text-lg font-semibold rounded-none backdrop-blur-sm w-full sm:w-auto">
                    Initiate Project
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Hero Visual / Abstract UI */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative z-10"
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Decorative Rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-white/10"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-12 rounded-full border border-white/5"
                  />
                  
                  {/* Central Card Stack */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-80 bg-soft-shadow-gray/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-[-6deg] z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="h-2 w-12 bg-white/10 rounded-full" />
                      </div>
                      <div className="space-y-4">
                        <div className="h-2 w-full bg-white/5 rounded-full" />
                        <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                        <div className="h-32 w-full bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border border-white/5 mt-4" />
                      </div>
                    </div>
                    
                    <div className="absolute w-64 h-80 bg-background/90 backdrop-blur-xl border border-secondary/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,191,255,0.15)] transform rotate-[6deg] z-20 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="font-mono text-xs text-secondary mb-2">$ init_sequence</div>
                        <div className="font-mono text-xs text-foreground/60">
                          {`> Loading modules...`} <br/>
                          {`> Optimizing core...`} <br/>
                          {`> System ready.`}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                        <div className="flex-1">
                          <div className="text-xs text-foreground/40 uppercase tracking-wider mb-1">Status</div>
                          <div className="text-sm font-bold text-accent-teal flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                            ONLINE
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-foreground/40 uppercase tracking-wider mb-1">Uptime</div>
                          <div className="text-sm font-bold text-foreground">99.99%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-secondary to-transparent" />
        </motion.div>
      </section>

      <TechTicker />

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="relative w-full py-16 sm:py-24 md:py-32 bg-background">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <SectionHeading 
            subtitle="Our Expertise"
            title="Digital"
            highlight="Capabilities"
            description="We deliver comprehensive technology solutions designed to accelerate your digital transformation and secure your competitive edge."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading ? (
              // Loading Skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-[400px] bg-white/5 rounded-2xl animate-pulse" />
              ))
            ) : services.length > 0 ? (
              services.map((service, idx) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative h-full"
                >
                  <Link to={`/services/${service.slug || service._id}`} className="block h-full">
                    <div className="relative h-full bg-soft-shadow-gray/20 border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-secondary/50 group-hover:translate-y-[-5px] group-hover:shadow-[0_10px_40px_-10px_rgba(0,191,255,0.1)]">
                      {/* Image Area */}
                      <div className="relative h-48 sm:h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-soft-shadow-gray via-transparent to-transparent z-10" />
                        <Image
                          src={service.serviceImage || "https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png?originWidth=576&originHeight=384"}
                          alt={service.serviceName || 'Service'}
                          width={600}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 w-10 h-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-background transition-colors duration-300">
                          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-8 relative z-20 -mt-8 sm:-mt-12">
                        <div className="bg-background/80 backdrop-blur-xl border border-white/5 p-4 sm:p-6 rounded-xl shadow-lg">
                          <h3 className="font-heading text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-secondary transition-colors">
                            {service.serviceName}
                          </h3>
                          <p className="font-paragraph text-foreground/60 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                            {service.shortDescription}
                          </p>
                          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary">
                            <span>Learn More</span>
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 sm:py-20 border border-dashed border-white/10 rounded-2xl">
                <p className="text-foreground/40 font-paragraph">Services currently being updated.</p>
              </div>
            )}
          </div>
          
          {!isLoading && services.length > 0 && (
            <div className="mt-12 sm:mt-16 text-center">
              <Link to="/services">
                <Button variant="ghost" className="text-lg font-paragraph hover:bg-transparent hover:text-secondary transition-colors">
                  View All Services <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- WHY CHOOSE US (Feature Grid) --- */}
      <section className="w-full py-16 sm:py-24 md:py-32 bg-soft-shadow-gray/20 border-y border-white/5">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and compliance standards." },
                  { icon: Zap, title: "High Performance", desc: "Optimized for speed, scalability, and load." },
                  { icon: Layers, title: "Scalable Architecture", desc: "Built to grow with your business needs." },
                  { icon: Code, title: "Clean Code", desc: "Maintainable, documented, and efficient." }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`p-4 sm:p-6 lg:p-8 rounded-2xl border border-white/5 bg-background/50 backdrop-blur-sm hover:border-secondary/30 transition-colors duration-300 ${i === 1 || i === 2 ? 'lg:translate-y-12' : ''}`}
                  >
                    <item.icon className="w-8 sm:w-10 h-8 sm:h-10 text-secondary mb-4 sm:mb-6" />
                    <h4 className="font-heading text-base sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{item.title}</h4>
                    <p className="font-paragraph text-xs sm:text-sm text-foreground/60">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <SectionHeading 
                align="left"
                subtitle="Why VEXOR-IT"
                title="Engineering"
                highlight="Excellence"
                description="We don't just write code; we engineer solutions. Our methodology combines rigorous technical standards with creative problem-solving to deliver software that stands the test of time."
              />
              
              <div className="space-y-4 sm:space-y-6">
                {[
                  "Agile Development Methodology",
                  "24/7 System Monitoring & Support",
                  "Cloud-Native Infrastructure",
                  "User-Centric Design Philosophy"
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-accent-teal" />
                    </div>
                    <span className="font-paragraph text-base sm:text-lg text-foreground/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION (Parallax Cards) --- */}
      <section id="projects" className="w-full py-16 sm:py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <SectionHeading 
            subtitle="Selected Works"
            title="Engineered"
            highlight="Reality"
            description="A showcase of our most impactful collaborations and technical achievements."
          />

          <div className="space-y-16 sm:space-y-24 md:space-y-32">
            {isLoading ? (
               <div className="h-64 sm:h-96 bg-white/5 rounded-3xl animate-pulse" />
            ) : projects.length > 0 ? (
              projects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 lg:gap-12 items-center`}
                >
                  {/* Project Image with Parallax Effect */}
                  <div className="w-full lg:w-3/5 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-secondary to-accent-teal opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-[2rem]" />
                    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/10 bg-soft-shadow-gray">
                      <Image
                        src={project.projectImage || "https://static.wixstatic.com/media/47e7bb_04348de70fc94f7eb76fa4e3f3ef2054~mv2.png?originWidth=1152&originHeight=704"}
                        alt={project.projectTitle || 'Project Showcase'}
                        width={1200}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 sm:p-8">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-accent-teal font-mono text-xs sm:text-sm mb-2">
                            {project.technologiesUsed || "Tech Stack"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="w-full lg:w-2/5 space-y-4 sm:space-y-6">
                    <div className="text-6xl sm:text-8xl font-heading font-bold text-white/5 select-none absolute -mt-10 sm:-mt-20 -ml-2 sm:-ml-10 z-0">
                      0{idx + 1}
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-heading text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                        {project.projectTitle}
                      </h3>
                      <p className="font-paragraph text-base sm:text-lg text-foreground/60 leading-relaxed mb-6 sm:mb-8">
                        {project.projectDescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                        {project.clientName && (
                          <span className="px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-mono text-foreground/70">
                            Client: {project.clientName}
                          </span>
                        )}
                        {project.completionDate && (
                          <span className="px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-mono text-foreground/70">
                            {new Date(project.completionDate).getFullYear()}
                          </span>
                        )}
                      </div>

                      <Link to={`/projects/${project._id}`}>
                        <Button className="bg-transparent border-b border-secondary rounded-none px-0 py-2 h-auto text-secondary hover:text-accent-teal hover:border-accent-teal transition-all text-base sm:text-lg font-semibold group">
                          View Case Study
                          <ArrowRight className="ml-2 sm:ml-3 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 sm:py-20">
                <p className="text-foreground/40">Projects loading...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="w-full py-16 sm:py-24 md:py-32 bg-soft-shadow-gray/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(57,255,20,0.03),transparent_50%)]" />
        
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <SectionHeading 
            subtitle="Client Feedback"
            title="Trusted by"
            highlight="Innovators"
            align="center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading ? null : testimonials.length > 0 ? (
              testimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-background border border-white/5 p-6 sm:p-8 rounded-2xl relative group hover:border-secondary/30 transition-colors duration-300"
                >
                  <div className="absolute top-6 sm:top-8 right-6 sm:right-8 text-4xl sm:text-6xl font-serif text-white/5 group-hover:text-secondary/10 transition-colors">"</div>
                  
                  <div className="flex gap-1 mb-4 sm:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Zap 
                        key={i} 
                        className={`w-3 sm:w-4 h-3 sm:h-4 ${i < (testimonial.rating || 5) ? 'text-accent-teal fill-accent-teal' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="font-paragraph text-foreground/80 leading-relaxed mb-6 sm:mb-8 relative z-10 min-h-[60px] sm:min-h-[80px] text-sm sm:text-base">
                    {testimonial.reviewText}
                  </p>
                  
                  <div className="flex items-center gap-3 sm:gap-4 border-t border-white/5 pt-4 sm:pt-6">
                    <Image
                      src={testimonial.clientImage || "https://static.wixstatic.com/media/47e7bb_a0d934450b2c4f1ab21d4c235925a4f3~mv2.png?originWidth=128&originHeight=128"}
                      alt={testimonial.clientName || 'Client'}
                      width={50}
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-foreground text-xs sm:text-sm">{testimonial.clientName}</h4>
                      <p className="font-paragraph text-xs text-foreground/50">{testimonial.clientRoleCompany}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-foreground/40">No testimonials yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.8),transparent,rgba(0,0,0,0.8))]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="font-heading text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
              Ready to <span className="text-secondary">Scale?</span>
            </h2>
            <p className="font-paragraph text-base sm:text-xl text-foreground/60 max-w-2xl mx-auto">
              Join the forward-thinking companies building the future with VEXOR-IT. Let's discuss your next breakthrough.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-8">
              <Link to="/contact">
                <Button className="h-12 sm:h-16 px-8 sm:px-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base sm:text-xl font-bold rounded-lg shadow-[0_0_30px_rgba(0,191,255,0.3)] hover:shadow-[0_0_50px_rgba(0,191,255,0.5)] transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                  Start Your Project
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="h-12 sm:h-16 px-8 sm:px-12 border-white/10 hover:bg-white/5 text-foreground text-base sm:text-xl font-bold rounded-lg backdrop-blur-sm transition-all duration-300 w-full sm:w-auto">
                  Meet the Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
