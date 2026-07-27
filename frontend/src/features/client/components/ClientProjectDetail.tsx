'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, CheckCircle2, FileText, Download, ExternalLink, Calendar, CreditCard } from 'lucide-react';

export function ClientProjectDetail({ project }: { project: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'updates' | 'files'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline & Milestones' },
    { id: 'updates',  label: 'Progress Updates' },
    { id: 'files',    label: 'Files & Assets' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] text-white'
                : 'bg-white/[0.03] text-[#AAB3C5] hover:bg-white/[0.08] hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card variant="default" padding="lg" className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm text-[#7A8499] uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-[#AAB3C5] leading-relaxed">{project.description}</p>
            </div>
            {project.managerNotes && (
              <div className="p-4 rounded-2xl bg-[rgba(79,125,255,0.06)] border border-[rgba(79,125,255,0.15)]">
                <h3 className="text-sm text-[#4F7DFF] font-semibold mb-2">Manager Notes</h3>
                <p className="text-sm text-[#AAB3C5] leading-relaxed">{project.managerNotes}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm text-[#7A8499] uppercase tracking-wider mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech: string) => (
                  <Badge key={tech} variant="muted">{tech}</Badge>
                ))}
              </div>
            </div>
          </Card>
          <div className="space-y-6">
            <Card variant="default" padding="lg">
              <h3 className="text-sm text-[#7A8499] uppercase tracking-wider mb-4">Project Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                  <span className="text-sm text-[#AAB3C5]">Status</span>
                  <Badge variant="primary">{project.status}</Badge>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                  <span className="text-sm text-[#AAB3C5]">Completion</span>
                  <span className="text-sm font-bold text-white">{project.completionPercent}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#AAB3C5]">Estimated Delivery</span>
                  <span className="text-sm text-white flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#7A8499]"/> {project.estimatedDelivery ? new Date(project.estimatedDelivery).toLocaleDateString() : 'TBD'}</span>
                </div>
              </div>
            </Card>
            <Card variant="default" padding="lg">
              <h3 className="text-sm text-[#7A8499] uppercase tracking-wider mb-4">Assigned Team</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F7DFF]/30 to-[#7C5CFF]/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {project.manager?.managerProfile?.firstName?.[0]}{project.manager?.managerProfile?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{project.manager?.managerProfile?.firstName} {project.manager?.managerProfile?.lastName}</p>
                    <p className="text-[10px] text-[#4F7DFF]">Project Manager</p>
                  </div>
                </div>
                {project.developers?.map(({ developer: dev }: any) => (
                  <div key={dev.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-xs font-bold text-[#AAB3C5] shrink-0">
                      {dev.developerProfile?.firstName?.[0]}{dev.developerProfile?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{dev.developerProfile?.firstName} {dev.developerProfile?.lastName}</p>
                      <p className="text-[10px] text-[#7A8499]">{dev.developerProfile?.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-bold text-white mb-6">Timeline Stages</h3>
            <div className="relative space-y-4">
              {project.timelineStages?.length > 0 && <div className="absolute left-4 top-2 bottom-2 w-px bg-white/[0.08]" />}
              {project.timelineStages?.length === 0 && <p className="text-sm text-[#7A8499]">No timeline stages.</p>}
              {project.timelineStages?.map((stage: any) => (
                <div key={stage.id} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full border-4 border-[#050816] flex items-center justify-center shrink-0 z-10 ${
                    stage.status === 'COMPLETED' ? 'bg-[#22C55E]' : stage.status === 'IN_PROGRESS' ? 'bg-[#4F7DFF]' : 'bg-[#3a3f4d]'
                  }`}>
                    {stage.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-[#050816]" />}
                  </div>
                  <div className="pt-1.5">
                    <p className={`text-sm font-semibold ${stage.status === 'COMPLETED' ? 'text-white' : stage.status === 'IN_PROGRESS' ? 'text-[#4F7DFF]' : 'text-[#7A8499]'}`}>{stage.name}</p>
                    <p className="text-xs text-[#AAB3C5] mt-1">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-bold text-white mb-6">Milestones</h3>
            <div className="space-y-3">
              {project.milestones?.length === 0 && <p className="text-sm text-[#7A8499]">No milestones.</p>}
              {project.milestones?.map((m: any) => (
                <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    {m.dueDate && <p className="text-xs text-[#7A8499] mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(m.dueDate).toLocaleDateString()}</p>}
                  </div>
                  <Badge variant={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'primary' : 'muted'}>{m.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'updates' && (
        <Card variant="default" padding="lg">
          <div className="space-y-6 max-w-3xl">
            {project.progressUpdates?.length === 0 && <p className="text-sm text-[#7A8499]">No updates yet.</p>}
            {project.progressUpdates?.map((u: any) => (
              <div key={u.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{u.title}</h4>
                    <p className="text-xs text-[#7A8499] mt-1">Posted by {u.author?.email} on {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="primary" size="sm">{u.progressPercent}% Complete</Badge>
                </div>
                <p className="text-sm text-[#AAB3C5] leading-relaxed">{u.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'files' && (
        <Card variant="default" padding="none">
          <div className="divide-y divide-white/[0.05]">
            {project.files?.length === 0 && <div className="p-8 text-center text-sm text-[#7A8499]">No files attached to this project.</div>}
            {project.files?.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#4F7DFF]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.name}</p>
                    <p className="text-xs text-[#7A8499]">{f.category} · {f.sizeBytes ? (f.sizeBytes / 1024).toFixed(1) + ' KB' : 'Unknown size'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={f.url} download className="p-2 rounded-lg text-[#AAB3C5] hover:text-white hover:bg-white/[0.06] transition-all"><Download className="w-4 h-4"/></a>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-[#AAB3C5] hover:text-white hover:bg-white/[0.06] transition-all"><ExternalLink className="w-4 h-4"/></a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
