import Metadata from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicFetch } from '@/lib/api';
import { ArrowLeft, CheckCircle2, ChevronRight, Layers, ShieldCheck, Sparkles, Zap, Globe, Cpu, Smartphone } from 'lucide-react';

interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  features: string[];
  technologies?: string[];
  process?: { step: number; title: string; desc: string }[];
  faqs?: { question: string; answer: string }[];
}

function getIconComponent(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case 'smartphone':
      return <Smartphone className="w-8 h-8 text-cyan-400" />;
    case 'cpu':
      return <Cpu className="w-8 h-8 text-indigo-400" />;
    case 'shieldcheck':
      return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
    default:
      return <Globe className="w-8 h-8 text-blue-400" />;
  }
}

async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  try {
    const res = await publicFetch<{ data: any }>('/services/public');
    const services = Array.isArray(res?.data) ? res.data : [];
    
    // Find service matching slug or title slug or ID
    const found = services.find(
      (s: any) =>
        s.id === slug ||
        s.slug === slug ||
        s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
        slug.includes(s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    );

    if (found) {
      return {
        id: found.id,
        slug: found.slug || found.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: found.title,
        subtitle: `Enterprise ${found.title} Solutions`,
        description: found.overview || `${found.title} engineered with Next.js, Node.js, and modern cloud architectures.`,
        icon: found.icon,
        features: found.features && found.features.length > 0 ? found.features : [
          'High Performance & SEO Optimized Architecture',
          'Scalable Microservices & RESTful API Infrastructure',
          'Zero-Downtime CI/CD Deployment Integration',
          '24/7 Security Assurance & Maintenance Support',
        ],
        technologies: found.technologies && found.technologies.length > 0 ? found.technologies : ['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'PostgreSQL'],
        process: [
          { step: 1, title: 'Discovery & Architecture Design', desc: 'Requirements analysis, API schema modeling, and UI wireframing.' },
          { step: 2, title: 'Agile Full-Stack Development', desc: 'Modular coding with Server Components, automated testing, and code audits.' },
          { step: 3, title: 'Staging & QA Security Audit', desc: 'End-to-end testing, performance benchmarking, and vulnerability checks.' },
          { step: 4, title: 'Production Deployment & Monitoring', desc: 'Zero-downtime PM2 reload, SSL cert installation, and 24/7 monitoring.' },
        ],
        faqs: Array.isArray(found.faq) && found.faq.length > 0 ? found.faq : [
          { question: 'What is the estimated delivery timeline?', answer: 'Typical projects range between 2 to 6 weeks depending on custom feature scope.' },
          { question: 'Do you provide post-launch maintenance support?', answer: 'Yes, every tier includes dedicated SLA monitoring, bug fixes, and infrastructure optimization.' },
        ],
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    return { title: 'Service Not Found | BrainForge26' };
  }

  return {
    title: `${service.title} | BrainForge26 Technology Studio`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href="/services" className="hover:text-cyan-400 transition-colors">Services</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-cyan-400 font-medium">{service.title}</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1224] via-[#090D16] to-[#0B1224] p-8 md:p-12 border border-white/[0.08] shadow-2xl mb-12 overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/30">
              {getIconComponent(service.icon)}
            </div>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
              Enterprise Service
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {service.title}
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg transition-all"
            >
              Request a Consultation
              <Sparkles className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0B1224] rounded-2xl p-8 border border-white/[0.08]">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Key Deliverables & Capabilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0B1224] rounded-2xl p-8 border border-white/[0.08]">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Engineering Execution Roadmap
              </h2>
              <div className="space-y-6">
                {service.process?.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-cyan-400 flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0B1224] rounded-2xl p-6 border border-white/[0.08]">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Technologies Supported
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-cyan-300 border border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-bold text-white mb-2">Ready to Build?</h3>
              <p className="text-sm text-slate-300 mb-6">
                Consult with our engineering team to architect your next digital platform.
              </p>
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:brightness-110 transition-all"
              >
                Schedule Architecture Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
