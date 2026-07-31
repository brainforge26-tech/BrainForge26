import { fetchPublicProjects } from '@/features/homepage/homepage.actions';
import type { ProjectItem } from '@/data/projectsData';
import { ProjectsListingClient } from './ProjectsListingClient';

export default async function ProjectsPage() {
  const dbProjects = await fetchPublicProjects();

  const dynamicProjects: ProjectItem[] = (Array.isArray(dbProjects) ? dbProjects : []).map((p: any) => {
    const coverImage = p.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80';
    const galleryImages = p.gallery && p.gallery.length > 0
      ? p.gallery.map((g: any) => g.url)
      : [coverImage];

    return {
      id: p.id,
      title: p.name,
      category: (p.projectType as any) || 'Web Apps',
      type: p.projectType || 'Web Application',
      client: p.client?.companyName || 'Enterprise Client',
      timeline: p.estimatedDelivery ? new Date(p.estimatedDelivery).getFullYear().toString() : '2026',
      status: p.status === 'COMPLETED' ? 'Completed' : 'Active',
      coverImage,
      tech: p.technologies && p.technologies.length > 0 ? p.technologies : ['Next.js', 'TypeScript', 'Node.js'],
      description: p.description || 'Custom high-performance web application built with modern architecture.',
      fullDescription: p.description || 'Custom high-performance web application built with modern architecture.',
      role: 'Fullstack Engineering Lead',
      features: [
        'Real-time data synchronization',
        'Role-based access control (RBAC)',
        'High throughput database optimization',
        'Automated CI/CD deployment pipelines',
      ],
      challenge: 'Building high-performance, scalable web architecture.',
      solution: 'Implemented microservices stack with server-side caching.',
      impact: 'Achieved 99.9% uptime with fast response times.',
      color: '#C02C54',
      images: galleryImages,
    };
  });

  return <ProjectsListingClient initialProjects={dynamicProjects} />;
}
