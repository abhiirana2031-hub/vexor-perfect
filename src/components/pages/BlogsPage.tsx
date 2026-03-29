import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Blogs } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = ['all', ...new Set(blogs.map(b => b.category).filter(Boolean))] as string[];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Our <span className="text-secondary">Blog</span>
            </h1>
            <p className="font-paragraph text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto">
              Stay updated with the latest insights, tips, and industry trends
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-12 justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-paragraph font-semibold transition-all duration-300 capitalize ${
                  selectedCategory === category
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-soft-shadow-gray border border-secondary/20 text-foreground hover:border-secondary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link to={`/blog/${blog.slug || blog._id}`}>
                    <div className="group bg-soft-shadow-gray/30 border border-secondary/20 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 h-full flex flex-col">
                      {/* Blog Image */}
                      <div className="relative h-48 overflow-hidden bg-background">
                        <Image
                          src={blog.featuredImage || 'https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png'}
                          alt={blog.title || 'Blog'}
                          width={600}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            {blog.category}
                          </div>
                        )}
                      </div>

                      {/* Blog Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="font-paragraph text-foreground/70 text-sm mb-4 line-clamp-3 flex-1">
                          {blog.excerpt || blog.content?.substring(0, 150)}
                        </p>

                        {/* Meta */}
                        <div className="space-y-3 border-t border-secondary/10 pt-4">
                          <div className="flex items-center gap-2 text-xs text-foreground/60">
                            {blog.author && (
                              <>
                                <User className="w-4 h-4" />
                                <span>{blog.author}</span>
                              </>
                            )}
                          </div>
                          {blog.publishDate && (
                            <div className="flex items-center gap-2 text-xs text-foreground/60">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                            <div className="flex items-start gap-2">
                              <Tag className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                              <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag, i) => (
                                  <span key={i} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                                    {typeof tag === 'string' ? tag.trim() : tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Read More */}
                        <Button
                          variant="ghost"
                          className="mt-4 text-secondary hover:text-accent-teal transition-colors p-0 h-auto font-semibold"
                        >
                          Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-paragraph text-lg text-foreground/50">
                No blog posts found in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
