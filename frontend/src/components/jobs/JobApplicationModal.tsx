'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Briefcase,
  User,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  Check,
} from 'lucide-react';
import apiClient from '@/lib/axios';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle?: string;
}

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

export function JobApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}: JobApplicationModalProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [experience, setExperience] = React.useState('3-5 Years');
  const [skills, setSkills] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [portfolioUrl, setPortfolioUrl] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');

  // Resume File Upload State
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [uploadingResume, setUploadingResume] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

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
      setError('Please provide your full name and work email address.');
      return;
    }

    try {
      setLoading(true);
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        jobId: jobId || undefined,
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

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setSkills('');
    setLinkedinUrl('');
    setPortfolioUrl('');
    setCoverLetter('');
    setResumeFile(null);
    setResumeUrl('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040508]/90 backdrop-blur-xl"
          onClick={handleResetAndClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#07090F] border border-white/[0.12] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] relative text-white overflow-hidden"
          >
            {/* Top ambient lighting header */}
            <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-l from-orange-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* ── Modal Sticky Header ────────────────────────────────────────── */}
            <div className="px-6 sm:px-8 py-5 border-b border-white/[0.08] bg-[#07090F]/95 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-extrabold text-lg tracking-tight">Brain<span className="text-orange-400">Forge26</span></span>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-extrabold text-orange-400 uppercase tracking-widest">
                      Talent Acquisition
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {jobTitle ? `Applying for Position: ${jobTitle}` : 'General Engineering Career Portal'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all border border-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Modal Scrollable Body ──────────────────────────────────────── */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-5"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(249,115,22,0.45)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white">Application Received!</h3>
                    <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                      Thank you for submitting your application to <strong className="text-orange-400">BrainForge26</strong>. Our recruitment team will review your resume and contact you via email.
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleResetAndClose}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all"
                    >
                      Return to Careers Page
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  {/* ── Section 1: Candidate Personal Info ─────────────────────── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold">1</div>
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Candidate Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-orange-400" />
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Alex"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.05] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-orange-400" />
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Vance"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.05] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-orange-400" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="alex.vance@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.05] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-orange-400" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+880 1818 000 000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.05] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Section 2: Professional Profile & Tech Skills ─────────── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold">2</div>
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Professional Profile & Tech Skills</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                          Years of Experience *
                        </label>
                        <select
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-[#0B0D16] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-orange-500/60 transition-all"
                        >
                          <option value="Fresh Graduate / < 1 Year">Fresh Graduate / &lt; 1 Year</option>
                          <option value="1-3 Years">1-3 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5-8 Years">5-8 Years</option>
                          <option value="8+ Years Senior Architect">8+ Years Senior Architect</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                          Primary Skills (Comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="React, Next.js, Node.js, PostgreSQL"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.05] transition-all"
                        />
                      </div>
                    </div>

                    {/* Popular Tech Pills */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 block">Click to Add Popular Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SKILLS.map((sk) => (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => handleAddSkill(sk)}
                            className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-orange-500/20 hover:border-orange-500/30 text-xs font-medium text-slate-300 hover:text-orange-300 border border-white/[0.08] transition-all"
                          >
                            + {sk}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-orange-400" />
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          Portfolio / GitHub URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/username"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Section 3: Documents & Cover Letter ──────────────────── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold">3</div>
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Resume PDF Document & Cover Letter</h3>
                    </div>

                    {/* Resume Drag-and-drop Card */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-orange-400" />
                          Upload Resume / CV Document (PDF, DOC, DOCX) *
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
                        className="p-6 rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-orange-500/60 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5 group"
                      >
                        {uploadingResume ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 py-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Document...
                          </div>
                        ) : resumeFile ? (
                          <div className="flex items-center gap-4 py-1">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                              <FileCheck className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm block truncate max-w-md">
                                  {resumeFile.name}
                                </span>
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              </div>
                              <span className="text-xs text-slate-400 block mt-0.5">
                                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission (Click to replace file)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-400 group-hover:text-orange-400 group-hover:scale-110 flex items-center justify-center transition-all">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-white block">
                                Click or Drag & Drop your Resume PDF file here
                              </span>
                              <span className="text-xs text-slate-400 block mt-0.5">
                                Supports PDF, DOC, DOCX documents
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Cover Letter Text Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-orange-400" />
                        Cover Letter & Personal Statement (Optional)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Share details about your recent projects, engineering accomplishments, and why you want to join BrainForge26..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* ── Modal Bottom Action Bar ──────────────────────────── */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading || uploadingResume}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(249,115,22,0.45)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Application...
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
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
