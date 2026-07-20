'use client';

import { useState, useTransition } from 'react';
import {
  FileText, Upload, Download, ExternalLink,
  CheckCircle2, AlertCircle, Loader2, File,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }      from '@/components/ui/Badge';
import { updateResumeAction } from '@/features/developer/developer.actions';
import { toast } from 'sonner';

const SAMPLE_DOCS = [
  { name: 'Resume_AlexCarter_2026.pdf',  type: 'Resume',       size: '245 KB', uploaded: '2026-06-15', url: '#', status: 'current' },
  { name: 'Cover_Letter_General.pdf',    type: 'Cover Letter', size: '128 KB', uploaded: '2026-06-15', url: '#', status: 'current' },
  { name: 'Certificate_AWS_SAA.pdf',     type: 'Certificate',  size: '1.2 MB', uploaded: '2026-05-20', url: '#', status: 'verified' },
  { name: 'Certificate_React_Advanced.pdf', type: 'Certificate', size: '980 KB', uploaded: '2026-04-10', url: '#', status: 'verified' },
];

const STATUS_STYLES: Record<string, { label: string; variant: 'success' | 'primary' | 'muted' }> = {
  current:  { label: 'Active',    variant: 'success' },
  verified: { label: 'Verified',  variant: 'primary' },
  archived: { label: 'Archived',  variant: 'muted'   },
};

export default function DeveloperDocumentsPage() {
  const [resumeUrl, setResumeUrl]    = useState('');
  const [isPending, startT]          = useTransition();

  function handleUpdateResume() {
    if (!resumeUrl.trim()) { toast.error('Please enter a resume URL'); return; }
    startT(async () => {
      const r = await updateResumeAction(resumeUrl.trim());
      if (r.success) { toast.success(r.message); setResumeUrl(''); }
      else toast.error(r.error);
    });
  }

  return (
    <div className="animate-fade-up space-y-6 max-w-3xl">
      <PageHeader
        title="Documents"
        description="Manage your resume, certificates and other documents."
      />

      {/* Resume upload section */}
      <Card variant="accent" padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#4F7DFF]" />
            <CardTitle>Resume / CV</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 mt-2">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(79,125,255,0.12)] border border-[rgba(79,125,255,0.2)] flex items-center justify-center">
                <File className="w-5 h-5 text-[#4F7DFF]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Resume_AlexCarter_2026.pdf</p>
                <p className="text-xs text-[#7A8499]">245 KB · Updated Jun 15, 2026</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4F7DFF] hover:bg-[rgba(79,125,255,0.08)] transition-all" title="Download">
                <Download className="w-4 h-4" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all" title="Open">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Upload new */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#AAB3C5]">Update Resume URL</p>
            <p className="text-xs text-[#7A8499]">Upload your PDF to Cloudinary or Google Drive and paste the public link below.</p>
            <div className="flex gap-3">
              <input
                value={resumeUrl}
                onChange={e => setResumeUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/…/resume.pdf"
                className="input-field flex-1 text-sm"
              />
              <button onClick={handleUpdateResume} disabled={isPending}
                className="btn-primary px-4 py-2.5 rounded-full text-sm flex items-center gap-2 shrink-0">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Update
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All documents list */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <CardTitle>All Documents</CardTitle>
            <span className="text-xs text-[#7A8499]">{SAMPLE_DOCS.length} files</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-white/[0.04]">
          {SAMPLE_DOCS.map(doc => (
            <div key={doc.name} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#4F7DFF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                <p className="text-xs text-[#7A8499] mt-0.5">
                  {doc.type} · {doc.size} · {new Date(doc.uploaded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={STATUS_STYLES[doc.status].variant} size="sm">
                  {doc.status === 'verified'
                    ? <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{STATUS_STYLES[doc.status].label}</span>
                    : STATUS_STYLES[doc.status].label}
                </Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={doc.url}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all" title="Download">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all" title="Open">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips card */}
      <Card variant="flat" padding="md" className="border border-[rgba(79,125,255,0.15)] bg-[rgba(79,125,255,0.04)]">
        <CardContent className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#4F7DFF] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white mb-1">Keep your resume up to date</p>
            <p className="text-xs text-[#AAB3C5] leading-relaxed">
              Your resume is shared with clients when you are assigned to a project.
              Upload a PDF to Cloudinary and paste the URL above — it syncs automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
