import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
// Ah, did we install @hook-form/resolvers? We installed react-hook-form and zod, but not @hook-form/resolvers!
// To be safe and clean, we can write a simple validation object or install @hook-form/resolvers. 
// Or even simpler: we can use react-hook-form's built-in validation rules, which is highly robust and avoids adding too many nested packages!
// Let's use react-hook-form's built-in validation rules (register options like required: "Email is required", minLength: { value: 6, message: "Password must be at least 6 characters" }, etc.). 
// This is extremely clean, uses standard react-hook-form APIs directly, and has zero external risk!
import { useAuth } from '../context/AuthContext';
import { Input, Textarea, FileUploader } from '../components/ui/Input';
import Button from '../components/ui/Button';

const Auth = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Form setups
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
    reset: resetLoginForm,
  } = useForm();

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    control,
    formState: { errors: signupErrors, isSubmitting: signupSubmitting },
    reset: resetSignupForm,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      avatar: null,
    }
  });

  const onLoginSubmit = async (data) => {
    setApiError('');
    try {
      const res = await login(data.email, data.password);
      if (res?.success) {
        navigate('/');
      }
    } catch (err) {
      setApiError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const onSignupSubmit = async (data) => {
    setApiError('');
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.bio) formData.append('bio', data.bio);
      if (data.avatar) formData.append('avatar', data.avatar);

      const res = await registerUser(formData);
      if (res?.success) {
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setApiError(err.message || 'Account registration failed.');
    }
  };

  const switchTab = (isLogin) => {
    setIsLoginTab(isLogin);
    setApiError('');
    setSuccessMsg('');
    resetLoginForm();
    resetSignupForm();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="w-full max-w-lg bg-bg-surface border border-border-base rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header Logo & Title */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-black text-text-primary tracking-tight">
            Blogify<span className="text-accent-primary">.</span>
          </span>
          <p className="text-sm text-text-secondary mt-2">
            {isLoginTab 
              ? 'Welcome back. Sign in to your journal feed.' 
              : 'Join the circle. Publish ideas to the world.'
            }
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border-base mb-6 font-brand font-semibold text-sm">
          <button
            onClick={() => switchTab(true)}
            className={`grow pb-3 text-center cursor-pointer border-b-2 transition-all ${
              isLoginTab 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab(false)}
            className={`grow pb-3 text-center cursor-pointer border-b-2 transition-all ${
              !isLoginTab 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {apiError && (
          <div className="mb-5 p-4 bg-danger-base/10 border border-danger-base/20 text-danger-base rounded-2xl text-xs font-semibold">
            ⚠️ {apiError}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 bg-success-base/10 border border-success-base/20 text-success-base rounded-2xl text-xs font-semibold">
            🎉 {successMsg}
          </div>
        )}

        {/* Sign In Form */}
        {isLoginTab ? (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={loginErrors.email}
              {...loginRegister('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={loginErrors.password}
              {...loginRegister('password', {
                required: 'Password is required',
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loginSubmitting}
            >
              Sign In
            </Button>
          </form>
        ) : (
          /* Create Account Form */
          <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              error={signupErrors.name}
              {...signupRegister('name', {
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'Name must be less than 100 characters',
                },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              error={signupErrors.email}
              {...signupRegister('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={signupErrors.password}
              {...signupRegister('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Textarea
              label="Short Bio"
              placeholder="Tell readers a bit about yourself..."
              rows={2}
              error={signupErrors.bio}
              {...signupRegister('bio', {
                maxLength: {
                  value: 200,
                  message: 'Bio must be under 200 characters',
                },
              })}
            />

            {/* Avatar image upload field */}
            <div className="flex flex-col gap-1.5 font-body">
              <span className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
                Profile Avatar
              </span>
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    value={field.value}
                    onChange={field.onChange}
                    error={signupErrors.avatar}
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={signupSubmitting}
            >
              Register Account
            </Button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Auth;
