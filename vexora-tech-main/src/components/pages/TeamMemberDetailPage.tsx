import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Linkedin } from 'lucide-react';
import { TeamMembers } from '@/entities';
import { BaseCrudService } from '@/integrations';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { SERIF } from '@/lib/design';

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
    <PageShell>
      {isLoading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !member ? (
        <div className="max-w-5xl mx-auto px-6 py-32 text-center space-y-6">
          <h2 className="text-4xl text-white font-bold" style={SERIF}>Team Member Not Found</h2>
          <p className="text-white/50 max-w-md mx-auto">The team member you are looking for does not exist or has been archived.</p>
          <Link to="/about" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to About
          </Link>
        </div>
      ) : (
        <>
          <PageHero
            label="Engineer / Leader Profile"
            title={member.fullName || 'Team Member'}
            titleItalic={member.jobTitle || 'Specialist'}
            subtitle={member.bio || 'Part of Vexor IT Solutions technical squad.'}
          />

          <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft size={14} /> Back to Team
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
              {/* Profile Image (Left Column) */}
              <div className="lg:col-span-5 flex justify-center">
                {member.profilePhoto ? (
                  <div
                    className="relative w-full max-w-[320px] aspect-[4/5] rounded-3xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Image
                      src={member.profilePhoto}
                      alt={member.fullName || 'Team Member'}
                      className="w-full h-full object-cover opacity-60 hover:opacity-75 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  </div>
                ) : (
                  <div className="w-full max-w-[320px] aspect-[4/5] rounded-3xl bg-white/[0.02] border border-white/85 flex items-center justify-center text-white/10 text-5xl" style={SERIF}>
                    V
                  </div>
                )}
              </div>

              {/* Details (Right Column) */}
              <div className="lg:col-span-7 space-y-7">
                {member.bio && (
                  <div className="liquid-glass rounded-2xl p-8 space-y-4">
                    <h3 className="text-xl text-white font-medium mb-2" style={SERIF}>Biography</h3>
                    <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">
                      {member.bio}
                    </p>
                  </div>
                )}

                {/* Contact and Metadata */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="liquid-glass rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Channels</h3>
                    <div className="space-y-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group text-sm"
                        >
                          <Mail size={16} className="text-white/60" />
                          <span>{member.email}</span>
                        </a>
                      )}
                      {member.linkedInUrl && (
                        <a
                          href={member.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group text-sm"
                        >
                          <Linkedin size={16} className="text-white/60" />
                          <span>LinkedIn Profile</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="liquid-glass rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Sync Parameters</h3>
                    <div className="space-y-2 text-xs text-white/55">
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <span className="text-white/80 font-medium">{member.jobTitle || 'Specialist'}</span>
                      </div>
                      {member._createdDate && (
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="text-white/80 font-medium">
                            {new Date(member._createdDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}
