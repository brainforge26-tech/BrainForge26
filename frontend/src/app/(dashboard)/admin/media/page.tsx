'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminMediaLibraryPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/media');
      setFiles(data.data || []);
    } catch (err) {
      console.error('Failed to load media files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'cms');

    try {
      setUploading(true);
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      loadMedia();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;
    try {
      await apiClient.delete(`/media/${id}`);
      loadMedia();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-cyan-400" />
            Media Library & Assets
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload and manage website images, banners, and digital assets.</p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Asset'}
          <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {files.map(f => (
          <div key={f.id} className="p-4 rounded-2xl bg-[#0B1224] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/[0.06] flex items-center justify-center">
              {f.mimeType?.startsWith('image/') ? (
                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-slate-500" />
              )}
            </div>
            <p className="text-xs font-bold text-white truncate mb-1">{f.name}</p>
            <p className="text-[10px] text-slate-400 mb-3">{new Date(f.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyUrl(f.url, f.id)}
                className="flex-1 py-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                {copiedId === f.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === f.id ? 'Copied' : 'Copy URL'}
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {files.length === 0 && !loading && (
          <div className="col-span-full text-center py-16 bg-[#0B1224] rounded-2xl border border-white/[0.08]">
            <p className="text-slate-400 text-sm">No media files uploaded yet. Click "Upload Asset" above to add images.</p>
          </div>
        )}
      </div>
    </div>
  );
}
