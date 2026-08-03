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
} from 'lucide-react';
import apiClient from '@/lib/axios';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle?: string;
}

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
  const [experience, setExperience] = React.useState('1-3 Years');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);

      // Convert file to Base64 Data URL for instant storage
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={handleResetAndClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl my-8 bg-[#090B12] border border-white/[0.15] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-white overflow-hidden"
          >
            {/* Header glow accent */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/[0.1] pb-4 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  Engineering Careers
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {jobTitle ? `Apply for ${jobTitle}` : 'Submit Job Application'}
                </h2>
              </div>
              <button
                onClick={handleResetAndClose}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Application Submitted!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for applying to <strong className="text-orange-400">BrainForge26</strong>. Our recruitment team will review your resume and contact you via email shortly.
                </p>
                <button
                  onClick={handleResetAndClose}
                  className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all"
                >
                  Close & Continue Browsing
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>

                  {/* Last Name */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>

                  {/* Phone */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                      Years of Experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0F121C] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    >
                      <option value="Fresh Graduate / < 1 Year">Fresh Graduate / &lt; 1 Year</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-8 Years">5-8 Years</option>
                      <option value="8+ Years Senior">8+ Years Senior</option>
                    </select>
                  </div>

                  {/* Skills */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LinkedIn */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>

                  {/* Portfolio / GitHub */}
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
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Resume Upload Dropzone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-400" />
                    Upload Resume (PDF, DOC, DOCX up to 15MB)
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
                    className="p-4 rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-orange-500/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                  >
                    {uploadingResume ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing File...
                      </div>
                    ) : resumeFile ? (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-white text-xs block truncate max-w-xs">
                            {resumeFile.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-400 group-hover:scale-110 transition-all" />
                        <span className="text-xs font-bold text-slate-300">
                          Click or drag resume file here (PDF / Word)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Maximum file size 15 MB
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-400" />
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly tell us why you are interested in joining BrainForge26..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || uploadingResume}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Job Application'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
