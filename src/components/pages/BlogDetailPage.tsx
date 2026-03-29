import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Blogs } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blogs[]>([]);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const allBlogs = await BaseCrudService.getAll<Blogs>('blogs');
      const found = allBlogs.items.find(b => b.slug === slug || b._id === slug);
      
      if (found) {
        setBlog(found);
        
        // Load related blogs (same category)
        const related = allBlogs.items
          .filter(b => b.category === found.category && b._id !== found._id && b.isPublished)
          .slice(0, 3);
        setRelatedBlogs(related);

        // Increment views
        await BaseCrudService.update('blogs', {
          ...found,
          views: (found.views || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <div className="max-w-[100rem] mx-auto px-8 lg:px-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Blog Not Found</h2>
            <p className="font-paragraph text-lg text-foreground/70 mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link to="/blogs">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/blogs">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </motion.div>

          {/* Blog Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {blog.category && (
              <div className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {blog.category}
              </div>
            )}
            
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-foreground/70 font-paragraph text-sm">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>By {blog.author}</span>
                </div>
              )}
              {blog.publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {blog.views && (
                <div className="flex items-center gap-2">
                  <span>👁️ {blog.views} views</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative rounded-3xl overflow-hidden border border-secondary/20 h-[500px]">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title || 'Blog'}
                  width={1000}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert max-w-none mb-12"
          >
            <div className="font-paragraph text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </motion.div>

          {/* Tags */}
          {blog.tags && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-b border-secondary/20 py-6 mb-12"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-secondary" />
                {blog.tags.split(',').map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold hover:bg-secondary/20 transition-colors cursor-pointer">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h3 className="font-heading text-3xl font-bold text-foreground mb-8">Related Posts</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog._id} to={`/blog/${relatedBlog.slug || relatedBlog._id}`}>
                    <div className="group bg-soft-shadow-gray/30 border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 h-full flex flex-col">
                      {relatedBlog.featuredImage && (
                        <div className="relative h-40 overflow-hidden bg-background">
                          <Image
                            src={relatedBlog.featuredImage}
                            alt={relatedBlog.title || 'Blog'}
                            width={400}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <h4 className="font-heading text-base font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                        <p className="font-paragraph text-sm text-foreground/70 mt-2 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
