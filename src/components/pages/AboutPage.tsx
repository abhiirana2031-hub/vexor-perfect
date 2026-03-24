import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TeamMembers } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { motion } from 'framer-motion';
import { Award, Eye, Target, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<TeamMembers>('teammembers');
      const sortedMembers = result.items.sort((a, b) =>
        (a.displayOrder || 999) - (b.displayOrder || 999)
      );
      setTeamMembers(sortedMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge solutions that drive business transformation.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Quality is at the heart of everything we do. We strive for perfection in every project.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and building strong partnerships with our clients.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Open communication and honest relationships are fundamental to our success.'
    }
  ];

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
            className="text-center space-y-6 mb-16"
          >
            <h1 className="font-heading text-6xl lg:text-8xl font-bold text-primary-foreground">
              About <span className="text-secondary">VEXOR</span>
            </h1>
            <p className="font-paragraph text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
              Pioneering the future of technology with precision, power, and unwavering commitment to progress
            </p>
          </motion.div>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="w-full bg-soft-shadow-gray/20 py-24">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-soft-shadow-gray/50 backdrop-blur-sm border border-secondary/20 rounded-3xl p-12 space-y-6 hover:border-secondary/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="font-heading text-4xl font-bold text-primary-foreground">
                Our Mission
              </h2>
              <p className="font-paragraph text-lg text-foreground/70 leading-relaxed">
                To empower businesses worldwide with innovative technology solutions that drive growth,
                efficiency, and digital transformation. We are committed to delivering excellence through
                cutting-edge development, strategic consulting, and unwavering dedication to our clients' success.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-soft-shadow-gray/50 backdrop-blur-sm border border-secondary/20 rounded-3xl p-12 space-y-6 hover:border-secondary/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-center justify-center">
                <Eye className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="font-heading text-4xl font-bold text-primary-foreground">
                Our Vision
              </h2>
              <p className="font-paragraph text-lg text-foreground/70 leading-relaxed">
                To be the global leader in technology innovation, recognized for transforming industries
                through advanced solutions and exceptional service. We envision a future where technology
                seamlessly integrates with business, creating unprecedented opportunities for growth and success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Core Values */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Core <span className="text-secondary">Values</span>
            </h2>
            <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-8 space-y-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10"
              >
                <div className="w-14 h-14 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-center">
                  <value.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary-foreground">
                  {value.title}
                </h3>
                <p className="font-paragraph text-foreground/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="w-full bg-soft-shadow-gray/20 py-24">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Meet Our <span className="text-secondary">Team</span>
            </h2>
            <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
              The brilliant minds behind VEXOR-IT SOLUTIONS
            </p>
          </motion.div>

          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : teamMembers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    onClick={() => navigate(`/team/${member._id}`)}
                    className="group bg-soft-shadow-gray/50 backdrop-blur-sm border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10 cursor-pointer"
                  >
                    {member.profilePhoto && (
                      <div className="relative h-80 overflow-hidden">
                        <Image
                          src={member.profilePhoto}
                          alt={member.fullName || 'Team Member'}
                          width={400}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-soft-shadow-gray via-transparent to-transparent opacity-80" />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <h3 className="font-heading text-xl font-bold text-primary-foreground group-hover:text-secondary transition-colors duration-300">
                        {member.fullName}
                      </h3>
                      <p className="font-paragraph text-secondary font-semibold">
                        {member.jobTitle}
                      </p>
                      {member.bio && (
                        <p className="font-paragraph text-sm text-foreground/70 line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="font-paragraph text-sm text-secondary hover:underline block"
                        >
                          {member.email}
                        </a>
                      )}
                      {member.linkedInUrl && (
                        <a
                          href={member.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-secondary hover:text-secondary/80 transition-colors duration-300"
                        >
                          <span className="font-paragraph text-sm">LinkedIn Profile</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-paragraph text-xl text-foreground/50">No team members available</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Projects Completed' },
              { number: '200+', label: 'Happy Clients' },
              { number: '50+', label: 'Team Members' },
              { number: '15+', label: 'Years Experience' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="font-heading text-6xl font-bold text-secondary">
                  {stat.number}
                </div>
                <div className="font-paragraph text-xl text-foreground/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
