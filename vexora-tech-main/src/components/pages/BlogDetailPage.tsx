import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Clock, User, Tag, Calendar, Eye } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Blogs } from '@/entities';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SERIF } from '@/lib/design';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>(); 
  const [blog, setBlog] = useState<Blogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blogs[]>([]);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const allBlogs = await BaseCrudService.getAll<Blogs>('blogs');
      const found = allBlogs.items.find(b => b.slug === id || b._id === id);
      
      if (found) {
        setBlog(found);
        
        // Load related blogs
        const related = allBlogs.items
          .filter(b => b.category === found.category && b._id !== found._id && b.isPublished)
          .slice(0, 3);
        setRelatedBlogs(related);

        // Increment views
        try {
          await BaseCrudService.update('blogs', {
            ...found,
            views: (found.views || 0) + 1
          });
        } catch (e) {
          console.error('Failed to increment views:', e);
        }
      }
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell className="min-h-screen bg-black text-[#E1E0CC] selection:bg-white/20">
      {isLoading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner />
            <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] animate-pulse">Decrypting content stream...</p>
          </div>
        </div>
      ) : !blog ? (
        <div className="max-w-5xl mx-auto px-6 py-32 text-center space-y-6">
          <h2 className="text-4xl text-white font-light uppercase tracking-tight italic" style={SERIF}>Article Not Found</h2>
          <p className="text-white/40 max-w-sm mx-auto uppercase tracking-wider text-xs font-light leading-relaxed">
            The article you are looking for does not exist or has been archived.
          </p>
          <Link to="/blogs" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      ) : (
        <>
          <PageHero
            label={blog.category || 'Logs'}
            title={blog.title}
            titleItalic="Registry File"
            subtitle={blog.excerpt || 'Decrypting detailed content stream...'}
            videoSrc={VIDEO_SRC}
          />

          <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
            <div>
              <Link 
                to="/blogs" 
                className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all mb-4 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" /> 
                Back to log feed
              </Link>
            </div>

            {/* Featured Image Canvas */}
            {blog.featuredImage && (
              <div className="liquid-glass rounded-[2rem] overflow-hidden aspect-[21/9] bg-white/[0.01] border border-white/15 relative">
                <img
                  src={blog.featuredImage}
                  alt={blog.title || 'Featured'}
                  className="w-full h-full object-cover opacity-60"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            )}

            {/* Metadata overlay grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/45">
              {blog.author && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Author
                  </span>
                  <p className="font-semibold text-white/70">{blog.author}</p>
                </div>
              )}
              {blog.publishDate && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Published
                  </span>
                  <p className="font-semibold text-white/70">
                    {new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
              {blog.category && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Category
                  </span>
                  <p className="font-semibold text-white/70">{blog.category}</p>
                </div>
              )}
              {blog.views !== undefined && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Views
                  </span>
                  <p className="font-semibold text-white/70">{blog.views} views</p>
                </div>
              )}
            </div>

            {/* Article Content Area */}
            <article className="text-white/80 text-base leading-relaxed whitespace-pre-line space-y-8 font-light max-w-3xl mx-auto border-t border-white/5 pt-12">
              {blog.content}
            </article>

            {/* Tags footer container */}
            {blog.tags && (
              <div className="flex gap-2 flex-wrap pt-10 border-t border-white/5">
                {blog.tags.split(',').map(tag => (
                  <span 
                    key={tag} 
                    className="text-[9px] uppercase tracking-wider text-white/40 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/5"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Related Blogs section */}
            {relatedBlogs.length > 0 && (
              <div className="mt-24 pt-16 border-t border-white/5">
                <h3 className="text-2xl text-white font-medium mb-8 uppercase tracking-tight italic" style={SERIF}>Related Logs</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {relatedBlogs.map((r) => (
                    <Link 
                      key={r._id} 
                      to={`/blogs/${r.slug || r._id}`}
                      className="liquid-glass rounded-2xl overflow-hidden group flex flex-col justify-between hover:bg-white/[0.02] transition-colors h-full border border-white/5"
                    >
                      <div>
                        {r.featuredImage && (
                          <div className="h-36 relative overflow-hidden bg-white/[0.01] border-b border-white/5">
                            <img 
                              src={r.featuredImage} 
                              alt={r.title} 
                              className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-opacity duration-300" 
                            />
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          <h4 className="text-white font-medium text-sm group-hover:text-white/90 transition-colors line-clamp-2 uppercase tracking-tight" style={SERIF}>
                            {r.title}
                          </h4>
                          <p className="text-white/35 text-[11px] leading-snug line-clamp-2 mt-1">
                            {r.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <div className="flex items-center justify-between text-[9px] text-white/30 group-hover:text-white/60 transition-colors pt-3 border-t border-white/5">
                          <span className="font-bold tracking-widest uppercase">READ LOG</span>
                          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </PageShell>
  );
}
