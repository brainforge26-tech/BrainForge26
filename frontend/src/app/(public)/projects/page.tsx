import { fetchPublicProjects } from '@/features/homepage/homepage.actions';
import { PROJECTS_DATA, ProjectItem } from '@/data/projectsData';
import { ProjectsListingClient } from './ProjectsListingClient';

export default async function ProjectsPage() {
  const dbProjects = await fetchPublicProjects();

  const dynamicProjects: ProjectItem[] = dbProjects.map((p: any) => {
    const coverImage = p.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80';
    const galleryImages = p.gallery && p.gallery.length > 0
      ? p.gallery.map((g: any) => g.url)
      : [coverImage];

    return {
      id: p.id,
      title: p.name,
      category: p.projectType || 'Web Application',
      client: p.client?.companyName || 'Enterprise Client',
      timeline: p.estimatedDelivery ? new Date(p.estimatedDelivery).getFullYear().toString() : '2026',
      status: p.status === 'COMPLETED' ? 'Completed' : 'Active',
      coverImage,
      tech: p.technologies && p.technologies.length > 0 ? p.technologies : ['Next.js', 'TypeScript', 'Node.js'],
      description: p.description || 'Custom high-performance web application built with modern architecture.',
      images: galleryImages,
      fullDetails: {
        summary: p.description || 'Comprehensive software solution engineered with fullstack architecture.',
        architecture: 'Microservices with Next.js frontend, Node.js backend, and PostgreSQL database.',
        keyFeatures: [
          'Real-time data synchronization',
          'Role-based access control (RBAC)',
          'High throughput database optimization',
          'Automated CI/CD deployment pipelines',
        ],
        results: [
          { label: 'Uptime', value: '99.9%' },
          { label: 'Latency', value: '< 200ms' },
          { label: 'Satisfaction', value: '100%' },
        ],
        clientTestimonial: {
          quote: 'BrainForceIT delivered an exceptional platform meeting all our technical specifications on schedule.',
          author: p.client?.contactPerson || 'Client Lead',
          role: p.client?.companyName || 'Enterprise Partner',
        },
      },
    };
  });

  // Combine dynamic DB projects with default showcase projects
  const allProjects = [...dynamicProjects, ...PROJECTS_DATA];

  return <ProjectsListingClient initialProjects={allProjects} />;
}
