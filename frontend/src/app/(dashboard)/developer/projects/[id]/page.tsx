import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { fetchProjectById } from '@/features/developer/developer.actions';
import { ClientProjectDetail } from '@/features/client/components/ClientProjectDetail';

type PageProps = { params: Promise<{ id: string }> };

export default async function DeveloperProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) notFound();

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader 
        title={project.name} 
        description={`Project ID: ${project.id}`} 
      />
      {/* We reuse the ClientProjectDetail since it's perfectly suited for readonly access */}
      <ClientProjectDetail project={project} />
    </div>
  );
}
