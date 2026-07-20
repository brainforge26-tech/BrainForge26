'use client';

import { useState } from 'react';
import { Save, Shield, Bell, Globe, Lock, CheckCircle2 } from 'lucide-react';
import { PageHeader }  from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';

const TABS = [
  { id: 'general',  label: 'General',  icon: Globe  },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general');

  return (
    <div className="animate-fade-up max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Configure system-wide settings." />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id
                ? 'bg-[rgba(79,125,255,0.15)] text-white border border-[rgba(79,125,255,0.25)]'
                : 'text-[#7A8499] hover:text-white'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <Card variant="default" padding="lg">
          <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-5 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Agency Name</label>
              <input defaultValue="BrainForceIT" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Support Email</label>
              <input defaultValue="support@brainforceit.com" type="email" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Default Currency</label>
              <select className="input-field">
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Frontend URL</label>
              <input defaultValue="http://localhost:3000" className="input-field" />
            </div>
            <button onClick={() => toast.success('Settings saved')}
              className="btn-primary px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      {tab === 'security' && (
        <Card variant="default" padding="lg">
          <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
          <CardContent className="space-y-5 mt-2">
            {[
              { label: 'Require 2FA for Admins',     desc: 'Force two-factor authentication for all admin accounts' },
              { label: 'Session Timeout (15 min)',   desc: 'Auto-logout inactive sessions after 15 minutes' },
              { label: 'Login Activity Logging',     desc: 'Log all login attempts to the activity feed' },
              { label: 'Require strong passwords',   desc: 'Enforce min 8 chars, uppercase, and number' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-[#7A8499] mt-0.5">{desc}</p>
                </div>
                <div className="shrink-0">
                  <div className="w-10 h-5 rounded-full bg-[rgba(79,125,255,0.3)] border border-[rgba(79,125,255,0.4)] relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-[#4F7DFF]" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('Security settings saved')}
              className="btn-primary px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2">
              <Lock className="w-4 h-4" /> Save Security Settings
            </button>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <Card variant="default" padding="lg">
          <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4 mt-2">
            {[
              { label: 'New client registration',  enabled: true  },
              { label: 'Project completed',         enabled: true  },
              { label: 'Payment received',          enabled: true  },
              { label: 'New hiring application',   enabled: false },
              { label: 'Developer hired',           enabled: true  },
              { label: 'System errors',             enabled: true  },
            ].map(({ label, enabled }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-sm text-[#AAB3C5]">{label}</p>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${enabled ? 'text-[#22C55E]' : 'text-[#7A8499]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {enabled ? 'On' : 'Off'}
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('Notification preferences saved')}
              className="btn-primary px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2">
              <Bell className="w-4 h-4" /> Save Preferences
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
