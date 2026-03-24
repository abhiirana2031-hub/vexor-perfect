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
    { path: '/services', label: 'Mobile Apps' },
    { path: '/services', label: 'Cloud Solutions' },
    { path: '/services', label: 'AI & ML' }
  ];

  return (
    <footer className="w-full bg-soft-shadow-gray/50 border-t border-secondary/20">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/vexor-logo.png"
                alt="Vexor Logo"
                width={40}
                height={40}
                className="w-8 sm:w-10 h-8 sm:h-10"
              />
              <span className="font-heading text-lg sm:text-2xl font-bold text-primary-foreground">
                VEXOR-IT
              </span>
            </div>
            <p className="font-paragraph text-foreground/70 leading-relaxed text-sm sm:text-base">
              Transforming businesses through cutting-edge technology solutions. Precision, Power, Progress.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-primary-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-paragraph text-foreground/70 hover:text-secondary transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-secondary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-primary-foreground">Services</h3>
            <ul className="space-y-3">
              {services.map((service, idx) => (
                <li key={idx}>
                  <Link
                    to={service.path}
                    className="font-paragraph text-foreground/70 hover:text-secondary transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-secondary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-primary-foreground">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <a
                  href="mailto:info@vexor-it.com"
                  className="font-paragraph text-foreground/70 hover:text-secondary transition-colors duration-300"
                >vexoritsolution@gmail.com</a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="font-paragraph text-foreground/70 hover:text-secondary transition-colors duration-300"
                >+91 7599544335</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-foreground/70">Meerut (U.P)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-secondary/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <p className="font-paragraph text-foreground/60 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} VEXOR-IT SOLUTIONS. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link
                to="/privacy"
                className="font-paragraph text-foreground/60 hover:text-secondary text-xs sm:text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-paragraph text-foreground/60 hover:text-secondary text-xs sm:text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
