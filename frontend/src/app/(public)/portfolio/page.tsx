import { fetchPublicProjects } from '@/features/homepage/homepage.actions';
import { ExternalLink, Award, CheckCircle2, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Portfolio & Case Studies | BrainForge26',
  description: 'Explore our portfolio of enterprise software platforms, AI applications, and mobile products.',
};

export default async function PortfolioPage() {
  const projects = await fetchPublicProjects().catch(() => []);

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Client Success Stories
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Portfolio & Case Studies</span>
          </h1>
          <p className="mt-4 text-slate-300 text-lg leading-relaxed">
            Real-world enterprise solutions engineered with precision, reliability, and measurable business impact.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16">
          {projects.map((project: any, i: number) => (
            <div
              key={project.id}
              className={`rounded-3xl bg-[#0B1224] border border-white/[0.08] p-8 lg:p-12 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-2xl ${
                i % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                {project.industry && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider mb-4 inline-block">
                    {project.industry}
                  </span>
                )}
                <h3 className="text-3xl font-extrabold text-white mb-4">{project.title}</h3>
                <p className="text-slate-300 text-base leading-relaxed mb-6">{project.description}</p>
                {project.overview && (
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 italic">{project.overview}</p>
                )}

                {project.results && project.results.length > 0 && (
                  <div className="mb-6 bg-orange-950/20 border border-orange-500/20 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Key Impact & Results</p>
                    {project.results.map((res: string) => (
                      <div key={res} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string) => (
                        <span key={tech} className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-sm transition-all shadow-lg hover:scale-105"
                  >
                    Visit Live Application <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className={`relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl h-80 lg:h-96 ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-950 to-slate-950 flex items-center justify-center">
                    <Award className="w-16 h-16 text-orange-400/40" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
