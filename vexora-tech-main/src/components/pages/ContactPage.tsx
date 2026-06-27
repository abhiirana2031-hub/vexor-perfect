import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { BaseCrudService } from '@/integrations';
import { ThankYouDialog } from '@/components/ThankYouDialog';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { SERIF } from '@/lib/design';
import VeldaraBackground from '@/components/VeldaraBackground';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const springProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const rotateX = useTransform(springProgress, [0, 1], [10, -10]);
  const translateY = useTransform(springProgress, [0, 1], [35, -35]);
  const scale = useTransform(springProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
  const opacity = useTransform(springProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.7]);

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
      alert('Please fill in all required fields.');
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

      // Send main inquiry email to Vexor IT Solutions
      try {
        const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ADMIN;
        const mailTo = import.meta.env.PUBLIC_MAIL_TO;
        const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
        
        if (serviceId && templateId && mailTo && publicKey) {
          await emailjs.send(serviceId, templateId, {
            to_email: mailTo,
            from_name: formData.name,
            name: formData.name,
            from_email: formData.email,
            email: formData.email,
            reply_to: formData.email,
            phone: formData.phone,
            phone_number: formData.phone,
            subject: formData.subject,
            message: formData.message
          }, publicKey);
        } else {
          console.warn('EmailJS missing configuration:', { serviceId, templateId, mailTo, publicKey });
        }
      } catch (emailError) {
        console.error('Main inquiry email failed to send:', emailError);
      }

      // Attempt to send auto-reply to the user's email
      try {
        const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_USER;
        const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
        
        if (serviceId && templateId && publicKey) {
          await emailjs.send(serviceId, templateId, {
            to_email: formData.email,
            email: formData.email,
            user_email: formData.email,
            to_name: formData.name,
            from_name: formData.name,
            name: formData.name,
            subject: formData.subject,
            reply_to: 'hello@vexoritsolutions.site'
          }, publicKey);
        }
      } catch (autoReplyError) {
        console.error('EmailJS auto-reply failed, falling back to server email...');
      }

      // Guarantee delivery by calling the backend SMTP mailer
      try {
        const mailMsg = `Dear ${formData.name},

Thank you for reaching out to Vexora IT Solutions. We have received your inquiry regarding "${formData.subject || 'general consultation'}" and our team is currently reviewing your details.

One of our operations representatives will connect with you within the next 24 hours to discuss your requirements.

If you have any additional details to share, please reply directly to this email (hello@vexoritsolutions.site).

Best regards,
The Vexora Team`;

        await fetch('/api/send-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: 'Thank you for contacting Vexora IT Solutions',
            message: mailMsg
          })
        });
      } catch (nodemailerError) {
        console.error('Nodemailer auto-reply failed to send:', nodemailerError);
      }

      // Show success state
      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to send message. Please try again or contact hello@vexoritsolutions.site');
      console.error('Contact API Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@vexoritsolutions.site',
      link: 'mailto:hello@vexoritsolutions.site'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 75995 44335',
      link: 'tel:+917599544335'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Meerut (U.P), India',
      link: null
    }
  ];

  const glassInput = "w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors text-sm";

  return (
    <PageShell>
      <VeldaraBackground />
      <PageHero
        label="Connect"
        title="Get In Touch"
        titleItalic="Start The Dialogue"
        subtitle="Have a vision? Let's discuss requirements, mapping pipelines, or designing modern web structures for your operations."
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_102933_4e8f73b5-775a-4179-b2fb-472f59063dcd.mp4"
      />

      <section ref={sectionRef} className="max-w-5xl mx-auto px-6 py-20 perspective-[1000px]">
        <motion.div 
          style={{ rotateX, y: translateY, scale, opacity, transformStyle: 'preserve-3d' }}
          className="grid lg:grid-cols-12 gap-10 items-start"
        >
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="liquid-glass rounded-3xl p-8 space-y-6"
            >
              <h2 className="text-2xl text-white font-medium" style={SERIF}>
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5 font-medium">Name *</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={glassInput}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5 font-medium">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={glassInput}
                      placeholder="hello@domain.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5 font-medium">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={glassInput}
                      placeholder="+91..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5 font-medium">Subject</label>
                    <input
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className={glassInput}
                      placeholder="Software Inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5 font-medium">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`${glassInput} resize-none`}
                    placeholder="Tell us about the project goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black rounded-full py-3 text-sm font-medium hover:bg-white/95 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {isSubmitting ? 'Sending Transmission...' : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Column: Contact info & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info cards */}
            <div className="liquid-glass rounded-2xl p-8 space-y-6">
              <h3 className="text-xl text-white font-medium" style={SERIF}>
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 shrink-0">
                      <info.icon size={15} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-white/30 font-medium mb-0.5">{info.title}</p>
                      {info.link ? (
                        <a href={info.link} className="text-sm text-white/60 hover:text-white transition-colors">{info.content}</a>
                      ) : (
                        <span className="text-sm text-white/60">{info.content}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours card */}
            <div className="liquid-glass rounded-2xl p-8 space-y-4">
              <h3 className="text-xl text-white font-medium" style={SERIF}>
                Business Hours
              </h3>
              <div className="space-y-2 text-xs text-white/55">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white/80">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white/80">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white/80">Closed</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      <ThankYouDialog isOpen={isSubmitted} onClose={() => setIsSubmitted(false)} />
    </PageShell>
  );
}
