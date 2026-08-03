'use client';

import { useState, useEffect } from 'react';
import { FileCheck, Mail, Phone, ExternalLink, Trash2, CheckCircle2, Clock } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminJobApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/jobs/applications/${id}/status`, { status });
      loadApplications();
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application record?')) return;
    try {
      await apiClient.delete(`/jobs/applications/${id}`);
      loadApplications();
    } catch (err) {
      alert('Failed to delete application');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-cyan-400" />
            Job Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review candidate applications submitted through the careers portal.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 rounded-l-xl">Applicant</th>
                <th className="p-4">Applied Job</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Resume / Links</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block">{app.firstName} {app.lastName}</span>
                    <span className="text-xs text-slate-400">{app.email}</span>
                  </td>
                  <td className="p-4 font-semibold text-cyan-400">{app.job?.title || 'General Application'}</td>
                  <td className="p-4 text-xs">{app.experience || 'N/A'}</td>
                  <td className="p-4 text-xs">
                    <div className="flex items-center gap-2">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-bold flex items-center gap-1">
                          Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {app.linkedinUrl && (
                        <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={e => handleUpdateStatus(app.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[#090D16] border border-white/[0.1] text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="HIRED">HIRED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(app.id)} className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {applications.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-sm">
                    No candidate job applications received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
