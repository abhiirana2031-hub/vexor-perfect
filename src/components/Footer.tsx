import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle, Code2 } from 'lucide-react';

const glassStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.07)',
  backdropFilter: 'blur(4px)',
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const services = [
    { path: '/services', label: 'Web Development' },
    { path: '/services', label: 'App Development' },
    { path: '/services', label: 'Custom Software' },
    { path: '/services', label: 'Automation' },
  ];

  const socials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/vexor-it-solutions/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/vexor.it/', label: 'Instagram' },
    { icon: MessageCircle, href: 'https://wa.me/917599544335', label: 'WhatsApp' },
  ];

  return (
    <footer className="w-full bg-[#080808] relative overflow-hidden pt-10 pb-6 border-t border-white/5">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden bg-white/5">
                <img src="/vexor-logo.png" alt="Vexor Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                Vexor<span className="text-white/35 font-normal"> IT</span>
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-[28ch]">
              Architecting the digital future with precision engineering and design.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-300"
                  style={glassStyle}>
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-xs text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2.5 h-px bg-white/40 transition-all duration-300 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">Capabilities</h3>
            <ul className="space-y-2">
              {services.map((s, i) => (
                <li key={i}>
                  <Link to={s.path}
                    className="text-xs text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2.5 h-px bg-white/40 transition-all duration-300 shrink-0" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Connect</h3>
            <ul className="space-y-4">
              {[
                { icon: Mail, label: 'Email us', value: 'hello@vexoritsolutions.site', href: 'mailto:hello@vexoritsolutions.site' },
                { icon: Phone, label: 'Call us', value: '+91 7599544335', href: 'tel:+917599544335' },
                { icon: MapPin, label: 'Location', value: 'UP, India', href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Icon size={13} className="text-violet-400/70" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/25 font-medium mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-white/45 hover:text-white transition-colors">{value}</a>
                    ) : (
                      <span className="text-sm text-white/45">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            © {currentYear} Vexor IT Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
