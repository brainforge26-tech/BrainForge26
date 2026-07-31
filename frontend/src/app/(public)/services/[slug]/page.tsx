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

// Map slug to icon name fallback
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
    const res = await publicFetch<{ data: any[] }>('/homepage/services');
    const services = res?.data || [];
    
    // Find service matching title slug or ID
    const found = services.find(
      (s: any) =>
        s.id === slug ||
        s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );

    if (found) {
      return {
        id: found.id,
        slug: found.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: found.title,
        subtitle: `Enterprise ${found.title} Solutions`,
        description: `${found.title} engineered with Next.js 15, Node.js, and modern cloud architectures for maximum performance, security, and scalability.`,
        icon: found.icon,
        features: found.features || [
          'High Performance & SEO Optimized Architecture',
          'Scalable Microservices & RESTful API Infrastructure',
          'Zero-Downtime CI/CD Deployment Integration',
          '24/7 Security Assurance & Maintenance Support',
        ],
        technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Docker'],
        process: [
          { step: 1, title: 'Discovery & Architecture Design', desc: 'Requirements analysis, API schema modeling, and UI wireframing.' },
          { step: 2, title: 'Agile Full-Stack Development', desc: 'Modular coding with Server Components, automated testing, and code audits.' },
          { step: 3, title: 'Staging & QA Security Audit', desc: 'End-to-end testing, performance benchmarking, and vulnerability checks.' },
          { step: 4, title: 'Production Deployment & Monitoring', desc: 'Zero-downtime PM2 reload, SSL cert installation, and 24/7 monitoring.' },
        ],
        faqs: [
          { question: 'What is the estimated delivery timeline?', answer: 'Typical projects range between 2 to 6 weeks depending on custom feature scope and third-party integrations.' },
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
    openGraph: {
      title: `${service.title} | BrainForge26`,
      description: service.description,
      type: 'article',
      url: `https://brainforge26.tech/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    provider: {
      '@type': 'Organization',
      name: 'BrainForge26',
      url: 'https://brainforge26.tech',
    },
    description: service.description,
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <span className="text-zinc-500">Services</span>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <span className="text-cyan-400 font-medium">{service.title}</span>
        </nav>

        {/* Large Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900 via-[#0D1117] to-zinc-950 p-8 md:p-12 border border-zinc-800/80 shadow-2xl mb-12 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 shadow-inner">
              {getIconComponent(service.icon)}
            </div>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 rounded-full">
              Enterprise Solution
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {service.title}
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl leading-relaxed mb-8">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-cyan-500 text-zinc-950 hover:bg-cyan-400 transition-all duration-200 shadow-lg shadow-cyan-500/20"
            >
              Request a Consultation
              <Sparkles className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-zinc-800/90 text-white hover:bg-zinc-700 border border-zinc-700 transition-all duration-200"
            >
              View Pricing Packages
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Key Features & Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900/60 rounded-2xl p-8 border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Key Deliverables & Capabilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow & Process Timeline */}
            <div className="bg-zinc-900/60 rounded-2xl p-8 border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Engineering Execution Roadmap
              </h2>
              <div className="space-y-6">
                {service.process?.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tech Stack Badges */}
            <div className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Technologies Supported
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-indigo-950/40 rounded-2xl p-6 border border-cyan-800/40">
              <h3 className="text-lg font-bold text-white mb-2">Ready to Build?</h3>
              <p className="text-sm text-zinc-300 mb-6">
                Consult with our engineering team to architect your next digital platform.
              </p>
              <Link
                href="/#contact"
                className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl bg-cyan-500 text-zinc-950 hover:bg-cyan-400 transition-colors shadow-md"
              >
                Schedule Architecture Call
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="bg-zinc-900/60 rounded-2xl p-8 border border-zinc-800 mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <h3 className="text-base font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
