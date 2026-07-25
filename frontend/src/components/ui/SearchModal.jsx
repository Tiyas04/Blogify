import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debounced API Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blogs/get-all-blogs?search=${encodeURIComponent(query)}&limit=5`);
        const blogResults = Array.isArray(response?.data) ? response.data : (response?.data?.blogs || []);
        setResults(blogResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  const handleResultClick = (id) => {
    onClose();
    navigate(`/blog/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 font-body">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-bg-surface border border-border-base rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[70vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-base">
          <Search className="w-5 h-5 text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles, topics, or authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="grow bg-transparent text-text-primary placeholder:text-text-secondary/50 text-base focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-text-secondary" />
          ) : query ? (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="p-1 hover:bg-bg-base text-text-secondary hover:text-text-primary rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-bg-base border border-border-base rounded-md text-text-secondary select-none">
              ESC
            </span>
          )}
        </div>

        {/* Search Results Pane */}
        <div className="grow overflow-y-auto p-4 max-h-[50vh]">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-text-secondary flex flex-col items-center">
              <Search className="w-10 h-10 mb-3 stroke-[1.5] text-text-secondary/60" />
              <p className="font-semibold text-text-primary">Search Blogify</p>
              <p className="text-xs mt-1 max-w-xs leading-relaxed">
                Type keywords, categories or titles to find published essays and insights.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-2 mb-1 block">
                Top Articles Matches
              </span>
              {results.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => handleResultClick(blog.id)}
                  className="group flex items-center justify-between p-3.5 hover:bg-bg-base rounded-[16px] transition-colors cursor-pointer border border-transparent hover:border-border-base"
                >
                  <div className="grow pr-4">
                    <span className="text-[10px] font-semibold text-accent-primary uppercase tracking-wider block mb-0.5">
                      {blog.category}
                    </span>
                    <h4 className="font-heading font-bold text-text-primary text-base group-hover:text-accent-primary transition-colors duration-200 line-clamp-1">
                      {blog.title}
                    </h4>
                    <p className="text-text-secondary text-xs mt-1 font-body line-clamp-1">
                      by {blog.author?.name} · {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-text-secondary">
              <p className="font-semibold text-text-primary">No results found</p>
              <p className="text-xs mt-1">No articles matched your search query for &quot;{query}&quot;.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
