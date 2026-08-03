'use client';

import * as React from 'react';
import {
  FileCheck,
  Mail,
  Phone,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Send,
  FileText,
  User,
  Briefcase,
  Sparkles,
  X,
  Loader2,
} from 'lucide-react';
import apiClient from '@/lib/axios';

const EMAIL_TEMPLATES = [
  {
    label: 'Interview Invitation',
    status: 'INTERVIEW',
    subject: 'Interview Invitation — BrainForge26 Engineering Team',
    message: `Thank you for applying to BrainForge26!

We were impressed by your background and experience, and we would love to invite you for a 30-minute technical interview with our engineering team.

Please let us know your availability over the coming days, or select a time slot that works best for you.

Best regards,
BrainForge26 Talent Acquisition`,
  },
  {
    label: 'Application Under Review',
    status: 'REVIEWING',
    subject: 'Update on Your Application — BrainForge26',
    message: `Thank you for your interest in BrainForge26.

Your application and resume are currently being reviewed by our engineering lead. We will reach out to you with next steps shortly.

Best regards,
BrainForge26 Hiring Team`,
  },
  {
    label: 'Job Offer',
    status: 'HIRED',
    subject: 'Job Offer — Joining BrainForge26',
    message: `Congratulations!

We are thrilled to offer you a position at BrainForge26. Your technical skills and vision align wonderfully with our engineering standards.

Attached details will outline the offer terms. Please confirm your acceptance.

Welcome aboard!
BrainForge26 HR Team`,
  },
  {
    label: 'Rejection Letter',
    status: 'REJECTED',
    subject: 'Application Status — BrainForge26',
    message: `Thank you for taking the time to apply to BrainForge26 and for your interest in joining our team.

After careful review, we have decided to move forward with other candidates whose profiles more closely match our current requirements for this specific role.

We will keep your resume on file for future opportunities. We wish you all the best in your career endeavors.

Sincerely,
BrainForge26 Recruitment Team`,
  },
];

