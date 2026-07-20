import { Suspense }       from 'react';
import { Plus }           from 'lucide-react';
import Link               from 'next/link';
import { PageHeader }     from '@/components/dashboard/PageHeader';
import { ProjectsGrid }   from '@/features/manager/ProjectsGrid';
import { Spinner }        from '@/components/ui/Spinner';
import { fetchProjects }  from '@/features/manager/manager.actions';

async function ProjectsData() {
  const data = await fetchProjects(1).catch(() => ({ projects: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }));
  return <ProjectsGrid initialData={data} />;
}

export default function ManagerProjectsPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all your client projects."
        action={
          <Link href="/manager/projects/new"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-full">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        }
      />
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
        <ProjectsData />
      </Suspense>
    </div>
  );
}
