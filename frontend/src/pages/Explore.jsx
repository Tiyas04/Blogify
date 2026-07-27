import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, AlertCircle, BookOpen } from 'lucide-react';
import api from '../utils/api';
import { BlogCard } from '../components/ui/Cards';
import CategoryBadge from '../components/ui/CategoryBadge';
import Pagination from '../components/ui/Pagination';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const CATEGORIES = ['AI', 'Programming', 'Technology', 'Design', 'Career', 'Open Source'];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sync state with URL Search Params
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'latest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync search input when query param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch blogs matching filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['explore-blogs', searchParam, categoryParam, sortParam, pageParam],
    queryFn: () => 
      api.get('/blogs/get-all-blogs', {
        params: {
          page: pageParam,
          limit: 6,
          search: searchParam || undefined,
          category: categoryParam || undefined,
          sort: sortParam,
        }
      }),
    keepPreviousData: true,
  });

  const blogs = Array.isArray(data?.data) ? data.data : (data?.data?.blogs || []);
  const totalPages = data?.data?.total_pages || data?.pagination?.pages || 1;

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Default resets page to 1 on filter changes unless explicitly updating page
    if (!updates.page) {
      newParams.set('page', '1');
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const toggleCategory = (cat) => {
    if (categoryParam === cat) {
      updateFilters({ category: '' }); // Toggle off
    } else {
      updateFilters({ category: cat }); // Toggle on
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-body">
      
      {/* Search Bar & Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-text-primary">
          Explore the Journal
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Deep dives, developer thoughts, and creative frameworks. Type below to query our complete archives.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center mt-6">
          <input
            type="text"
            placeholder="Search titles, authors, tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-bg-surface border border-border-base text-text-primary placeholder:text-text-secondary/50 text-sm sm:text-base px-5 py-3.5 pl-12 rounded-[20px] focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm"
          />
          <Search className="absolute left-4.5 w-5 h-5 text-text-secondary" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateFilters({ search: '' });
              }}
              className="absolute right-4 text-xs font-semibold hover:text-accent-primary text-text-secondary cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Filter Options (Category Badge strip + Sorting Dropdown) */}
      <div className="border-t border-border-base pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Category list */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-text-secondary mr-2 font-heading">
            Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = categoryParam === cat;
            return (
              <CategoryBadge
                key={cat}
                category={cat}
                onClick={() => toggleCategory(cat)}
                className={isActive ? 'ring-2 ring-accent-primary' : ''}
              />
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-sm font-heading font-semibold text-text-secondary">
          <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
          <span>Sort By:</span>
          <select
            value={sortParam}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-bg-surface border border-border-base rounded-xl px-3.5 py-2 text-text-primary focus:outline-none text-xs sm:text-sm font-semibold hover:border-text-secondary cursor-pointer"
          >
            <option value="latest">Latest Publications</option>
            <option value="popular">Most Liked / Read</option>
          </select>
        </div>

      </div>

      {/* Grid Results Feed */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <div className="text-center py-16 bg-danger-base/5 border border-danger-base/10 rounded-3xl text-danger-base max-w-lg mx-auto flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10" />
          <p className="font-bold">Error loading articles</p>
          <p className="text-xs">{error.message}</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          <Pagination
            currentPage={pageParam}
            totalPages={totalPages}
            onPageChange={(p) => updateFilters({ page: p.toString() })}
          />
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border-base rounded-3xl bg-bg-surface max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 mx-auto text-text-secondary/40 mb-3 stroke-[1.5]" />
          <h3 className="font-heading font-bold text-text-primary text-lg">No matching articles found</h3>
          <p className="text-xs text-text-secondary mt-1 px-4 leading-relaxed">
            We couldn't find any essays matching your parameters. Try adjusting your search keywords, clear category filters, or change the sorting order.
          </p>
        </div>
      )}

    </div>
  );
};

export default Explore;
