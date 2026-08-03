'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2, FolderOpen, RefreshCw } from 'lucide-react';
import apiClient from '@/lib/axios';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  category?: string;
  aspectRatio?: 'square' | 'banner' | 'landscape';
}

export function ImageUploader({
  value,
  onChange,
  label = 'Upload Image / Photo',
  category = 'general',
  aspectRatio = 'landscape',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP, SVG, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const { data } = await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        throw new Error('Invalid upload response');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      // Fallback: convert file to local Data URL on client if server upload fails
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } catch {
        setError('Failed to upload image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const openLibrary = async () => {
    try {
      setLoadingMedia(true);
      setShowMediaLibrary(true);
      const { data } = await apiClient.get('/media');
      setMediaList(data.data || []);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={openLibrary}
          className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" /> Browse Media Library
        </button>
      </div>

      {value ? (
        /* Image Preview Box */
        <div className="relative group rounded-2xl border border-white/[0.1] bg-[#0B1224] p-3 shadow-xl overflow-hidden">
          <div
            className={`w-full overflow-hidden rounded-xl border border-white/[0.08] relative bg-black/40 ${
              aspectRatio === 'square'
                ? 'h-40 max-w-[160px]'
                : aspectRatio === 'banner'
                ? 'h-36'
                : 'h-48'
            }`}
          >
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-blue-500 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change Photo
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Check className="w-3.5 h-3.5" /> Photo Attached
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-rose-400 hover:underline font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 bg-[#090D16] ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
              : 'border-white/[0.15] hover:border-cyan-400/50 hover:bg-white/[0.02]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUploadFile(e.target.files[0])}
            className="hidden"
          />

          {uploading ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-bold text-slate-300">Uploading photo to server...</p>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-extrabold text-white">
                Drag & drop your photo here, or <span className="text-cyan-400 underline">Browse File</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Supports PNG, JPG, WEBP, SVG, GIF up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-400">{error}</p>
      )}

      {/* Media Library Selection Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" /> Select From Media Library
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingMedia ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Loading uploaded media files...</p>
              </div>
            ) : mediaList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No media files found in library. Drag and drop a new photo above!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onChange(item.url);
                      setShowMediaLibrary(false);
                    }}
                    className="relative group rounded-xl overflow-hidden border border-white/[0.1] hover:border-cyan-400 cursor-pointer aspect-square bg-black/40 transition-all hover:scale-105"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <span className="text-[10px] font-extrabold text-cyan-300">Select Image</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
