import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageSquare, Bookmark, Share2, ArrowLeft, Clock, Calendar, Check, Send, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CategoryBadge from '../components/ui/CategoryBadge';
import { AuthorCard, CommentCard, formatDate, getReadingTime } from '../components/ui/Cards';
import { BlogDetailSkeleton } from '../components/ui/LoadingSkeleton';
import Button from '../components/ui/Button';

const BlogDetail = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Scroll Progress Indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isValidBlogId = !!id && id !== 'undefined' && id !== 'null' && id.length === 24;

  // Fetch blog data
  const { data: blogResponse, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => api.get(`/blogs/${id}`),
    enabled: isValidBlogId,
  });
  const blog = blogResponse?.data;

  // Fetch comments data
  const { data: commentsResponse } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => api.get(`/comments/blog/${id}`),
    enabled: isValidBlogId,
  });
  const comments = commentsResponse?.data || [];

  // Fetch likes data (checks if liked by user)
  const { data: isLikedResponse } = useQuery({
    queryKey: ['liked', id],
    queryFn: () => api.get(`/likes/blog/${id}/liked`),
    enabled: isValidBlogId && isAuthenticated,
  });
  const isLiked = isLikedResponse?.data?.liked || false;

  // Fetch total likes count
  const { data: likesCountResponse } = useQuery({
    queryKey: ['likesCount', id],
    queryFn: () => api.get(`/likes/blog/${id}`),
    enabled: isValidBlogId,
  });
  const likesCount = likesCountResponse?.data?.likes_count ?? (blog?.likes_count || 0);

  // Local storage bookmarks sync
  useEffect(() => {
    if (blog) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((b) => b.id === blog.id));
    }
  }, [blog]);

  const toggleBookmark = () => {
    if (!blog) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter((b) => b.id !== blog.id);
      setIsBookmarked(false);
    } else {
      updated = [...bookmarks, {
        id: blog.id,
        title: blog.title,
        category: blog.category,
        cover_image: blog.cover_image,
        created_at: blog.created_at,
        content: blog.content,
        author: blog.author
      }];
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: () => api.post(`/likes/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liked', id] });
      queryClient.invalidateQueries({ queryKey: ['likesCount', id] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
    onError: () => {
      if (!isAuthenticated) navigate('/auth');
    }
  });

  // Comments Mutations
  const addCommentMutation = useMutation({
    mutationFn: (content) => api.post(`/comments/blog/${id}`, { content }),
    onSuccess: () => {
      setCommentInput('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    }
  });

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) => api.put(`/comments/${commentId}`, { content }),
    onSuccess: () => {
      setEditingComment(null);
      setCommentInput('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => api.delete(`/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    }
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (editingComment) {
      editCommentMutation.mutate({
        commentId: editingComment.id,
        content: commentInput
      });
    } else {
      addCommentMutation.mutate(commentInput);
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
    setCommentInput(comment.content);
    // Scroll to comments input
    document.getElementById('comment-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Parse Markdown Headings for Table of Contents
  const parseHeadings = (markdownText) => {
    if (!markdownText) return [];
    const lines = markdownText.split('\n');
    const headingLines = lines.filter(line => line.startsWith('## ') || line.startsWith('### '));
    return headingLines.map(line => {
      const isSub = line.startsWith('### ');
      const text = line.replace(/^##\s+|###\s+/, '').trim();
      const hashId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { text, id: hashId, isSub };
    });
  };

  const headings = parseHeadings(blog?.content);

  const scrollToHeading = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Custom Markdown parsing and rendering mapping
  const renderMarkdown = (markdownText) => {
    if (!markdownText) return null;
    const blocks = markdownText.split(/\n\s*\n/);
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2 Headings
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace(/^##\s+/, '');
        const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <h2 key={idx} id={headingId} className="text-2xl sm:text-3xl font-heading font-black text-text-primary mt-8 mb-4 scroll-mt-24 leading-tight">
            {text}
          </h2>
        );
      }

      // H3 Headings
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^###\s+/, '');
        const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <h3 key={idx} id={headingId} className="text-xl sm:text-2xl font-heading font-bold text-text-primary mt-6 mb-3 scroll-mt-24 leading-tight">
            {text}
          </h3>
        );
      }

      // Bullet List Block
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2.5 my-5 text-text-primary/90 leading-relaxed font-serif text-base sm:text-lg">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {item.replace(/^[*-]\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Text block / standard paragraphs
      return (
        <p key={idx} className="font-serif text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose text-text-primary/90 mb-5 whitespace-pre-wrap">
          {trimmed}
        </p>
      );
    });
  };

  if (isLoading) return <BlogDetailSkeleton />;
  
  if (error || !blog) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center font-body">
        <AlertCircle className="w-12 h-12 text-danger-base mx-auto mb-4 stroke-[1.5]" />
        <h2 className="text-2xl font-bold text-text-primary">Article Not Found</h2>
        <p className="text-text-secondary text-sm mt-2 mb-6">
          The publication you are trying to access doesn't exist, was deleted, or there was a database retrieval issue.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center font-heading font-semibold rounded-2xl px-6 py-3 bg-text-primary text-bg-base hover:bg-accent-primary hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Link>
      </div>
    );
  }

  const { title, content, cover_image, category, author, created_at } = blog;

  return (
    <>
      {/* Dynamic top scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-accent-primary z-50 transition-all duration-100 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-brand font-semibold text-text-secondary hover:text-accent-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4.5 h-4.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
          Back to Journal
        </Link>

        {/* Categories / Tags */}
        <div className="mb-4">
          <CategoryBadge category={category} />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight text-text-primary mb-6 max-w-4xl">
          {title}
        </h1>

        {/* Metadata Details strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border-base py-5 mb-8">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${author?.id}`}>
              <img
                src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name}`}
                alt={author?.name}
                className="w-12 h-12 rounded-full object-cover border border-border-base"
              />
            </Link>
            <div>
              <Link to={`/profile/${author?.id}`} className="font-brand font-semibold text-text-primary hover:text-accent-primary transition-colors text-sm sm:text-base block">
                {author?.name}
              </Link>
              <div className="flex items-center gap-3.5 text-xs text-text-secondary font-brand font-normal">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {getReadingTime(content)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Like */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/auth');
                } else {
                  likeMutation.mutate();
                }
              }}
              className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-sm font-semibold hover:scale-105 active:scale-95
                ${isLiked 
                  ? 'bg-red-500/10 border-red-500 text-red-500' 
                  : 'bg-bg-surface border-border-base text-text-secondary hover:text-text-primary hover:border-text-secondary'
                }
              `}
              title={isLiked ? "Unlike Article" : "Like Article"}
            >
              <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </button>



            {/* Share */}
            <button
              onClick={handleShareClick}
              className={`p-2.5 rounded-full border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 bg-bg-surface border-border-base text-text-secondary hover:text-text-primary hover:border-text-secondary`}
              title="Copy Link to Clipboard"
            >
              {copied ? <Check className="w-4.5 h-4.5 text-emerald-600 animate-in zoom-in-50" /> : <Share2 className="w-4.5 h-4.5" />}
              {copied && <span className="text-[10px] uppercase font-bold text-emerald-600 px-1">Copied</span>}
            </button>
          </div>
        </div>

        {/* Large Cover Image */}
        {cover_image && (
          <div className="w-full h-64 sm:h-112.5 rounded-3xl overflow-hidden border border-border-base mb-10 shadow-sm">
            <img
              src={cover_image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Columns (Content + Table of Contents Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Article Serif Content (cols 8) */}
          <article className="lg:col-span-8 font-serif leading-relaxed sm:leading-loose text-text-primary/95">
            {renderMarkdown(content)}

            {/* Author info box bottom */}
            <div className="mt-12 pt-8 border-t border-border-base">
              <AuthorCard author={author} size="sm" />
            </div>
          </article>

          {/* Sticky Sidebar on Desktop (cols 4) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:self-start">
            
            {/* Table of Contents Box */}
            {headings.length > 0 && (
              <div className="bg-bg-surface border border-border-base rounded-3xl p-6 shadow-sm">
                <h4 className="font-brand font-semibold text-sm uppercase tracking-wider text-text-primary mb-4 border-b border-border-base pb-2">
                  Table of Contents
                </h4>
                <nav className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToHeading(h.id)}
                      className={`block text-left text-xs font-brand font-normal text-text-secondary hover:text-accent-primary hover:underline leading-normal transition-colors cursor-pointer
                        ${h.isSub ? 'pl-4 text-[11px] opacity-80' : ''}
                      `}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Author Summary Box */}
            <div className="bg-bg-surface border border-border-base rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-brand font-semibold text-sm uppercase tracking-wider text-text-primary border-b border-border-base pb-2">
                About the Author
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name}`}
                  alt={author?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-heading font-bold text-sm text-text-primary">{author?.name}</p>
                  <p className="text-[10px] text-accent-primary font-normal uppercase font-brand">Contributor</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary font-body leading-relaxed line-clamp-3">
                {author?.bio || 'Passionate about sharing insights, deep thoughts, and interesting technical guides.'}
              </p>
              <Link 
                to={`/profile/${author?.id}`}
                className="inline-flex items-center justify-center font-brand font-semibold text-xs border border-border-base rounded-xl px-4 py-2 hover:bg-bg-base text-text-primary w-full text-center"
              >
                View Profile
              </Link>
            </div>

          </aside>
        </div>

        {/* 5. Comments Section */}
        <section className="max-w-4xl mt-16 border-t border-border-base pt-10">
          <div className="flex items-center gap-3.5 mb-8">
            <MessageSquare className="w-5.5 h-5.5 text-accent-primary" />
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-text-primary">
              Discussion ({comments.length})
            </h3>
          </div>

          {/* Add / Edit Comment Form */}
          <div id="comment-form-section" className="bg-bg-surface border border-border-base rounded-3xl p-5 mb-8">
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name}`}
                    alt={currentUser?.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="grow">
                    <span className="text-xs font-semibold font-brand text-text-primary">
                      {editingComment ? `Editing comment: "${editingComment.content.slice(0, 30)}..."` : `Comment as ${currentUser?.name}`}
                    </span>
                    <textarea
                      rows={3}
                      required
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your thoughts or feedback on this essay..."
                      className="w-full mt-2 bg-bg-base border border-border-base text-text-primary placeholder:text-text-secondary/50 text-sm px-4 py-3 rounded-2xl focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all resize-y"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5">
                  {editingComment && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComment(null);
                        setCommentInput('');
                      }}
                      className="px-4 py-2 border border-border-base text-xs font-semibold text-text-secondary hover:text-text-primary rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="rounded-xl"
                    isLoading={addCommentMutation.isLoading || editCommentMutation.isLoading}
                    icon={Send}
                  >
                    {editingComment ? 'Update' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-text-secondary">
                  Please <Link to="/auth" className="text-accent-primary font-bold hover:underline">Sign In</Link> to join the discussion and post a response.
                </p>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUser?.id}
                  onEdit={handleEditClick}
                  onDelete={(cid) => {
                    if (window.confirm('Are you sure you want to delete this comment?')) {
                      deleteCommentMutation.mutate(cid);
                    }
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary text-sm">
                No comments posted yet. Start the conversation!
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default BlogDetail;
