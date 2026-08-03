'use client';

import * as React from 'react';
import { Loader2, Upload, FileText, CheckCircle2, User, Mail, Phone, Linkedin, Globe, Sparkles } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useRouter } from 'next/navigation';

export function ApplyClient() {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [experience, setExperience] = React.useState('1-3 Years');
  const [skills, setSkills] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [portfolioUrl, setPortfolioUrl] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');

  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [uploadingResume, setUploadingResume] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setUploadingResume(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeUrl(reader.result as string);
        setUploadingResume(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in your name and email address.');
      return;
    }

    try {
      setLoading(true);
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        experience,
        skills: skillsArray,
        linkedinUrl: linkedinUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
        coverLetter: coverLetter || undefined,
        resumeUrl: resumeUrl || undefined,
      };

      await apiClient.post('/jobs/applications/apply', payload);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-12 rounded-3xl bg-[#090D16] border border-orange-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(249,115,22,0.5)]">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-white">Application Submitted!</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Thank you for applying to <strong className="text-orange-400">BrainForge26</strong>. Our recruitment team will review your resume and contact you via email.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl bg-[#090D16] border border-white/[0.12] shadow-2xl text-slate-100 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" /> First Name *
            </label>
            <input
              type="text"
              required
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" /> Last Name *
            </label>
            <input
              type="text"
              required
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-400" /> Email *
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-400" /> Phone
            </label>
            <input
              type="tel"
              placeholder="+880 1818 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Years of Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0C0F18] border border-white/[0.1] text-sm text-white focus:outline-none"
            >
              <option value="Fresh Graduate / < 1 Year">Fresh Graduate / &lt; 1 Year</option>
              <option value="1-3 Years">1-3 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="5-8 Years">5-8 Years</option>
              <option value="8+ Years Senior">8+ Years Senior</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Skills (comma separated)</label>
            <input
              type="text"
              placeholder="React, Node.js, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">LinkedIn URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Portfolio / GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white"
            />
          </div>
        </div>

        {/* Resume PDF Dropzone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-400" /> Upload Resume (PDF / DOC)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-5 rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-orange-500/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
          >
            {uploadingResume ? (
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Processing File...
              </div>
            ) : resumeFile ? (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white text-xs block truncate max-w-xs">{resumeFile.name}</span>
                  <span className="text-[10px] text-slate-400">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change</span>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-400 transition-all" />
                <span className="text-xs font-bold text-slate-300">Click or drag resume PDF file here</span>
              </>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Cover Letter (Optional)</label>
          <textarea
            rows={3}
            placeholder="Tell us why you want to join..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading || uploadingResume}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...</> : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
