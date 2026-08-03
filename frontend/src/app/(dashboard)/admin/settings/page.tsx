'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import apiClient from '@/lib/axios';

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
    </div>
  );
}
