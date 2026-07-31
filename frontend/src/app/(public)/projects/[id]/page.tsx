import { notFound } from 'next/navigation';
import { fetchPublicProjects } from '@/features/homepage/homepage.actions';
import type { ProjectItem } from '@/data/projectsData';
import { ProjectDetailsClient } from './ProjectDetailsClient';

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const dbProjects = await fetchPublicProjects();

  const foundDbProject = (Array.isArray(dbProjects) ? dbProjects : []).find((p: any) => p.id === id);

  if (!foundDbProject) {
    notFound();
  }

  const coverImage = foundDbProject.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80';
  const galleryImages = foundDbProject.gallery && foundDbProject.gallery.length > 0
    ? foundDbProject.gallery.map((g: any) => g.url)
    : [coverImage];

  const project: ProjectItem = {
    id: foundDbProject.id,
    title: foundDbProject.name,
    category: (foundDbProject.projectType as any) || 'Web Apps',
    type: foundDbProject.projectType || 'Web Application',
    client: foundDbProject.client?.companyName || 'Enterprise Client',
    timeline: foundDbProject.estimatedDelivery ? new Date(foundDbProject.estimatedDelivery).getFullYear().toString() : '2026',
    status: foundDbProject.status === 'COMPLETED' ? 'Completed' : 'Active',
    coverImage,
    tech: foundDbProject.technologies && foundDbProject.technologies.length > 0 ? foundDbProject.technologies : ['Next.js', 'TypeScript', 'Node.js'],
    description: foundDbProject.description || 'Custom web application engineered with modern fullstack architecture.',
    images: galleryImages,
    fullDescription: foundDbProject.description || 'Custom web application engineered with modern fullstack architecture.',
    challenge: 'Building high-performance, scalable web architecture with sub-second response times.',
    solution: 'Implemented microservices stack with server-side caching and optimized database queries.',
    impact: 'Achieved 99.9% uptime with 3x faster response times.',
    features: [
      'Real-time data synchronization & live updates',
      'Role-based security & OAuth authentication',
      'Responsive glassmorphism UI system',
      'High-concurrency microservices architecture',
    ],
    role: 'Fullstack Engineering & Design Lead',
    color: '#C02C54',
  };

  return <ProjectDetailsClient project={project} />;
}
