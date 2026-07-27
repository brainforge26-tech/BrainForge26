import { PROJECTS_DATA, ProjectItem } from '@/data/projectsData';
import { fetchPublicProjects } from '@/features/homepage/homepage.actions';
import { ProjectDetailsClient } from './ProjectDetailsClient';

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const dbProjects = await fetchPublicProjects();

  const foundDbProject = dbProjects.find((p: any) => p.id === id);

  let project: ProjectItem;

  if (foundDbProject) {
    const coverImage = foundDbProject.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80';
    const galleryImages = foundDbProject.gallery && foundDbProject.gallery.length > 0
      ? foundDbProject.gallery.map((g: any) => g.url)
      : [coverImage];

    project = {
      id: foundDbProject.id,
      title: foundDbProject.name,
      category: foundDbProject.projectType || 'Web Application',
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
    };
  } else {
    project = PROJECTS_DATA.find((p) => p.id === id) || PROJECTS_DATA[0];
  }

  return <ProjectDetailsClient project={project} />;
}
