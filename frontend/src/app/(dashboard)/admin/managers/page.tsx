import { Suspense } from 'react';
import { Plus }     from 'lucide-react';
import { PageHeader }    from '@/components/dashboard/PageHeader';
import { ManagersTable } from '@/features/admin/ManagersTable';
import { Spinner }       from '@/components/ui/Spinner';

export default function AdminManagersPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Managers"
        description="Create and manage project managers."
        action={
          <a href="/admin/managers/new"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-full">
            <Plus className="w-4 h-4" /> Add Manager
          </a>
        }
      />
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      }>
        <ManagersTableWrapper />
      </Suspense>
    </div>
  );
}

async function ManagersTableWrapper() {
  // Data fetched server-side — no useEffect / loading state needed in child
  const { fetchManagers } = await import('@/features/admin/admin.actions');
  const data = await fetchManagers(1).catch(() => ({ managers: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }));
  return <ManagersTable initialData={data} />;
}
