'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  portfolioLinks?: string[];
}

interface TeamSectionProps {
  teamMembers?: TeamMember[];
}

export function TeamSection({ teamMembers = [] }: TeamSectionProps) {
  if (!teamMembers || teamMembers.length === 0) return null;

  return (
    <section id="team" className="py-24 relative overflow-hidden bg-[#060910]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">Engineering Talent</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
            Meet Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Engineering Experts</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Our company team consists of elite software architects, AI researchers, and full-stack engineers crafting high-performance systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/40 p-6 flex flex-col items-center text-center backdrop-blur-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative mb-5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500/40 p-1 shadow-lg bg-orange-950/20">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-white">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                {member.experience && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md border border-orange-400/40 whitespace-nowrap">
                    {member.experience}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{member.name}</h3>
              <p className="text-xs font-semibold text-orange-400 mt-1 mb-3">{member.position}</p>
              {member.bio && (
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{member.bio}</p>
              )}

              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                  {member.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-white/[0.08] w-full flex items-center justify-center gap-3">
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.05] hover:bg-orange-500/30 text-slate-300 hover:text-white transition-all">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.05] hover:bg-orange-500/30 text-slate-300 hover:text-white transition-all">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="p-2 rounded-lg bg-white/[0.05] hover:bg-orange-500/30 text-slate-300 hover:text-white transition-all">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/team" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-sm font-bold text-white transition-all shadow-lg">
            View All Team Profiles <ExternalLink className="w-4 h-4 text-orange-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
