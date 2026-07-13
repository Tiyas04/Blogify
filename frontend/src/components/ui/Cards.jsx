import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

// Helper to format date strings
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper to calculate reading time based on word count
export const getReadingTime = (text) => {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Featured Card: Large horizontal layout
export const FeaturedCard = ({ blog }) => {
  if (!blog) return null;
  const { id, title, content, cover_image, category, author, likes_count, comments_count, created_at } = blog;

  return (
    <div className="group relative bg-bg-card border border-border-base rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col md:flex-row min-h-[350px]">
      {/* Cover Image */}
      <div className="md:w-1/2 overflow-hidden relative min-h-[220px]">
        {cover_image ? (
          <img
            src={cover_image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-text-secondary">
            No Cover Image
          </div>
        )}
        <div className="absolute top-4 left-4">
          <CategoryBadge category={category} />
        </div>
      </div>

      {/* Post Details */}
      <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 text-xs font-normal uppercase tracking-wider text-text-secondary font-brand mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {getReadingTime(content)}
            </span>
          </div>

          <Link to={`/blog/${id}`} className="block">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary tracking-tight leading-tight hover:text-accent-primary transition-colors duration-200 mb-3">
              {title}
            </h2>
          </Link>

          <p className="text-text-secondary text-sm sm:text-base font-body line-clamp-3 mb-6 leading-relaxed">
            {content.replace(/[#*`_]/g, '')} {/* strip simple markdown */}
          </p>
        </div>

        {/* Author Footer & Interaction Counts */}
        <div className="flex items-center justify-between border-t border-border-base pt-4">
          <Link to={`/profile/${author?.id}`} className="flex items-center gap-3">
            <img
              src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name || 'User'}`}
              alt={author?.name}
              className="w-10 h-10 rounded-full object-cover border border-border-base"
            />
            <div>
              <p className="text-sm font-heading font-semibold text-text-primary hover:text-accent-primary transition-colors duration-200">
                {author?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-text-secondary">Writer</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              {likes_count || 0}
            </span>
            <span className="flex items-center gap-1.5 hover:text-accent-primary transition-colors">
              <MessageSquare className="w-4 h-4" />
              {comments_count || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Card: Standard vertical card
export const BlogCard = ({ blog }) => {
  if (!blog) return null;
  const { id, title, content, cover_image, category, author, likes_count, comments_count, created_at } = blog;

  return (
    <div className="group bg-bg-card border border-border-base rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col h-full">
      {/* Cover Image */}
      <div className="overflow-hidden relative h-48 sm:h-52">
        {cover_image ? (
          <img
            src={cover_image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-text-secondary">
            No Cover Image
          </div>
        )}
        <div className="absolute top-4 left-4">
          <CategoryBadge category={category} />
        </div>
      </div>

      {/* Post Details */}
      <div className="p-6 flex flex-col justify-between grow">
        <div>
          <div className="flex items-center gap-4 text-xs font-normal uppercase tracking-wider text-text-secondary font-brand mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {getReadingTime(content)}
            </span>
          </div>

          <Link to={`/blog/${id}`} className="block">
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-text-primary tracking-tight leading-snug hover:text-accent-primary transition-colors duration-200 mb-2 line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="text-text-secondary text-sm font-body line-clamp-3 mb-5 leading-relaxed">
            {content.replace(/[#*`_]/g, '')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-base pt-4 mt-auto">
          <Link to={`/profile/${author?.id}`} className="flex items-center gap-2.5">
            <img
              src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name || 'User'}`}
              alt={author?.name}
              className="w-8 h-8 rounded-full object-cover border border-border-base"
            />
            <span className="text-xs sm:text-sm font-heading font-semibold text-text-primary truncate max-w-[100px] hover:text-accent-primary transition-colors">
              {author?.name || 'Anonymous'}
            </span>
          </Link>

          <div className="flex items-center gap-3.5 text-text-secondary text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {comments_count || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Author Card: Minimal user layout
export const AuthorCard = ({ author, bio, size = 'md' }) => {
  const isLg = size === 'lg';
  return (
    <div className={`bg-bg-card border border-border-base rounded-[16px] p-6 flex ${isLg ? 'flex-col items-center text-center' : 'items-center gap-4'}`}>
      <img
        src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name || 'User'}`}
        alt={author?.name}
        className={`${isLg ? 'w-24 h-24 mb-4' : 'w-14 h-14'} rounded-full object-cover border-2 border-accent-primary/20`}
      />
      <div>
        <h4 className="font-heading font-bold text-text-primary text-base sm:text-lg">
          {author?.name || 'Anonymous'}
        </h4>
        <p className="text-xs text-accent-primary font-medium tracking-wide mb-1.5 uppercase font-brand">
          Journalist / Writer
        </p>
        <p className="text-xs sm:text-sm text-text-secondary font-body line-clamp-2 leading-relaxed">
          {bio || author?.bio || 'Passionate about sharing insights, deep thoughts, and interesting technical guides.'}
        </p>
      </div>
    </div>
  );
};

// Comment Card: Layout displaying single comments
export const CommentCard = ({ comment, currentUserId, onEdit, onDelete }) => {
  const { id, author, content, created_at } = comment;
  const isOwner = author?.id === currentUserId;

  return (
    <div className="bg-bg-card border border-border-base rounded-[16px] p-5 flex gap-4 transition-all duration-200">
      <img
        src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name || 'User'}`}
        alt={author?.name}
        className="w-10 h-10 rounded-full object-cover border border-border-base shrink-0"
      />
      <div className="grow">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <span className="font-brand font-medium text-text-primary text-sm hover:text-accent-primary">
              {author?.name || 'Anonymous'}
            </span>
            <span className="text-[11px] text-text-secondary font-brand font-normal ml-3.5">
              {formatDate(created_at)}
            </span>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(comment)}
                className="p-1.5 text-text-secondary hover:text-accent-primary rounded-full hover:bg-bg-base transition-colors cursor-pointer"
                title="Edit Comment"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(id)}
                className="p-1.5 text-text-secondary hover:text-danger-base rounded-full hover:bg-danger-base/10 transition-colors cursor-pointer"
                title="Delete Comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <p className="text-text-primary text-sm font-body leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
};
