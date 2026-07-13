import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PenTool, Eye, Image, FileText, ArrowLeft, Check, Sparkles, Clock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Input, Textarea, Select, FileUploader } from '../components/ui/Input';
import Button from '../components/ui/Button';
import CategoryBadge from '../components/ui/CategoryBadge';
import { getReadingTime } from '../components/ui/Cards';

const CATEGORIES = ['AI', 'Programming', 'Technology', 'Design', 'Career', 'Open Source'];

const WritePost = () => {
  const { id } = useParams(); // exists if editing
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [apiError, setApiError] = useState('');

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      tags: '',
      content: '',
      cover_image: null,
    },
  });

  // Watch inputs for live preview
  const watchedTitle = watch('title');
  const watchedCategory = watch('category');
  const watchedTags = watch('tags');
  const watchedContent = watch('content');
  const watchedCoverImage = watch('cover_image');

  const [coverImagePreview, setCoverImagePreview] = useState(null);

  // If image is selected, generate object URL preview
  useEffect(() => {
    if (watchedCoverImage instanceof File) {
      const url = URL.createObjectURL(watchedCoverImage);
      setCoverImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof watchedCoverImage === 'string') {
      setCoverImagePreview(watchedCoverImage);
    } else {
      setCoverImagePreview(null);
    }
  }, [watchedCoverImage]);

  // Fetch blog data if in edit mode
  const { data: blogResponse, isLoading } = useQuery({
    queryKey: ['edit-blog', id],
    queryFn: () => api.get(`/blogs/${id}`),
    enabled: isEditMode,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditMode && blogResponse?.data) {
      const blog = blogResponse.data;
      
      // Safety: redirect if current user is not author
      if (user && blog.author?.id !== user.id) {
        navigate('/');
        return;
      }

      setValue('title', blog.title);
      setValue('category', blog.category);
      setValue('tags', blog.tags?.join(', ') || '');
      setValue('content', blog.content);
      if (blog.cover_image) {
        setValue('cover_image', blog.cover_image);
      }
    }
  }, [isEditMode, blogResponse, setValue, user, navigate]);

  // Create Blog Mutation
  const createMutation = useMutation({
    mutationFn: (formData) => api.post('/blogs/create-blog', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      navigate(`/blog/${res.data.id}`);
    },
    onError: (err) => {
      setApiError(err.message || 'Failed to publish story.');
    }
  });

  // Edit Blog Mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => api.patch(`/blogs/update-blog/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      navigate(`/blog/${id}`);
    },
    onError: (err) => {
      setApiError(err.message || 'Failed to update story.');
    }
  });

  const onSubmit = async (data) => {
    setApiError('');
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('content', data.content);
    formData.append('tags', data.tags);

    // Only append image if it is a new file upload
    if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image);
    }

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  // Simple Markdown preview renderer (replicates BlogDetail serif style)
  const renderMarkdownPreview = (text) => {
    if (!text) return <p className="text-text-secondary italic">Type content to see the live preview...</p>;
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((p, idx) => {
      const trimmed = p.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-xl sm:text-2xl font-heading font-black text-text-primary mt-6 mb-3">{trimmed.replace(/^##\s+/, '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-lg sm:text-xl font-heading font-bold text-text-primary mt-4 mb-2">{trimmed.replace(/^###\s+/, '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-text-primary/90 font-serif text-sm sm:text-base">
            {items.map((it, itemIdx) => (
              <li key={itemIdx}>{it.replace(/^[*-]\s+/, '')}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="font-serif text-sm sm:text-base leading-relaxed text-text-primary/90 mb-4 whitespace-pre-wrap">
          {trimmed}
        </p>
      );
    });
  };

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-bg-base">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-base pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 border border-border-base bg-bg-surface hover:bg-bg-base text-text-secondary hover:text-text-primary rounded-full transition-all cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-text-primary flex items-center gap-2">
              <PenTool className="w-5.5 h-5.5 text-accent-primary" />
              {isEditMode ? 'Edit Journal Entry' : 'Compose New Essay'}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Drafts are validated live before updating the daily feed.
            </p>
          </div>
        </div>

        {/* Tab triggers for mobile view */}
        <div className="flex items-center gap-2 lg:hidden w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`grow sm:grow-0 px-4 py-2 border rounded-[12px] text-xs font-semibold font-brand flex items-center justify-center gap-1.5 transition-all
              ${activeTab === 'write' 
                ? 'bg-text-primary text-bg-base border-text-primary' 
                : 'bg-bg-surface border-border-base text-text-secondary'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`grow sm:grow-0 px-4 py-2 border rounded-[12px] text-xs font-semibold font-brand flex items-center justify-center gap-1.5 transition-all
              ${activeTab === 'preview' 
                ? 'bg-text-primary text-bg-base border-text-primary' 
                : 'bg-bg-surface border-border-base text-text-secondary'
              }
            `}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-danger-base/10 border border-danger-base/25 text-danger-base rounded-[16px] text-xs font-semibold">
          ⚠️ {apiError}
        </div>
      )}

      {/* Main Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Compose Column (Form block) */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className={`space-y-6 bg-bg-surface border border-border-base p-6 rounded-[24px] shadow-sm flex flex-col justify-between
            ${activeTab === 'write' ? 'block' : 'hidden lg:block'}
          `}
        >
          <div className="space-y-5">
            <Input
              label="Article Title"
              placeholder="Enter a descriptive heading..."
              error={errors.title}
              {...register('title', {
                required: 'Article title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters' },
                maxLength: { value: 150, message: 'Title must be under 150 characters' }
              })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category Feed"
                options={CATEGORIES}
                error={errors.category}
                {...register('category', { required: 'Category is required' })}
              />

              <Input
                label="Tags (Comma separated)"
                placeholder="react, web, journal"
                error={errors.tags}
                {...register('tags')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
                Cover Image File
              </span>
              <Controller
                name="cover_image"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.cover_image}
                  />
                )}
              />
            </div>

            <Textarea
              label="Body Markdown Editor"
              placeholder="Write your story content here. Supports basic Markdown headers (##, ###) and bullets (-)."
              rows={12}
              error={errors.content}
              {...register('content', {
                required: 'Story content is required',
                minLength: { value: 20, message: 'Story content must be at least 20 characters' }
              })}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            isLoading={isSubmitting}
            icon={Check}
          >
            {isEditMode ? 'Update Publication' : 'Publish to Feed'}
          </Button>
        </form>

        {/* Right Live Preview Column */}
        <div 
          className={`bg-bg-surface border border-border-base p-6 sm:p-8 rounded-[24px] shadow-sm space-y-6 overflow-y-auto max-h-[85vh] lg:sticky lg:top-28
            ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}
          `}
        >
          <div className="flex items-center gap-2 border-b border-border-base pb-3">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-text-primary">
              Live Reader Preview
            </h3>
          </div>

          <div className="space-y-5">
            {/* Category */}
            {watchedCategory && (
              <div>
                <CategoryBadge category={watchedCategory} />
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-text-primary leading-tight">
              {watchedTitle || <span className="text-text-secondary/40 font-normal">Untitled Document</span>}
            </h1>

            {/* Mock metadata */}
            <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {getReadingTime(watchedContent)}
              </span>
              <span>·</span>
              <span>Draft</span>
            </div>

            {/* Cover image preview */}
            {coverImagePreview && (
              <div className="w-full h-44 sm:h-56 rounded-[16px] overflow-hidden border border-border-base">
                <img
                  src={coverImagePreview}
                  alt="Preview Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Separator line */}
            <div className="border-t border-border-base" />

            {/* Content rendering block */}
            <div className="prose max-w-none text-text-primary">
              {renderMarkdownPreview(watchedContent)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WritePost;
