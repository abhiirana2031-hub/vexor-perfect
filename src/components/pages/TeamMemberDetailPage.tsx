import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TeamMembers } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { motion } from 'framer-motion';
import { Mail, Linkedin, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TeamMemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<TeamMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamMember();
  }, [id]);

  const loadTeamMember = async () => {
    setIsLoading(true);
    try {
      if (!id) return;
      const data = await BaseCrudService.getById<TeamMembers>('teammembers', id);
      setMember(data);
    } catch (error) {
      console.error('Error loading team member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Back Button */}
      <section className="w-full pt-20 px-8 lg:px-16">
        <div className="max-w-[100rem] mx-auto">
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors duration-300 font-paragraph font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Team
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-16 px-8 lg:px-16">
        <div className="max-w-[100rem] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <LoadingSpinner />
            </div>
          ) : !member ? (
            <div className="text-center py-32">
              <h2 className="font-heading text-4xl font-bold text-primary-foreground mb-4">
                Team Member Not Found
              </h2>
              <p className="font-paragraph text-xl text-foreground/70">
                The team member you're looking for doesn't exist.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-16 items-start"
            >
              {/* Profile Image */}
              <div className="flex flex-col gap-8">
                {member.profilePhoto && (
                  <div className="relative rounded-3xl overflow-hidden border border-secondary/20 h-[500px] lg:h-[600px]">
                    <Image
                      src={member.profilePhoto}
                      alt={member.fullName || 'Team Member'}
                      width={500}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-soft-shadow-gray via-transparent to-transparent opacity-40" />
                  </div>
                )}
              </div>

              {/* Member Details */}
              <div className="flex flex-col gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h1 className="font-heading text-6xl lg:text-7xl font-bold text-primary-foreground">
                    {member.fullName}
                  </h1>
                  <p className="font-paragraph text-2xl text-secondary font-semibold">
                    {member.jobTitle}
                  </p>
                </motion.div>

                {/* Bio */}
                {member.bio && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h2 className="font-heading text-2xl font-bold text-primary-foreground">
                      About
                    </h2>
                    <p className="font-paragraph text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">
                      {member.bio}
                    </p>
                  </motion.div>
                )}

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="font-heading text-2xl font-bold text-primary-foreground">
                    Contact
                  </h2>
                  <div className="space-y-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-foreground/70 hover:text-secondary transition-colors duration-300 group"
                      >
                        <div className="w-12 h-12 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                          <Mail className="h-6 w-6 text-secondary" />
                        </div>
                        <span className="font-paragraph text-lg">{member.email}</span>
                      </a>
                    )}
                    {member.linkedInUrl && (
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-foreground/70 hover:text-secondary transition-colors duration-300 group"
                      >
                        <div className="w-12 h-12 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                          <Linkedin className="h-6 w-6 text-secondary" />
                        </div>
                        <span className="font-paragraph text-lg">LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Stats or Additional Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-soft-shadow-gray/30 backdrop-blur-sm border border-secondary/20 rounded-2xl p-8 space-y-4"
                >
                  <h2 className="font-heading text-2xl font-bold text-primary-foreground">
                    Team Member Details
                  </h2>
                  <div className="space-y-3 font-paragraph text-foreground/70">
                    {member.jobTitle && (
                      <div className="flex justify-between items-center">
                        <span>Position:</span>
                        <span className="text-primary-foreground font-semibold">{member.jobTitle}</span>
                      </div>
                    )}
                    {member._createdDate && (
                      <div className="flex justify-between items-center">
                        <span>Joined:</span>
                        <span className="text-primary-foreground font-semibold">
                          {new Date(member._createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
