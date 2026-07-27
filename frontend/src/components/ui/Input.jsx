import React, { useRef, useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';

// Standard Input Field
export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 font-body">
      {label && (
        <label className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full bg-bg-surface border ${error ? 'border-danger-base focus:ring-danger-base/20 focus:border-danger-base' : 'border-border-base focus:ring-accent-primary/20 focus:border-accent-primary'} px-4 py-3 rounded-2xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-4 transition-all duration-200 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger-base mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Standard Textarea
export const Textarea = React.forwardRef(({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 font-body">
      {label && (
        <label className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full bg-bg-surface border ${error ? 'border-danger-base focus:ring-danger-base/20 focus:border-danger-base' : 'border-border-base focus:ring-accent-primary/20 focus:border-accent-primary'} px-4 py-3 rounded-2xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-4 transition-all duration-200 resize-y ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger-base mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Dropdown
export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 font-body">
      {label && (
        <label className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`w-full bg-bg-surface border ${error ? 'border-danger-base focus:ring-danger-base/20' : 'border-border-base focus:ring-accent-primary/20 focus:border-accent-primary'} px-4 py-3 rounded-2xl text-text-primary focus:outline-none focus:ring-4 transition-all duration-200 appearance-none ${className}`}
          {...props}
        >
          <option value="">Select a category</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-danger-base mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Drag & Drop / Premium File Uploader
export const FileUploader = ({
  label,
  error,
  value, // file or url
  onChange,
  className = '',
  accept = 'image/*',
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(typeof value === 'string' ? value : null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 font-body ${className}`}>
      {label && (
        <label className="text-xs uppercase tracking-wider font-semibold font-heading text-text-secondary">
          {label}
        </label>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden
          ${dragActive ? 'border-accent-primary bg-accent-primary/5' : 'border-border-base hover:border-text-secondary'}
          ${error ? 'border-danger-base bg-danger-base/5' : ''}
          ${preview ? 'p-0 h-48 sm:h-64' : 'p-8 flex flex-col items-center justify-center min-h-40 bg-bg-surface'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={handleClear}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform duration-200 hover:scale-110 shadow-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Direct float clear button for mobile */}
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-opacity duration-200 shadow-md sm:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-bg-base rounded-full mb-3 text-text-secondary">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-primary">
              Drag & drop image here, or <span className="text-accent-primary hover:underline">browse</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Supports JPG, PNG or WebP (max 5MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <span className="text-xs text-danger-base mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
};
