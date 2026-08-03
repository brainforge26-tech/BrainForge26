'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Sparkles,
  Linkedin,
  Globe,
  FileText,
  Upload,
  FileCheck,
  Check,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Printer,
  Download,
  Calendar,
  Building2,
  QrCode,
  CheckSquare,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import Link from 'next/link';

const POPULAR_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Flutter',
  'TailwindCSS',
];

export function ApplyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobId = searchParams.get('jobId') || undefined;
  const jobTitle = searchParams.get('job') || searchParams.get('title') || undefined;

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [experience, setExperience] = React.useState('3-5 Years');
  const [skills, setSkills] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [portfolioUrl, setPortfolioUrl] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');

  // Resume Upload
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [uploadingResume, setUploadingResume] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [appReferenceId, setAppReferenceId] = React.useState('');
  const [submittedDate, setSubmittedDate] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAddSkill = (skill: string) => {
    const current = skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (!current.includes(skill)) {
      setSkills(current.concat(skill).join(', '));
    }
  };

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
      setError('Please fill in your full name and email address.');
      return;
    }

    try {
      setLoading(true);
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        jobId,
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

      const randomRef = `BF26-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      setAppReferenceId(randomRef);
      setSubmittedDate(new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }));
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (submitted) {
    return (
      <div className="space-y-8">
        {/* Print Stylesheet overlay for PDF Export */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #application-pdf-receipt, #application-pdf-receipt * {
              visibility: visible;
            }
            #application-pdf-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: #ffffff !important;
              color: #000000 !important;
              padding: 20px !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
            .print-text-dark {
              color: #111827 !important;
            }
            .print-bg-light {
              background: #f8fafc !important;
              border: 1px solid #e2e8f0 !important;
            }
          }
        `}</style>

        {/* ── Official PDF Receipt Box ───────────────────────────────────────── */}
        <div
          id="application-pdf-receipt"
          className="p-8 sm:p-12 rounded-2xl bg-[#0E121E] border border-[#1E2638] space-y-8 shadow-2xl text-slate-100 relative overflow-hidden"
        >
          {/* Top Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#1E2638] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight print-text-dark">
                  Brain<span className="text-orange-400">Forge26</span> Software Ltd.
                </h1>
                <p className="text-xs text-slate-400 font-semibold print-text-dark">
                  Official Job Application & Physical Interview Admit Slip
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1">
              <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-black block w-fit sm:ml-auto print-text-dark">
                REF: {appReferenceId}
              </span>
              <span className="text-[11px] text-slate-400 block print-text-dark">
                Issued: {submittedDate}
              </span>
            </div>
          </div>

          {/* Success Banner Notice */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs font-semibold print-bg-light print-text-dark">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Application Verified & Recorded. Please download/print this receipt to present during physical interview verification.
            </span>
          </div>

          {/* Candidate Profile Details Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 border-b border-[#1E2638] pb-2 print-text-dark">
              1. Candidate & Position Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] space-y-1 print-bg-light print-text-dark">
                <span className="text-slate-400 block font-semibold print-text-dark">Applicant Full Name:</span>
                <span className="font-extrabold text-white text-base block print-text-dark">{firstName} {lastName}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] space-y-1 print-bg-light print-text-dark">
                <span className="text-slate-400 block font-semibold print-text-dark">Target Applied Position:</span>
                <span className="font-extrabold text-orange-400 text-base block print-text-dark">{jobTitle || 'General Software Engineering'}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] space-y-1 print-bg-light print-text-dark">
                <span className="text-slate-400 block font-semibold print-text-dark">Contact Email:</span>
                <span className="font-bold text-white block print-text-dark">{email}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] space-y-1 print-bg-light print-text-dark">
                <span className="text-slate-400 block font-semibold print-text-dark">Phone Number:</span>
                <span className="font-bold text-white block print-text-dark">{phone || 'Not Provided'}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] space-y-1 print-bg-light print-text-dark">
                <span className="text-slate-400 block font-semibold print-text-dark">Years of Experience:</span>
                <span className="font-bold text-white block print-text-dark">{experience}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] space-y-1 print-bg-light print-text-dark">
                <span className="text-slate-400 block font-semibold print-text-dark">Resume Document Status:</span>
                <span className="font-bold text-emerald-400 block print-text-dark">
                  {resumeFile ? `Attached (${resumeFile.name})` : 'Submitted'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Skills Summary */}
          {skills && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 border-b border-[#1E2638] pb-2 print-text-dark">
                2. Technical Skills Summary
              </h3>
              <div className="p-4 rounded-xl bg-[#141A2B] border border-[#252E44] text-xs font-semibold text-slate-200 print-bg-light print-text-dark">
                {skills}
              </div>
            </div>
          )}

          {/* Physical Interview Instructions */}
          <div className="p-5 rounded-xl bg-[#141A2B] border border-orange-500/30 space-y-2 print-bg-light print-text-dark">
            <h4 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider flex items-center gap-2 print-text-dark">
              <Building2 className="w-4 h-4" />
              Physical Interview Instructions & Requirements
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5 leading-relaxed print-text-dark">
              <li>Keep a printed or digital copy of this <strong>Official Application Receipt Slip</strong>.</li>
              <li>Bring your original <strong>National ID Card (NID) / Passport</strong> or Student ID.</li>
              <li>Be prepared for technical assessment and practical coding verification with our engineering panel.</li>
            </ul>
          </div>

          {/* Bottom Actions Bar (Hidden during printing) */}
          <div className="pt-4 border-t border-[#1E2638] flex flex-wrap items-center justify-between gap-4 no-print">
            <Link href="/careers">
              <button className="px-6 py-3 rounded-xl bg-[#141A2B] hover:bg-[#1A2238] border border-[#252E44] text-slate-300 font-bold text-xs transition-colors">
                Return to Careers Page
              </button>
            </Link>

            <button
              onClick={handlePrintReceipt}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs tracking-wider uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print PDF Receipt</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E121E] hover:bg-[#141A2B] border border-[#1E2638] text-xs font-bold text-slate-300 hover:text-white transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-orange-400" />
          Back to Positions
        </Link>

        {jobTitle && (
          <span className="px-4 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
            Applying for: <strong className="text-white">{jobTitle}</strong>
          </span>
        )}
      </div>

      {/* Main Standalone Solid Dark Application Form Box */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-10 rounded-2xl bg-[#0E121E] border border-[#1E2638] shadow-2xl text-slate-100 space-y-8"
      >
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* ── Section 1: Candidate Identity ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#1E2638] pb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black">1</div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Candidate Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" /> First Name *
              </label>
              <input
                type="text"
                required
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" /> Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-400" /> Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="alex.vance@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-400" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+880 1818 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Experience & Skills ────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#1E2638] pb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black">2</div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Professional Profile & Tech Skills</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-orange-400" /> Years of Experience *
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer transition-all"
              >
                <option value="Fresh Graduate / < 1 Year" className="bg-[#141A2B] text-white py-2">Fresh Graduate / &lt; 1 Year</option>
                <option value="1-3 Years" className="bg-[#141A2B] text-white py-2">1-3 Years</option>
                <option value="3-5 Years" className="bg-[#141A2B] text-white py-2">3-5 Years</option>
                <option value="5-8 Years" className="bg-[#141A2B] text-white py-2">5-8 Years</option>
                <option value="8+ Years Senior Architect" className="bg-[#141A2B] text-white py-2">8+ Years Senior Architect</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Primary Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="React, Next.js, Node.js, PostgreSQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Skill Tags */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 block">Click to Add Tech Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleAddSkill(sk)}
                  className="px-3 py-1 rounded-lg bg-[#141A2B] hover:bg-orange-500/20 hover:border-orange-500/40 text-xs font-medium text-slate-300 hover:text-orange-300 border border-[#252E44] transition-all"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-orange-400" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-400" /> Portfolio / GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Section 3: Resume PDF Upload & Cover Letter ──────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#1E2638] pb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-black">3</div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Resume Document & Cover Letter</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-orange-400" /> Upload Resume / CV Document (PDF, DOC, DOCX) *
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Max 15MB</span>
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
              className="p-6 rounded-xl border-2 border-dashed border-[#252E44] hover:border-orange-500 bg-[#141A2B] hover:bg-[#1A2238] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5 group"
            >
              {uploadingResume ? (
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 py-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Document...
                </div>
              ) : resumeFile ? (
                <div className="flex items-center gap-4 py-1">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm block truncate max-w-md">{resumeFile.name}</span>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission (Click to replace file)
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[#0E121E] border border-[#252E44] text-slate-400 group-hover:text-orange-400 group-hover:scale-110 flex items-center justify-center transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Click or Drag & Drop your Resume PDF file here</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Supports PDF, DOC, DOCX documents</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-400" /> Cover Letter & Personal Statement (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Share details about your recent projects, engineering accomplishments, and why you want to join BrainForge26..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#141A2B] border border-[#252E44] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E2638] flex items-center justify-end">
          <button
            type="submit"
            disabled={loading || uploadingResume}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
              </>
            ) : (
              <>
                <span>Submit Job Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
