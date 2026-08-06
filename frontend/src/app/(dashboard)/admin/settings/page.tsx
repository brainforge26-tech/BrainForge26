'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminSiteSettingsPage() {
  const [general, setGeneral] = useState({
    companyName: 'BrainForge26',
    tagline: 'Enterprise Software & AI Solutions Company',
    description: 'We design, build, and scale enterprise web platforms, mobile applications, and artificial intelligence solutions.',
    contactEmail: 'contact@brainforge26.tech',
    contactPhone: '+1 (800) 555-0199',
    address: '75 Broad Street, 21st Floor, New York, NY 10004',
  });

  const [hero, setHero] = useState({
    badgeText: 'Elite Software Engineering Agency',
    heading: 'We Build Scalable Software & AI Systems For Global Enterprises',
    subheading: 'From custom cloud applications to intelligent machine learning models, we partner with industry leaders to power their digital transformation.',
    primaryCtaText: 'Discuss Your Project',
    primaryCtaUrl: '/contact',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Password change state ────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]     = useState(false);

  useEffect(() => {
    apiClient.get('/site-settings/public').then(res => {
      if (res.data?.data) {
        if (res.data.data.general) setGeneral(res.data.data.general);
        if (res.data.data.hero) setHero(res.data.data.hero);
      }
    }).catch(() => null);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiClient.put('/site-settings/general', { value: general });
      await apiClient.put('/site-settings/hero', { value: hero });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    try {
      setPwSaving(true);
      await apiClient.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      toast.success('Password changed! You will be logged out shortly.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Give the toast time to show before forcing logout
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-4xl">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" />
            Global Site Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure company branding, hero banner content, and contact information.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Settings */}
        <div className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/[0.08] pb-3">Company Branding & Info</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company Name</label>
              <input type="text" value={general.companyName} onChange={e => setGeneral({ ...general, companyName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company Tagline</label>
              <input type="text" value={general.tagline} onChange={e => setGeneral({ ...general, tagline: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company Description</label>
            <textarea rows={2} value={general.description} onChange={e => setGeneral({ ...general, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Contact Email</label>
              <input type="email" value={general.contactEmail} onChange={e => setGeneral({ ...general, contactEmail: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Contact Phone</label>
              <input type="text" value={general.contactPhone} onChange={e => setGeneral({ ...general, contactPhone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Hero Section Content */}
        <div className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/[0.08] pb-3">Homepage Hero Section</h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Hero Heading Title</label>
            <input type="text" value={hero.heading} onChange={e => setHero({ ...hero, heading: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Hero Subheading</label>
            <textarea rows={2} value={hero.subheading} onChange={e => setHero({ ...hero, subheading: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm resize-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl flex items-center gap-2"
        >
          {saved ? <><Check className="w-4 h-4" /> Settings Saved!</> : <><Save className="w-4 h-4" /> Save Site Settings</>}
        </button>

      </form>

      {/* ── Change Password ────────────────────────────────────────────── */}
      <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl space-y-5 mt-2">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <Lock className="w-4 h-4 text-[#4F7DFF]" />
          <h3 className="text-lg font-bold text-white">Change Admin Password</h3>
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={pwForm.currentPassword}
              onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              required
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm outline-none focus:border-[#4F7DFF]"
              placeholder="Enter current password"
            />
            <button type="button" onClick={() => setShowCurrent(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
              required
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm outline-none focus:border-[#4F7DFF]"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
            />
            <button type="button" onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={pwForm.confirmPassword}
            onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm outline-none focus:border-[#4F7DFF]"
            placeholder="Re-enter new password"
          />
          {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
            <p className="text-xs text-[#EF4444] mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword || pwForm.newPassword !== pwForm.confirmPassword}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] hover:opacity-90 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {pwSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing…</> : <><Lock className="w-4 h-4" /> Change Password</>}
          </button>
          <p className="text-xs text-slate-500">You will be logged out after a successful change.</p>
        </div>
      </form>

    </div>
  );
}
