import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, TrendingUp, Mail, UserPlus, Heart } from 'lucide-react';
import api from '../utils/api';
import { FeaturedCard, BlogCard, AuthorCard } from '../components/ui/Cards';
import CategoryBadge from '../components/ui/CategoryBadge';
import Pagination from '../components/ui/Pagination';
import LoadingSkeleton, { FeaturedCardSkeleton } from '../components/ui/LoadingSkeleton';

const CATEGORIES = ['AI', 'Programming', 'Technology', 'Design', 'Career', 'Open Source'];

const Home = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Fetch blogs with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => api.get(`/blogs/get-all-blogs?page=${page}&limit=7`), // 7 posts to show 1 featured + 6 in latest grid
    keepPreviousData: true,
  });

  // Fetch trending/popular blogs
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['blogs', 'trending'],
    queryFn: () => api.get('/blogs/get-all-blogs?limit=5&sort=popular'), // sort by popularity (likes/comments)
  });

  const blogs = data?.data?.blogs || [];
  const totalPages = data?.data?.total_pages || 1;

  const featuredBlog = blogs[0];
  const latestBlogs = blogs.slice(1);

  const handleCategoryClick = (cat) => {
    navigate(`/explore?category=${encodeURIComponent(cat)}`);
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="py-8 space-y-16">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-xs font-semibold uppercase tracking-wider font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              The Digital Journal Edition
            </div> */}
            
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight leading-none text-text-primary">
              Ideas Worth <br />
              <span className="text-text-muted">Sharing.</span>
            </h1>
            
            <p className="text-text-secondary text-lg sm:text-xl font-body leading-relaxed max-w-xl">
              Discover thoughtful stories from developers, creators, and curious minds. Explore perspectives that challenge standard frameworks.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/explore')}
                className="inline-flex items-center justify-center font-brand font-semibold rounded-[16px] px-6 py-3.5 bg-text-primary text-bg-base hover:bg-text-secondary transition-all cursor-pointer hover:scale-[1.03] active:scale-95 shadow-md"
              >
                Start Reading
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={() => navigate('/write')}
                className="inline-flex items-center justify-center font-brand font-semibold rounded-[16px] px-6 py-3.5 bg-bg-surface border border-border-base text-text-primary hover:bg-bg-base transition-all cursor-pointer hover:scale-[1.03] active:scale-95"
              >
                Write an Essay
              </button>
            </div>
          </div>

          {/* Right Minimal Illustration / Newspaper Grid Design */}
          <div className="lg:col-span-5 relative hidden lg:block select-none">
            <div className="absolute inset-0 bg-linear-to-tr from-text-muted/10 to-border-base/15 rounded-[24px] blur-3xl opacity-40" />
            <div className="relative bg-bg-card border-2 border-border-base rounded-[24px] p-6 shadow-xl space-y-5 rotate-1">
              
              {/* Journal Title header */}
              <div className="border-b border-border-base pb-3 text-center">
                <span className="font-serif text-xl font-black tracking-widest text-text-primary">
                  THE DAILY BLOGIFY
                </span>
                <p className="text-[9px] text-text-secondary tracking-widest font-brand font-bold mt-0.5 uppercase">
                  Est. 2026 // No. 124 // Editorial Journal
                </p>
              </div>

              {/* Journal Mock Article */}
              <div className="space-y-3">
                <div className="h-4 bg-text-muted/15 rounded-[4px] w-1/4" />
                <div className="h-7 bg-text-primary/70 rounded-[8px] w-full" />
                <div className="h-7 bg-text-primary/70 rounded-[8px] w-3/4" />
                
                {/* Paragraph Lines */}
                <div className="space-y-1.5 pt-2">
                  <div className="h-2 bg-text-secondary/20 rounded-[4px] w-full" />
                  <div className="h-2 bg-text-secondary/20 rounded-[4px] w-full" />
                  <div className="h-2 bg-text-secondary/20 rounded-[4px] w-11/12" />
                  <div className="h-2 bg-text-secondary/20 rounded-[4px] w-4/5" />
                </div>
              </div>

              {/* Author footer mockup */}
              <div className="flex items-center justify-between border-t border-border-base pt-3 text-text-secondary text-[10px] font-semibold font-brand">
                <span>By Editorial Staff</span>
                <span>5 MIN READ</span>
              </div>
            </div>
            
            {/* Absolute overlay badge */}
            <div className="absolute -bottom-4 -left-4 bg-text-primary text-bg-base border border-border-base/10 px-4 py-3 rounded-[12px] shadow-lg font-brand font-bold text-[10px] tracking-wider -rotate-6 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              WEEKLY EDITION
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Badge Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-y border-border-base py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary shrink-0">
            Browse Category Digests:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <CategoryBadge
                key={cat}
                category={cat}
                onClick={() => handleCategoryClick(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 1b. Volume Milestones Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="border-b border-border-base pb-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted font-brand">Publication Stage</p>
            <p className="text-sm font-semibold text-text-primary font-brand">Vol. I / No. 1</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted font-brand">Digital Scope</p>
            <p className="text-sm font-semibold text-text-primary font-brand">Engineering & Art</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted font-brand">Active Focus</p>
            <p className="text-sm font-semibold text-text-primary font-brand">100% Ad-Free Reading</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted font-brand">Curation</p>
            <p className="text-sm font-semibold text-text-primary font-brand">Peer-Reviewed Essays</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Article Section */}
      {isLoading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedCardSkeleton />
        </section>
      ) : featuredBlog ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-1.5 h-6 bg-accent-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
              Featured Story
            </h2>
          </div>
          <FeaturedCard blog={featuredBlog} />
        </section>
      ) : null}

      {/* 3b. Editorial Spotlight Quote */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bg-card border border-border-base rounded-[24px] p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-border-base/40 rounded-tl-[24px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-border-base/40 rounded-br-[24px] pointer-events-none" />
{/*           
          <span className="text-[10px] tracking-widest uppercase font-semibold text-accent-primary font-brand bg-accent-primary/5 px-3.5 py-1.5 rounded-full inline-block mb-6">
            💡 Editorial Statement
          </span> */}
          <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-text-primary max-w-4xl mx-auto leading-relaxed mb-6">
            "Writing is not the product of thinking; it is the very process of thinking. By building a premium home for software engineers and creators, we dedicate ourselves to clarity, depth, and the art of essays."
          </blockquote>
          <cite className="text-xs uppercase font-bold tracking-widest text-text-secondary font-brand not-italic">
            — The Blogify Editorial Board
          </cite>
        </div>
      </section>

      {/* 4. Feeds Section (Latest vs Trending) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Latest Feed (Grid size 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1.5 h-6 bg-accent-primary rounded-full" />
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
                Latest Publications
              </h2>
            </div>

            {isLoading ? (
              <LoadingSkeleton count={4} />
            ) : latestBlogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {latestBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            ) : (
              <div className="text-center py-16 border border-dashed border-border-base rounded-[24px] bg-bg-surface">
                <BookOpen className="w-10 h-10 mx-auto text-text-secondary/50 mb-3 stroke-[1.5]" />
                <p className="font-semibold text-text-primary">No articles published yet</p>
                <p className="text-xs text-text-secondary mt-1">Be the first to publish a premium digital journal article!</p>
              </div>
            )}
          </div>

          {/* Right Column: Trending & Creators (Grid size 4) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 lg:self-start">
            
            {/* Trending Articles Block */}
            <div className="bg-bg-surface border border-border-base rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 border-b border-border-base pb-3">
                <TrendingUp className="w-4.5 h-4.5 text-accent-primary" />
                <h3 className="text-base sm:text-lg font-heading font-bold text-text-primary">
                  Trending Articles
                </h3>
              </div>

              {trendingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-4 animate-pulse">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="grow space-y-1.5">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : trendingData?.data?.blogs && trendingData.data.blogs.length > 0 ? (
                <div className="space-y-4">
                  {trendingData.data.blogs.slice(0, 4).map((blog, idx) => (
                    <div key={blog.id} className="flex gap-4 group">
                      <span className="font-serif text-3xl font-black text-border-base group-hover:text-accent-primary/20 transition-colors select-none shrink-0 w-8">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider block mb-0.5">
                          {blog.category}
                        </span>
                        <h4
                          onClick={() => navigate(`/blog/${blog.id}`)}
                          className="font-heading font-bold text-text-primary text-sm sm:text-base leading-snug hover:text-accent-primary transition-colors cursor-pointer line-clamp-2"
                        >
                          {blog.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-text-secondary mt-1 font-body">
                          <span>{blog.author?.name}</span>
                          <span className="flex items-center gap-0.5 text-red-500 font-medium">
                            <Heart className="w-3 h-3 fill-current" /> {blog.likes_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-secondary text-center py-4">No trending articles found.</p>
              )}
            </div>

            {/* Premium Newsletter Box */}
            <div className="bg-text-primary text-bg-base rounded-[24px] p-6 shadow-xl space-y-4 text-center relative overflow-hidden">
              {/* Backlight glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-accent-primary/30 to-purple-500/20 blur-2xl pointer-events-none" />
              
              <div className="relative space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-lg tracking-tight">
                  Join the Editorial Feed
                </h4>
                <p className="text-xs text-text-secondary dark:text-text-secondary/80 leading-relaxed">
                  Subscribe to receive curated newsletters detailing the most interesting articles directly to your dashboard.
                </p>

                {newsletterSubscribed ? (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-[16px] text-emerald-400 text-xs font-bold">
                    🎉 Subscribed Successfully!
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2.5">
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-bg-surface border border-border-base/10 text-text-primary text-sm px-4 py-2.5 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent-primary text-center"
                    />
                    <button
                      type="submit"
                      className="w-full font-heading font-semibold text-xs uppercase tracking-wider py-3 bg-accent-primary text-white dark:text-slate-950 rounded-[12px] cursor-pointer hover:scale-102 active:scale-98 transition-all"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
            
          </div>

        </div>
      </section>

      {/* 5. Editorial Board Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-secondary">
        <div className="border-t border-border-base pt-12">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-1.5 h-6 bg-accent-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
              Writers Spotlight
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <AuthorCard 
              author={{ id: "tiyas", name: "Tiyas Chowdhury", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Tiyas" }}
              bio="Developer & Architect. Focused on system architecture, CSS variables, Node performance, and aesthetic frontends."
              size="md"
            />
            <AuthorCard 
              author={{ id: "sarah", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah" }}
              bio="Design lead and editor. Researching typographical hierarchies, readability limits, and digital-print layouts."
              size="md"
            />
            <AuthorCard 
              author={{ id: "alex", name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alex" }}
              bio="Software journalist. Covering open source licensing, developer advocate roles, and cloud computing ecosystems."
              size="md"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
