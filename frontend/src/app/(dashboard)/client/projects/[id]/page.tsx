import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { fetchProjectById } from '@/features/client/client.actions';
import { ClientProjectDetail } from '@/features/client/components/ClientProjectDetail';

type PageProps = { params: Promise<{ id: string }> };

export default async function ClientProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) notFound();

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader 
        title={project.name} 
        description={`Project Type: ${project.projectType}`} 
      />
      <ClientProjectDetail project={project} />
    </div>
  );
}
