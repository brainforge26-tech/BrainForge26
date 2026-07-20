'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import {
  User, Mail, Phone, Code2, Github, Linkedin,
  Globe, Briefcase, Plus, Trash2, Loader2, CheckCircle2, Edit3,
} from 'lucide-react';
import { PageHeader }   from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }        from '@/components/ui/Badge';
import { Avatar }       from '@/components/ui/Avatar';
import {
  updateProfileAction, addPortfolioAction, deletePortfolioAction,
} from '@/features/developer/developer.actions';
import type { ActionState } from '@/features/developer/developer.actions';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

// ─── Sample profile data (replaced by live data when backend is running) ──────
const SAMPLE = {
  firstName: 'Alex', lastName: 'Carter', title: 'Full-Stack Developer',
  email: 'alex@brainforceit.com', phone: '+1 555 0101',
  bio: 'Passionate full-stack developer with 7 years of experience building scalable web applications.',
  skills: ['React','Next.js','Node.js','TypeScript','PostgreSQL','Docker'],
  experience: 7, isAvailable: true,
  githubUrl: 'https://github.com', linkedinUrl: 'https://linkedin.com',
  portfolioItems: [
    { id: '1', title: 'E-Commerce Platform', description: 'Full-stack marketplace with Stripe', technologies: ['Next.js','PostgreSQL','Stripe'], url: '#' },
    { id: '2', title: 'Analytics Dashboard', description: 'Real-time data visualization', technologies: ['React','D3.js','WebSockets'], url: '#' },
  ],
};

export default function DeveloperProfilePage() {
  const [editing, setEditing]        = useState(false);
  const [showPortForm, setPortForm]  = useState(false);
  const [isPending, startT]          = useTransition();

  const [profileState, profileAction, profilePending] = useActionState<ActionState, FormData>(updateProfileAction, initial);
  const [portState,    portAction,    portPending]    = useActionState<ActionState, FormData>(addPortfolioAction, initial);

  useEffect(() => {
    if (profileState.success) { toast.success(profileState.message); setEditing(false); }
  }, [profileState.success, profileState]);

  useEffect(() => {
    if (portState.success) { toast.success(portState.message); setPortForm(false); }
  }, [portState.success, portState]);

  function handleDeletePortfolio(id: string) {
    startT(async () => {
      const r = await deletePortfolioAction(id);
      if (r.success) toast.success(r.message); else toast.error(r.error);
    });
  }

  return (
    <div className="animate-fade-up space-y-6 max-w-4xl">
      <PageHeader title="My Profile" description="Manage your developer profile and portfolio." />

      {/* Profile card */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={`${SAMPLE.firstName} ${SAMPLE.lastName}`} size="xl" />
              <div>
                <h2 className="text-xl font-bold text-white">{SAMPLE.firstName} {SAMPLE.lastName}</h2>
                <p className="text-sm text-[#7A8499] mt-0.5">{SAMPLE.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={SAMPLE.isAvailable ? 'success' : 'muted'} size="sm" dot>
                    {SAMPLE.isAvailable ? 'Available' : 'On Project'}
                  </Badge>
                  <Badge variant="primary" size="sm">{SAMPLE.experience} yrs exp</Badge>
                </div>
              </div>
            </div>
            <button onClick={() => setEditing(v => !v)}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full shrink-0">
              <Edit3 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="space-y-5 mt-4">
              {/* Contact */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Mail,     label: 'Email',    value: SAMPLE.email },
                  { icon: Phone,    label: 'Phone',    value: SAMPLE.phone },
                  { icon: Github,   label: 'GitHub',   value: SAMPLE.githubUrl },
                  { icon: Linkedin, label: 'LinkedIn', value: SAMPLE.linkedinUrl },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Icon className="w-4 h-4 text-[#4F7DFF] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#7A8499]">{label}</p>
                      <p className="text-sm text-white truncate">{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Bio */}
              {SAMPLE.bio && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-[#7A8499] mb-1.5">About</p>
                  <p className="text-sm text-[#AAB3C5] leading-relaxed">{SAMPLE.bio}</p>
                </div>
              )}
              {/* Skills */}
              <div>
                <p className="text-xs text-[#7A8499] mb-2 flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Skills</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE.skills.map(s => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(79,125,255,0.1)] border border-[rgba(79,125,255,0.2)] text-[#4F7DFF]">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form action={profileAction} className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">First Name</label><input name="firstName" defaultValue={SAMPLE.firstName} className="input-field" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">Last Name</label><input name="lastName" defaultValue={SAMPLE.lastName} className="input-field" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">Job Title</label><input name="title" defaultValue={SAMPLE.title} className="input-field" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">Phone</label><input name="phone" defaultValue={SAMPLE.phone} className="input-field" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">GitHub URL</label><input name="githubUrl" defaultValue={SAMPLE.githubUrl} className="input-field" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">LinkedIn URL</label><input name="linkedinUrl" defaultValue={SAMPLE.linkedinUrl} className="input-field" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-[#AAB3C5]">Experience (years)</label><input name="experience" type="number" defaultValue={SAMPLE.experience} className="input-field" /></div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Availability</label>
                  <select name="isAvailable" defaultValue={String(SAMPLE.isAvailable)} className="input-field">
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Bio</label>
                <textarea name="bio" rows={3} defaultValue={SAMPLE.bio} className="input-field resize-none py-3" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Skills <span className="text-[#7A8499] text-xs">(comma-separated)</span></label>
                <input name="skills" defaultValue={SAMPLE.skills.join(', ')} className="input-field" />
              </div>
              {'error' in profileState && profileState.error && (
                <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{profileState.error}</p>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={profilePending} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
                  {profilePending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-5 py-2.5 rounded-full text-sm">Cancel</button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card variant="default" padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#7C5CFF]" /> Portfolio</CardTitle>
            <button onClick={() => setPortForm(v => !v)} className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full">
              <Plus className="w-3.5 h-3.5" /> {showPortForm ? 'Cancel' : 'Add Project'}
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 mt-2">
          {showPortForm && (
            <form action={portAction} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-xs font-medium text-[#AAB3C5]">Title *</label><input name="title" required placeholder="E-Commerce Platform" className="input-field text-sm" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-[#AAB3C5]">URL</label><input name="url" placeholder="https://github.com/…" className="input-field text-sm" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-[#AAB3C5]">Description</label><input name="description" placeholder="Brief description" className="input-field text-sm" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-[#AAB3C5]">Technologies <span className="text-[#7A8499]">(comma-sep)</span></label><input name="technologies" placeholder="React, Node.js, PostgreSQL" className="input-field text-sm" /></div>
              {'error' in portState && portState.error && (
                <p className="text-xs text-[#EF4444]">{portState.error}</p>
              )}
              <button type="submit" disabled={portPending} className="btn-primary px-4 py-2 rounded-full text-xs flex items-center gap-1.5">
                {portPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add Item
              </button>
            </form>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {SAMPLE.portfolioItems.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-[#7A8499] mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4F7DFF] hover:bg-[rgba(79,125,255,0.08)] transition-all">
                      <Briefcase className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => handleDeletePortfolio(item.id)} disabled={isPending}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.technologies.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] border border-white/[0.07] text-[#AAB3C5]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
