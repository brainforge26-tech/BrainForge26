'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, ExternalLink, Mail, Sparkles } from 'lucide-react';
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

const DEFAULT_TEAM = [
  {
    id: 'team-1',
    name: 'Alex Vance',
    position: 'Chief Technology Officer & Lead Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    bio: '10+ years specializing in distributed microservices, Next.js architecture, and high-throughput PostgreSQL databases.',
    experience: '10+ Yrs Exp',
    skills: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'System Architecture'],
    githubUrl: 'https://github.com/brainforge26',
    linkedinUrl: 'https://linkedin.com/company/brainforge26',
    email: 'alex@brainforge26.tech',
  },
  {
    id: 'team-2',
    name: 'Sarah Connor',
    position: 'Head of AI Research & Automation',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    bio: 'Leading LLM agent integrations, predictive ML models, and automated enterprise workflow pipelines.',
    experience: '8+ Yrs Exp',
    skills: ['Python', 'OpenAI API', 'LangChain', 'TensorFlow'],
    githubUrl: 'https://github.com/brainforge26',
    linkedinUrl: 'https://linkedin.com/company/brainforge26',
    email: 'sarah@brainforge26.tech',
  },
  {
    id: 'team-3',
    name: 'Michael Zhang',
    position: 'Senior Full-Stack Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    bio: 'Crafting responsive React, Node.js REST/GraphQL APIs, and real-time WebSockets applications.',
    experience: '6+ Yrs Exp',
    skills: ['React', 'Node.js', 'Express', 'TailwindCSS'],
    githubUrl: 'https://github.com/brainforge26',
    linkedinUrl: 'https://linkedin.com/company/brainforge26',
    email: 'michael@brainforge26.tech',
  },
  {
    id: 'team-4',
    name: 'David Miller',
    position: 'DevOps & Cloud Infrastructure Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    bio: 'Managing AWS multi-region clusters, Docker containerization, and zero-downtime CI/CD deployments.',
    experience: '7+ Yrs Exp',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
    githubUrl: 'https://github.com/brainforge26',
    linkedinUrl: 'https://linkedin.com/company/brainforge26',
    email: 'david@brainforge26.tech',
  },
];

interface TeamSectionProps {
  teamMembers?: TeamMember[];
}

export function TeamSection({ teamMembers = [] }: TeamSectionProps) {
  const displayTeam = Array.isArray(teamMembers) && teamMembers.length > 0 ? teamMembers : DEFAULT_TEAM;

  return (
    <section id="team" className="py-24 relative overflow-hidden bg-[#060910]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Engineering Talent
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Engineering Experts</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Our company team consists of elite software architects, AI researchers, and full-stack engineers crafting high-performance systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayTeam.map((member, i) => (
            <motion.div
              key={member.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
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
          <Link href="/team" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-sm font-bold text-white transition-all shadow-lg hover:scale-105">
            View All Team Profiles <ExternalLink className="w-4 h-4 text-orange-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
