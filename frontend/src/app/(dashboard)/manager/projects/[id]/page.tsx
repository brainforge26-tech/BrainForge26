import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { fetchProjectById, fetchProjectFiles, fetchProgressUpdates } from '@/features/manager/manager.actions';
import { ManagerProjectDetail } from '@/features/manager/components/ManagerProjectDetail';

type PageProps = { params: Promise<{ id: string }> };

export default async function ManagerProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) notFound();

  const files = await fetchProjectFiles(id);
  const updates = await fetchProgressUpdates(id);

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader 
        title={project.name} 
        description={`Project ID: ${project.id}`} 
      />
      <ManagerProjectDetail project={project} files={files} updates={updates} />
    </div>
  );
}
