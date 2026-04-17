import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Blogs } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Blogs>('blogs');
      const published = result.items.filter(blog => blog.isPublished);
      const sorted = published.sort((a, b) => 
        new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()
      );
      setBlogs(sorted);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative w-full min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.08),transparent_70%)]" />
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-neon-cyan/10 border border-secondary/20 mb-4">
            <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
            <span className="text-xs font-paragraph font-bold tracking-widest uppercase text-secondary">Latest Stories</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Our <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">Blog</span>
          </h1>
          <p className="font-paragraph text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Stay updated with the latest insights, tips, and industry trends
          </p>
        </div>
      </section>

      <div className="pt-0 pb-20">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : blogs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => {
                    window.location.href = `/blog/${blog.slug || blog._id}`;
                  }}
                >
                  <div className="group block h-full cursor-pointer">
                    <div className="relative h-full bg-background/80 backdrop-blur-xl border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-glow-lg flex flex-col">
                      <div className="absolute -inset-[1px] bg-gradient-neon rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500" />
                      
                      {/* Blog Image */}
                      <div className="relative h-48 overflow-hidden bg-background">
                        <Image
                          src={blog.featuredImage || 'https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png'}
                          alt={blog.title || 'Blog'}
                          width={600}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4 bg-secondary/20 backdrop-blur-sm text-secondary px-3 py-1 rounded-full text-xs font-semibold border border-secondary/30">
                            {blog.category}
                          </div>
                        )}
                      </div>

                      {/* Blog Content */}
                      <div className="relative z-10 p-6 flex-1 flex flex-col">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="font-paragraph text-foreground/70 text-sm mb-4 line-clamp-2 flex-1">
                          {blog.excerpt || blog.content?.substring(0, 100)}
                        </p>

                        {/* Meta & CTA */}
                        <div className="border-t border-secondary/10 pt-4 mt-auto">
                          {blog.publishDate && (
                            <p className="text-xs text-foreground/60 mb-4">
                              {new Date(blog.publishDate).toLocaleDateString()}
                            </p>
                          )}
                          <div className="inline-flex items-center gap-2 text-secondary font-semibold group-hover:gap-3 transition-all duration-300">
                            Read Article <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="font-paragraph text-lg text-foreground/50">
                No blog posts available.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