export default function AdminJobApplicationsPage() {
  const [applications, setApplications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  // Modals state
  const [viewApp, setViewApp] = React.useState<any | null>(null);
  const [emailModalApp, setEmailModalApp] = React.useState<any | null>(null);

  // Email form state
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailMessage, setEmailMessage] = React.useState('');
  const [emailStatus, setEmailStatus] = React.useState('INTERVIEW');
  const [sendingEmail, setSendingEmail] = React.useState(false);
  const [emailResult, setEmailResult] = React.useState('');

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/jobs/applications');
      setApplications(data.data || []);
    } catch (err) {
      console.error('Failed to load job applications:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/jobs/applications/${id}/status`, { status });
      loadApplications();
    } catch {
      alert('Failed to update application status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate application?')) return;
    try {
      await apiClient.delete(`/jobs/applications/${id}`);
      loadApplications();
    } catch {
      alert('Failed to delete application');
    }
  };

  const handleOpenEmailModal = (app: any) => {
    setEmailModalApp(app);
    const defaultTpl = EMAIL_TEMPLATES[0];
    setEmailSubject(defaultTpl.subject);
    setEmailMessage(defaultTpl.message);
    setEmailStatus(defaultTpl.status);
    setEmailResult('');
  };

  const handleApplyTemplate = (tpl: (typeof EMAIL_TEMPLATES)[0]) => {
    setEmailSubject(tpl.subject);
    setEmailMessage(tpl.message);
    setEmailStatus(tpl.status);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalApp) return;

    try {
      setSendingEmail(true);
      setEmailResult('');
      await apiClient.post(`/jobs/applications/${emailModalApp.id}/send-email`, {
        subject: emailSubject,
        message: emailMessage,
        status: emailStatus,
      });

      setEmailResult('Email sent successfully and candidate status updated!');
      loadApplications();
      setTimeout(() => {
        setEmailModalApp(null);
      }, 1800);
    } catch (err: any) {
      setEmailResult(err?.response?.data?.message || 'Failed to send email.');
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const nameMatch = `${app.firstName} ${app.lastName}`.toLowerCase().includes(search.toLowerCase());
    const emailMatch = app.email?.toLowerCase().includes(search.toLowerCase());
    const skillMatch = (app.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSearch = nameMatch || emailMatch || skillMatch;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-slate-100 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#090D16] p-6 rounded-3xl border border-white/[0.08] shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-orange-400" />
            Job Applications & Candidates
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review candidate resumes, experience, cover letters, and email applicants directly.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl text-orange-300 text-xs font-bold shrink-0">
          <User className="w-4 h-4" />
          <span>Total Applications: {applications.length}</span>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0B1224] p-4 rounded-2xl border border-white/[0.08]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, email, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-orange-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#090D16] border border-white/[0.1] text-xs font-bold text-white focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="REVIEWING">REVIEWING</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="INTERVIEW">INTERVIEW</option>
            <option value="HIRED">HIRED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-[11px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 rounded-l-xl">Applicant Details</th>
                <th className="p-4">Applied Role</th>
                <th className="p-4">Experience & Skills</th>
                <th className="p-4">Resume & Links</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Candidate Name & Contact */}
                  <td className="p-4">
                    <span className="font-extrabold text-white text-sm block">
                      {app.firstName} {app.lastName}
                    </span>
                    <div className="flex flex-col text-xs text-slate-400 gap-0.5 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-orange-400" />
                        {app.email}
                      </span>
                      {app.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {app.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Applied Role */}
                  <td className="p-4">
                    <span className="font-bold text-orange-400 block text-xs">
                      {app.job?.title || 'General Application'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Experience & Skills */}
                  <td className="p-4 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 font-bold block w-fit mb-1.5">
                      {app.experience || 'N/A'}
                    </span>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(app.skills || []).map((sk: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 text-[10px] font-semibold border border-orange-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Resume PDF & External Links */}
                  <td className="p-4 text-xs space-y-1">
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 font-bold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Resume PDF</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">No Resume Uploaded</span>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      {app.linkedinUrl && (
                        <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-[11px] underline">
                          LinkedIn
                        </a>
                      )}
                      {app.portfolioUrl && (
                        <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-[11px] underline">
                          Portfolio / GitHub
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#090D16] border border-white/[0.12] text-xs font-bold text-white focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="HIRED">HIRED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>

                  {/* Actions: View Details, Send Email, Delete */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Detail Modal */}
                      <button
                        onClick={() => setViewApp(app)}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                        title="View Cover Letter & Full Candidate Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Send Email Action */}
                      <button
                        onClick={() => handleOpenEmailModal(app)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                        title="Send Email to Candidate"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </button>

                      {/* Delete Record */}
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                        title="Delete candidate record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                    No candidate applications match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Candidate Full View Modal ────────────────────────────────────────────── */}
      {viewApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setViewApp(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#090D16] border border-white/[0.15] rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  {viewApp.firstName} {viewApp.lastName}
                </h3>
                <p className="text-xs text-orange-400 font-bold mt-0.5">
                  Applied for: {viewApp.job?.title || 'General Application'}
                </p>
              </div>
              <button onClick={() => setViewApp(null)} className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block font-semibold">Contact Email</span>
                <span className="font-bold text-white text-sm block">{viewApp.email}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block font-semibold">Phone Number</span>
                <span className="font-bold text-white text-sm block">{viewApp.phone || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block font-semibold">Experience</span>
                <span className="font-bold text-white text-sm block">{viewApp.experience || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block font-semibold">Application Status</span>
                <span className="font-bold text-orange-400 text-sm block">{viewApp.status}</span>
              </div>
            </div>

            {/* Resume Button */}
            {viewApp.resumeUrl && (
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-orange-400" />
                  <div>
                    <span className="font-bold text-white text-xs block">Candidate Resume PDF</span>
                    <span className="text-[10px] text-slate-400">Click to view/download original PDF document</span>
                  </div>
                </div>
                <a
                  href={viewApp.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  Open Resume PDF <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Cover Letter Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Cover Letter Message:</span>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {viewApp.coverLetter || 'No cover letter submitted by candidate.'}
              </div>
            </div>

            {/* Notes history */}
            {viewApp.notes && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-orange-400 block">Admin Email & Activity History:</span>
                <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 text-xs text-slate-300 whitespace-pre-wrap">
                  {viewApp.notes}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const appToEmail = viewApp;
                  setViewApp(null);
                  handleOpenEmailModal(appToEmail);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" /> Send Email to {viewApp.firstName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Send Candidate Email Modal ────────────────────────────────────────── */}
      {emailModalApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setEmailModalApp(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#090D16] border border-white/[0.15] rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-orange-400" />
                  Email Candidate: {emailModalApp.firstName} {emailModalApp.lastName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recipient: <strong className="text-white">{emailModalApp.email}</strong>
                </p>
              </div>
              <button onClick={() => setEmailModalApp(null)} className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 block">Select Email Template:</span>
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-orange-500/20 hover:border-orange-500/30 text-xs font-bold text-slate-300 hover:text-orange-300 border border-white/[0.08] transition-all"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              {emailResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold border ${
                    emailResult.includes('successfully')
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  {emailResult}
                </div>
              )}

              {/* Status Update choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Update Application Status to:</label>
                <select
                  value={emailStatus}
                  onChange={(e) => setEmailStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F121C] border border-white/[0.1] text-xs font-bold text-white focus:outline-none"
                >
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="REVIEWING">REVIEWING</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="HIRED">HIRED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Subject *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Message Body *</label>
                <textarea
                  rows={6}
                  required
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-orange-500/50 leading-relaxed font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEmailModalApp(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Email Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
