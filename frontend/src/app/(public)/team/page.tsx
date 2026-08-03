import { fetchPublicTeam } from '@/features/homepage/homepage.actions';
import { Github, Linkedin, Mail, Code2, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Our Engineering Team | BrainForge26',
  description: 'Meet our senior software architects, AI engineers, full-stack developers, and cloud specialists.',
};

export default async function TeamPage() {
  const teamMembers = await fetchPublicTeam().catch(() => []);

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/20 uppercase tracking-widest">
            Company Showcase
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Development Team</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            BrainForge26 brings together world-class software engineers, solution architects, and machine learning researchers dedicated to building high-impact technology.
          </p>
        </div>

        {/* Team Grid */}
        {teamMembers.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <p className="text-slate-400 font-medium">Team members will be displayed here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member: any) => (
              <div
                key={member.id}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 p-8 backdrop-blur-xl transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/40 p-1 bg-blue-950/60 shrink-0">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{member.name}</h3>
                      <p className="text-xs font-semibold text-cyan-400 mt-1">{member.position}</p>
                      {member.experience && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                          {member.experience}
                        </span>
                      )}
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{member.bio}</p>
                  )}

                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Core Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.technologies && member.technologies.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tech Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.technologies.map((tech: string) => (
                          <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Developer Profile</span>
                  <div className="flex items-center gap-3">
                    {member.githubUrl && (
                      <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.05] hover:bg-blue-600/30 text-slate-300 hover:text-white transition-all">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.05] hover:bg-blue-600/30 text-slate-300 hover:text-white transition-all">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="p-2 rounded-lg bg-white/[0.05] hover:bg-blue-600/30 text-slate-300 hover:text-white transition-all">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-20 text-center p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border border-blue-500/30">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Looking to Partner With Our Engineering Team?</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-6 text-sm">
            We collaborate with enterprise technology leaders to deliver end-to-end web, AI, and cloud software platforms.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:brightness-110 transition-all">
            Schedule Technical Discovery <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
