import { submitContactAction } from '@/features/homepage/homepage.actions';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Contact Us | BrainForge26',
  description: 'Discuss your enterprise software, AI, or cloud project with our team of engineers.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/20 uppercase tracking-widest">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Let's Build Something <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Extraordinary</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Have a project in mind, need technical advice, or exploring dedicated developer teams? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Contact Details */}
          <div className="space-y-8 lg:col-span-1">
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</h4>
                  <a href="mailto:contact@brainforge26.tech" className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                    contact@brainforge26.tech
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Us</h4>
                  <a href="tel:+18005550199" className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                    +1 (800) 555-0199
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Global HQ</h4>
                  <p className="text-sm font-semibold text-white">
                    75 Broad Street, 21st Floor<br />New York, NY 10004
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Response Time</h4>
                  <p className="text-sm font-semibold text-emerald-400">
                    Within 24 Business Hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-8 lg:p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Send Us A Message</h3>
            <p className="text-sm text-slate-400 mb-8">Fill out the form below and an engineering consultant will reach out shortly.</p>

            <form action={submitContactAction} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Service Interest</label>
                  <select
                    name="service"
                    className="w-full px-4 py-3 rounded-xl bg-[#090D16] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="Custom Web Development">Custom Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Cloud Architecture">Cloud Architecture & DevOps</option>
                    <option value="Dedicated Team">Dedicated Developer Team</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enterprise project inquiry"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Project Details / Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your project requirements, scope, or timeline..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
              >
                Submit Inquiry <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
