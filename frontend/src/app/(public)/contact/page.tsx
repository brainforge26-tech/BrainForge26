import { submitContactAction, fetchSiteSettings } from '@/features/homepage/homepage.actions';
import { Mail, Phone, MapPin, Send, Clock, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | BrainForge26 Software Ltd.',
  description: 'Discuss your enterprise software, AI, or cloud project with our team of software architects.',
};

export default async function ContactPage() {
  const settings: any = await fetchSiteSettings().catch(() => ({}));

  const companyName = settings?.companyName || settings?.siteName || 'BrainForge26 Software Ltd.';
  const email = settings?.contactEmail || 'contact@brainforge26.tech';
  const phone = settings?.contactPhone || '+880 1818 293 914';
  const address = settings?.address || 'Level 12, Enterprise Tower, Dhaka, Bangladesh';
  const hours = settings?.workingHours || '24/7 Technical Support';

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Contact <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">{companyName}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Have a project in mind, need technical advice, or exploring dedicated developer teams? Our software engineering team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Dynamic Contact Details */}
          <div className="space-y-8 lg:col-span-1">
            <div className="p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-2xl space-y-6">
              <h3 className="text-xl font-extrabold text-white mb-6 border-b border-white/[0.08] pb-3">
                Corporate Details
              </h3>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Email</h4>
                  <a href={`mailto:${email}`} className="text-sm font-semibold text-white hover:text-orange-400 transition-colors block mt-0.5">
                    {email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Phone</h4>
                  <a href={`tel:${phone}`} className="text-sm font-semibold text-white hover:text-orange-400 transition-colors block mt-0.5">
                    {phone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Headquarters</h4>
                  <p className="text-sm font-semibold text-white leading-relaxed mt-0.5">
                    {address}
                  </p>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Schedule</h4>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-8 lg:p-10 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-black text-white">Send Us An Inquiry</h3>
              <p className="text-xs text-slate-400 mt-1">Fill out the form below and an engineering consultant will reach out shortly.</p>
            </div>

            <form action={submitContactAction} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Alex Vance"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="alex.vance@example.com"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1818 000 000"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Service Interest</label>
                  <select
                    name="service"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#090D16] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors cursor-pointer"
                  >
                    <option value="Custom Web Development" className="bg-[#080A12] text-white py-2">Custom Web Development</option>
                    <option value="AI & Machine Learning" className="bg-[#080A12] text-white py-2">AI & Machine Learning</option>
                    <option value="Mobile App Development" className="bg-[#080A12] text-white py-2">Mobile App Development</option>
                    <option value="Cloud Architecture" className="bg-[#080A12] text-white py-2">Cloud Architecture & DevOps</option>
                    <option value="Dedicated Team" className="bg-[#080A12] text-white py-2">Dedicated Developer Team</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enterprise Software Consultation Inquiry"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Project Details / Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your project requirements, scope, or timeline..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Submit Inquiry Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
