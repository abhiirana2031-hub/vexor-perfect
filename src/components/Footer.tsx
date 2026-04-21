import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  const services = [
    { path: '/services', label: 'Web Development' },
    { path: '/services', label: 'App Development' },
    { path: '/services', label: 'Custom Software' },
    { path: '/services', label: 'UI/UX Design' },
    { path: '/services', label: 'E-Commerce' },
    { path: '/services', label: 'Automation' },
    { path: '/services', label: 'ERP Systems' },
    { path: '/services', label: 'Admin Dashboards' },
    { path: '/services', label: 'Maintenance' }
  ];

  return (
    <footer className="w-full bg-background relative overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-white/[0.05]">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-neon blur-sm opacity-50 rounded-full" />
                <div className="relative bg-background rounded-full p-1 border border-secondary/50">
                  <Image
                    src="/vexor-logo.png"
                    alt="Vexor Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <span className="font-heading text-2xl font-bold tracking-tighter text-foreground">
                VEXOR<span className="text-secondary">.</span>
              </span>
            </div>
            <p className="font-paragraph text-foreground/50 leading-relaxed text-sm">
              Architecting the digital future with precision engineering and visionary design. We build the infrastructure for tomorrow's innovation.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Github, href: "https://github.com", label: "GitHub" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass-effect flex items-center justify-center text-foreground/60 hover:text-secondary hover:border-secondary/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-secondary">Navigation</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 md:flex-col md:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-paragraph text-[11px] md:text-sm text-foreground/60 hover:text-secondary transition-all duration-300 flex items-center group"
                  >
                    <span className="hidden md:block w-0 group-hover:w-3 h-[1px] bg-secondary mr-0 group-hover:mr-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-secondary">Capabilities</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-3 md:gap-y-4 gap-x-4">
              {services.map((service, idx) => (
                <li key={idx}>
                  <Link
                    to={service.path}
                    className="font-paragraph text-[11px] md:text-sm text-foreground/60 hover:text-secondary transition-all duration-300 flex items-center group"
                  >
                    <span className="hidden md:block w-0 group-hover:w-3 h-[1px] bg-secondary mr-0 group-hover:mr-3 transition-all duration-300" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-secondary">Connect</h3>
            <ul className="space-y-4 md:space-y-5">
              <li className="flex items-start space-x-4 group cursor-pointer">
                <div className="p-1.5 md:p-2 rounded-lg bg-secondary/5 border border-secondary/10 group-hover:border-secondary/30 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-foreground/40 font-bold mb-0.5 md:mb-1">Email us</p>
                  <a href="mailto:vexoritsolution@gmail.com" className="font-paragraph text-xs md:text-sm text-foreground/70 hover:text-secondary transition-colors">vexoritsolution@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start space-x-4 group cursor-pointer">
                <div className="p-1.5 md:p-2 rounded-lg bg-secondary/5 border border-secondary/10 group-hover:border-secondary/30 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-secondary" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-foreground/40 font-bold mb-0.5 md:mb-1">Call us</p>
                  <a href="tel:+917599544335" className="font-paragraph text-xs md:text-sm text-foreground/70 hover:text-secondary transition-colors">+91 7599544335</a>
                </div>
              </li>
              <li className="flex items-start space-x-4 group cursor-pointer">
                <div className="p-1.5 md:p-2 rounded-lg bg-secondary/5 border border-secondary/10 group-hover:border-secondary/30 transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-secondary" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-foreground/40 font-bold mb-0.5 md:mb-1">Location</p>
                  <span className="font-paragraph text-xs md:text-sm text-foreground/70">UP, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.05]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-paragraph text-foreground/30 text-[10px] uppercase tracking-[0.2em] font-bold">
              © {currentYear} VEXOR IT SOLUTIONS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center space-x-8">
              <Link to="/privacy" className="font-paragraph text-foreground/30 hover:text-secondary text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="font-paragraph text-foreground/30 hover:text-secondary text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
