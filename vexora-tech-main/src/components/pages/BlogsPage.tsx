import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Clock, User, Tag } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Blogs } from '@/entities';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SERIF } from '@/lib/design';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blogs[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, activeCategory, searchQuery]);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Blogs>('blogs');
      const published = result.items.filter(blog => blog.isPublished);
      const sorted = published.sort((a, b) =>
        new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()
      );
      setBlogs(sorted);
      
      // Extract unique categories
      const cats = Array.from(new Set(published.map(b => b.category).filter(Boolean))) as string[];
      setCategories(['All', ...cats]);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBlogs = () => {
    let result = [...blogs];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(blog => blog.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        (blog.title || '').toLowerCase().includes(query) || 
        (blog.excerpt || '').toLowerCase().includes(query) || 
        (blog.content || '').toLowerCase().includes(query)
      );
    }

    setFilteredBlogs(result);
  };

  return (
    <PageShell className="min-h-screen bg-black text-[#E1E0CC] selection:bg-white/20">
      <PageHero
        label="Insights & Logs"
        title="Vexor Intelligence"
        titleItalic="Stories & Trends"
        subtitle="A collection of technical write-ups, engineering workflows, infrastructure analyses, and development resources from the Vexor core team."
        videoSrc={VIDEO_SRC}
      />

      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-12">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-b border-white/5 pb-8">
          {/* Categories Pill Container */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="SEARCH ARTICLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-full py-3.5 pl-11 pr-5 text-xs font-medium tracking-wider text-white placeholder-white/20 focus:border-white/20 focus:bg-white/[0.04] outline-none transition-all"
            />
          </div>
        </div>

        {/* Blog Post List */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="text-center space-y-4">
              <LoadingSpinner />
              <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] animate-pulse">Synchronizing feed logs...</p>
            </div>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, idx) => {
              const targetPath = `/blogs/${blog.slug || blog._id}`;
              const formattedDate = blog.publishDate 
                ? new Date(blog.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Draft';

              return (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <Link
                    to={targetPath}
                    className="liquid-glass rounded-[1.5rem] overflow-hidden group flex flex-col justify-between hover:bg-white/[0.02] hover:border-white/15 transition-all duration-300 h-full border border-white/5"
                  >
                    <div>
                      {/* Image header */}
                      <div className="h-48 w-full relative overflow-hidden bg-white/[0.01] border-b border-white/5">
                        <img
                          src={blog.featuredImage || 'https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png'}
                          alt={blog.title || 'Blog post'}
                          className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4 bg-black/80 border border-white/10 text-white/70 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {blog.category}
                          </div>
                        )}
                      </div>

                      {/* Info & Content */}
                      <div className="p-7 space-y-4">
                        <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-wider font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                          {blog.author && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {blog.author}
                            </span>
                          )}
                        </div>

                        <h3 className="text-white font-medium text-xl leading-snug group-hover:text-white/95 transition-colors line-clamp-2 uppercase tracking-tight" style={SERIF}>
                          {blog.title}
                        </h3>

                        <p className="text-white/40 text-xs leading-relaxed line-clamp-3 font-light">
                          {blog.excerpt || blog.content?.substring(0, 100)}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-7 pb-7">
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/35 group-hover:text-white/80 transition-colors">
                        <span className="text-[10px] font-black tracking-widest uppercase">READ LOG</span>
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 rounded-[2rem] bg-white/[0.01] border border-white/5 max-w-2xl mx-auto space-y-4">
            <p className="text-sm text-white/40 font-medium uppercase tracking-widest">No matching logs found</p>
            <p className="text-xs text-white/20 uppercase tracking-widest">Adjust filters or search parameters and try again</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
