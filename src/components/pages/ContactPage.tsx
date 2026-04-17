import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { BaseCrudService } from '@/integrations';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init({ publicKey });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save enquiry to database FIRST to guarantee we don't lose the message if email fails
      try {
        await BaseCrudService.create('enquiries', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'unseen',
          createdAt: new Date().toISOString()
        });
      } catch (dbError) {
        console.error('Failed to save enquiry to database:', dbError);
      }

      // Send main inquiry email to Vexora IT Solutions
      try {
        const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ADMIN;
        const mailTo = import.meta.env.PUBLIC_MAIL_TO;
        
        if (!serviceId || !templateId || !mailTo) {
          console.error('EmailJS configuration missing. Please set environment variables.');
          return;
        }
        
        await emailjs.send(serviceId, templateId, {
          to_email: mailTo,
          from_name: formData.name,
          name: formData.name,            // added alias
          from_email: formData.email,
          email: formData.email,          // added alias
          reply_to: formData.email,       // added alias
          phone: formData.phone,
          phone_number: formData.phone,   // added alias
          subject: formData.subject,
          message: formData.message
        });
      } catch (emailError) {
        console.error('Main inquiry email failed to send:', emailError);
      }

      // Attempt to send auto-reply to the user's email
      try {
        const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_USER;
        
        if (!serviceId || !templateId) {
          console.error('EmailJS configuration missing for auto-reply. Please set environment variables.');
          return;
        }
        
        await emailjs.send(serviceId, templateId, {
          to_email: formData.email,
          email: formData.email,        // added alias
          user_email: formData.email,   // added alias
          to_name: formData.name,       // added alias
          from_name: formData.name,
          name: formData.name,          // added alias
          subject: formData.subject,
          reply_to: 'vexoritsolutions@gmail.com'
        });
      } catch (autoReplyError) {
        console.error('Auto-reply failed to send:', autoReplyError);
        // Do not throw here so that the "Thank You" dialog can still appear!
      }

      // Show success toast
      toast({
        title: 'Success',
        description: 'Message sent successfully! We\'ll get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
      console.error('Contact API Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'vexoritsolution@gmail.com',
      link: 'mailto:info@vexor-it.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+917599544335',
      link: 'tel:+917599544335'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: 'Meerut (U.P)',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.08),transparent_70%)]" />
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-neon-cyan/10 border border-secondary/20 mb-4">
            <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
            <span className="text-xs font-paragraph font-bold tracking-widest uppercase text-secondary">Let's Connect</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Get In <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">Touch</span>
          </h1>
          <p className="font-paragraph text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Have a project in mind? Let's discuss how we can help transform your business
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full pb-16 md:pb-24">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-background/80 backdrop-blur-xl border border-secondary/20 rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden group"
            >
              <div className="absolute -inset-[1px] bg-gradient-neon rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />
              <div className="relative z-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground mb-6 md:mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border-secondary/30 text-foreground focus:border-secondary rounded-lg px-4 py-6 font-paragraph"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border-secondary/30 text-foreground focus:border-secondary rounded-lg px-4 py-6 font-paragraph"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-background/50 border-secondary/30 text-foreground focus:border-secondary rounded-lg px-4 py-6 font-paragraph"
                    placeholder="+1 (234) 567-890"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-background/50 border-secondary/30 text-foreground focus:border-secondary rounded-lg px-4 py-6 font-paragraph"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-background/50 border-secondary/30 text-foreground focus:border-secondary rounded-lg px-4 py-4 font-paragraph resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-4 md:px-8 md:py-6 text-base md:text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-3xl p-6 sm:p-8 lg:p-12 space-y-6 md:space-y-8">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground">
                  Contact Information
                </h2>
                <p className="font-paragraph text-base sm:text-lg text-foreground/70 leading-relaxed">
                  Reach out to us through any of the following channels. We're here to help!
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base sm:text-lg font-bold text-primary-foreground mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="font-paragraph text-sm sm:text-base text-foreground/70 hover:text-secondary transition-colors duration-300 break-all"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="font-paragraph text-sm sm:text-base text-foreground/70 break-all">
                            {info.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-3xl p-6 sm:p-8 lg:p-12 space-y-6">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary-foreground">
                  Business Hours
                </h2>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="font-paragraph text-foreground/70">Monday - Friday</span>
                    <span className="font-paragraph text-primary-foreground font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-paragraph text-foreground/70">Saturday</span>
                    <span className="font-paragraph text-primary-foreground font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-paragraph text-foreground/70">Sunday</span>
                    <span className="font-paragraph text-primary-foreground font-semibold">Closed</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-secondary/10 to-accent-teal/5 border border-secondary/30 rounded-3xl p-6 sm:p-8 lg:p-12 space-y-6">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary-foreground">
                  Ready to Start?
                </h2>
                <p className="font-paragraph text-sm sm:text-base text-foreground/70 leading-relaxed">
                  Schedule a free consultation to discuss your project requirements and how we can help.
                </p>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-4 md:py-6 text-base md:text-lg font-semibold rounded-lg transition-all duration-300">
                  Schedule Consultation
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
