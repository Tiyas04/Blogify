import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, BookOpen, Bookmark, Settings, Edit, Trash2, Calendar, Mail, FileText, Check } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Input, Textarea, FileUploader } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { BlogCard, formatDate } from '../components/ui/Cards';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Profile = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'articles'; // 'articles' | 'bookmarks' | 'settings'
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  // Local state for bookmarks loaded from localStorage
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);

  // Fetch bookmarks from localStorage
  const fetchLocalBookmarks = () => {
    try {
      const items = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setBookmarkedBlogs(items);
    } catch (e) {
      setBookmarkedBlogs([]);
    }
  };

  useEffect(() => {
    fetchLocalBookmarks();
  }, [activeTab]);

  // Fetch ALL blogs to filter client-side for user's own articles
  const { data: allBlogsResponse, isLoading: blogsLoading } = useQuery({
    queryKey: ['profile-all-blogs'],
    queryFn: () => api.get('/blogs/get-all-blogs?limit=50'), // Fetch up to 50 blogs to do high-fidelity client filter
  });

  const blogs = allBlogsResponse?.data?.blogs || [];
  // Filter blogs written by the current logged-in user
  const myBlogs = blogs.filter(b => b.author?.id === currentUser?.id);

  // Form setup for profile editing
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      bio: '',
      avatar: null,
    }
  });

  // Pre-fill edit form when settings tab opens or user profile loads
  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name || '');
      setValue('bio', currentUser.bio || '');
      if (currentUser.avatar) {
        setValue('avatar', currentUser.avatar);
      }
    }
  }, [currentUser, setValue]);

  // Delete Blog Mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (blogId) => api.delete(`/blogs/delete-blog/${blogId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-all-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      fetchLocalBookmarks();
    }
  });

  const handleDeleteBlog = (blogId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  const handleEditBlog = (blogId, e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edit/${blogId}`);
  };

  const onSettingsSubmit = async (data) => {
    setProfileError('');
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.bio) formData.append('bio', data.bio);
      
      // Only append new file upload
      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
      }

      const res = await updateProfile(formData);
      if (res?.success) {
        setSuccessMsg('Profile updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['profile-all-blogs'] });
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile settings.');
    }
  };

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body space-y-10">
      
      {/* 1. Profile Header Card */}
      <div className="bg-bg-surface border border-border-base rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* Avatar image */}
        <img
          src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name || 'User'}`}
          alt={currentUser?.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-accent-primary/20 shrink-0"
        />

        {/* User Details */}
        <div className="grow text-center md:text-left space-y-3.5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-text-primary">
              {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-accent-primary font-semibold tracking-wider uppercase font-brand mt-0.5">
              Digital Contributor
            </p>
          </div>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
            {currentUser?.bio || 'No biography written yet. Update settings to describe your work, background, and publication interests.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-text-secondary font-medium">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-text-secondary/60" />
              {currentUser?.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-text-secondary/60" />
              Joined {currentUser?.created_at ? formatDate(currentUser.created_at) : 'recently'}
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-border-base pt-5 md:pt-0 md:pl-8 text-center shrink-0">
          <div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-text-primary">{myBlogs.length}</p>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-text-secondary">Articles</p>
          </div>
        </div>

      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-border-base font-heading font-semibold text-sm select-none gap-2">
        <button
          onClick={() => setTab('articles')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all flex items-center gap-2
            ${activeTab === 'articles'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <FileText className="w-4.5 h-4.5" />
          Published Stories
        </button>



        <button
          onClick={() => setTab('settings')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all flex items-center gap-2
            ${activeTab === 'settings'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <Settings className="w-4.5 h-4.5" />
          Settings
        </button>
      </div>

      {/* 3. Tab Contents Rendering */}
      <div>
        
        {/* Published articles list */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {blogsLoading ? (
              <LoadingSkeleton count={3} />
            ) : myBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {myBlogs.map((blog) => (
                  <div key={blog.id} className="relative group h-full">
                    <BlogCard blog={blog} />
                    
                    {/* Management overlay overlays for author */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <button
                        type="button"
                        onClick={(e) => handleEditBlog(blog.id, e)}
                        className="p-2 bg-bg-surface hover:bg-accent-primary hover:text-white text-text-primary border border-border-base rounded-full shadow-md cursor-pointer transition-all hover:scale-105"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBlog(blog.id, e)}
                        className="p-2 bg-bg-surface hover:bg-danger-base hover:text-white text-text-primary border border-border-base rounded-full shadow-md cursor-pointer transition-all hover:scale-105"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border-base rounded-[24px] bg-bg-surface max-w-xl mx-auto">
                <BookOpen className="w-12 h-12 text-text-secondary/40 mx-auto mb-3 stroke-[1.5]" />
                <h3 className="font-heading font-bold text-text-primary">No published articles</h3>
                <p className="text-xs text-text-secondary mt-1 mb-5">
                  You haven't authored any publications yet. Compose a new story and share your insights.
                </p>
                <Button
                  onClick={() => navigate('/write')}
                  variant="primary"
                  size="sm"
                >
                  Write First Story
                </Button>
              </div>
            )}
          </div>
        )}



        {/* Account Details Settings form */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-bg-surface border border-border-base rounded-[24px] p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-heading font-bold text-text-primary mb-6 border-b border-border-base pb-3">
              Journal Contributor Settings
            </h3>

            {profileError && (
              <div className="mb-5 p-4 bg-danger-base/10 border border-danger-base/20 text-danger-base rounded-[16px] text-xs font-semibold">
                ⚠️ {profileError}
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-4 bg-success-base/10 border border-success-base/20 text-success-base rounded-[16px] text-xs font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSettingsSubmit)} className="space-y-6">
              <Input
                label="Full Display Name"
                placeholder="Jane Doe"
                error={errors.name}
                {...register('name', {
                  required: 'Display name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Name must be under 100 characters' }
                })}
              />

              <Textarea
                label="Biography"
                placeholder="Describe your writing, background, or journal interests..."
                rows={3}
                error={errors.bio}
                {...register('bio', {
                  maxLength: { value: 200, message: 'Biography must be under 200 characters' }
                })}
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
                  Update Avatar Profile Photo
                </span>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.avatar}
                    />
                  )}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isSubmitting}
              >
                Save Profile Parameters
              </Button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
