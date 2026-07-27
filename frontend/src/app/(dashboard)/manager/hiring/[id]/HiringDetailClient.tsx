'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ExternalLink, Download, FileText, ArrowLeft, Briefcase, Mail, Phone, Calendar } from 'lucide-react';
import { updateApplicationStatusAction } from '@/features/manager/manager.actions';
import type { ActionState } from '@/features/manager/manager.actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import Link from 'next/link';

type AppStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

const STATUS_VARIANT: Record<AppStatus, 'warning' | 'primary' | 'cyan' | 'secondary' | 'success' | 'error'> = {
  PENDING:     'warning',
  REVIEWING:   'primary',
  SHORTLISTED: 'cyan',
  INTERVIEW:   'secondary',
  HIRED:       'success',
  REJECTED:    'error',
};

const initial: ActionState = { success: false, error: '' };

export function HiringDetailClient({ app }: { app: any }) {
  const router = useRouter();
  const updateAction = updateApplicationStatusAction.bind(null, app.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateAction, initial);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <div className="animate-fade-up space-y-6">
      <Link href="/manager/hiring" className="inline-flex items-center gap-2 text-sm text-[#AAB3C5] hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Pipeline
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {app.firstName} {app.lastName}
            <Badge variant={STATUS_VARIANT[app.status as AppStatus]}>{app.status}</Badge>
          </h1>
          <p className="text-[#AAB3C5] mt-1 text-sm">
            Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="accent" padding="lg">
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-[#AAB3C5]">
                  <Mail className="w-4 h-4 text-[#7A8499]" />
                  <a href={`mailto:${app.email}`} className="hover:text-white transition-colors">{app.email}</a>
                </div>
                {app.phone && (
                  <div className="flex items-center gap-3 text-[#AAB3C5]">
                    <Phone className="w-4 h-4 text-[#7A8499]" />
                    <a href={`tel:${app.phone}`} className="hover:text-white transition-colors">{app.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[#AAB3C5]">
                  <Briefcase className="w-4 h-4 text-[#7A8499]" />
                  <span>{app.experience} years of experience</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <h4 className="text-sm font-semibold text-white mb-3">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {app.skills.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-[#AAB3C5]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-3">
                {app.linkedinUrl && (
                  <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" /> LinkedIn Profile
                  </a>
                )}
                {app.portfolioUrl && (
                  <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                  </a>
                )}
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> View Resume
                  </a>
                )}
              </div>

            </CardContent>
          </Card>
          
          {app.coverLetter && (
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#AAB3C5] whitespace-pre-wrap leading-relaxed">
                  {app.coverLetter}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Status Update */}
        <div className="space-y-6">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Manage Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Application Status</label>
                  <select name="status" defaultValue={app.status} className="input-field" required>
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWING">Reviewing</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="HIRED">Hired</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Internal Notes</label>
                  <textarea 
                    name="notes" 
                    defaultValue={app.notes || ''} 
                    className="input-field min-h-[120px]" 
                    placeholder="Add interview feedback or notes..." 
                  />
                </div>

                {'error' in state && state.error && (
                  <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-3 py-2">{state.error}</p>
                )}

                <button type="submit" disabled={pending} className="btn-primary w-full py-2.5 rounded-xl text-sm flex justify-center items-center gap-2">
                  {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
