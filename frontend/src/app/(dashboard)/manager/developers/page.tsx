import { Code2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Avatar }     from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';

const PLACEHOLDER_DEVS = [
  { name: 'Alex Carter',   title: 'Full-Stack Lead',      skills: ['Next.js','Node.js','PostgreSQL'], available: true,  exp: 7 },
  { name: 'Sara Kim',      title: 'Frontend Developer',   skills: ['React','Tailwind','Figma'],       available: true,  exp: 5 },
  { name: 'James Okafor',  title: 'Backend Engineer',     skills: ['Express','AWS','Docker'],         available: false, exp: 6 },
  { name: 'Priya Mehta',   title: 'Mobile Developer',     skills: ['React Native','Flutter'],         available: true,  exp: 4 },
];

export default function ManagerDevelopersPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Developers"
        description="Manage your development team."
        action={
          <a href="/manager/hiring" className="btn-secondary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-full">
            <Code2 className="w-4 h-4" /> Hire Developer
          </a>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {PLACEHOLDER_DEVS.map((dev) => (
          <Card key={dev.name} variant="default" padding="md" className="flex flex-col gap-4 group hover:border-[rgba(79,125,255,0.2)] transition-all">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar name={dev.name} size="lg" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#050816] ${dev.available ? 'bg-[#22C55E]' : 'bg-[#7A8499]'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{dev.name}</p>
                <p className="text-xs text-[#7A8499] mt-0.5">{dev.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {dev.available
                    ? <Badge variant="success" size="sm" dot>Available</Badge>
                    : <Badge variant="muted"   size="sm" dot>On Project</Badge>}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#7A8499] opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0 cursor-pointer hover:text-white" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-xs text-[#7A8499]">Experience</p>
                <p className="text-sm font-bold text-white mt-0.5">{dev.exp} yrs</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-xs text-[#7A8499]">Availability</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  {dev.available
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    : <XCircle      className="w-3.5 h-3.5 text-[#7A8499]" />}
                  <span className="text-xs font-semibold" style={{ color: dev.available ? '#22C55E' : '#7A8499' }}>
                    {dev.available ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {dev.skills.map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.05] border border-white/[0.08] text-[#AAB3C5]">{s}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
