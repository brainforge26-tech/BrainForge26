'use client';

import { useState, useTransition } from 'react';
import { Search, MoreVertical, UserX, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import { Badge }    from '@/components/ui/Badge';
import { Avatar }   from '@/components/ui/Avatar';
import { Spinner }  from '@/components/ui/Spinner';
import { deactivateManagerAction, deleteManagerAction } from './admin.actions';
import type { Manager } from './admin.actions';
import { toast } from 'sonner';

interface Props {
  initialData: {
    managers: Manager[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  };
}

export function ManagersTable({ initialData }: Props) {
  const [search, setSearch]       = useState('');
  const [managers]                = useState<Manager[]>(initialData.managers);
  const [activeMenu, setMenu]     = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = managers.filter(m => {
    const q = search.toLowerCase();
    const name = `${m.managerProfile?.firstName ?? ''} ${m.managerProfile?.lastName ?? ''}`.toLowerCase();
    return !q || name.includes(q) || m.email.toLowerCase().includes(q);
  });

  function handleDeactivate(id: string) {
    setMenu(null);
    startTransition(async () => {
      const r = await deactivateManagerAction(id);
      if (r.success) toast.success(r.message);
      else toast.error(r.error);
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this manager? This cannot be undone.')) return;
    setMenu(null);
    startTransition(async () => {
      const r = await deleteManagerAction(id);
      if (r.success) toast.success(r.message);
      else toast.error(r.error);
    });
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-10 h-10 text-sm"
          />
        </div>
        <span className="text-sm text-[#7A8499]">{initialData.pagination.total} total</span>
        {isPending && <Spinner size="sm" />}
      </div>

      {/* Table */}
      <div className="rounded-[20px] border border-white/[0.08] overflow-hidden bg-white/[0.02]">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Manager</th>
              <th>Department</th>
              <th>Projects</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7A8499]">
                  {search ? 'No managers match your search.' : 'No managers yet. Add one above.'}
                </td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={`${m.managerProfile?.firstName ?? ''} ${m.managerProfile?.lastName ?? ''}`} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {m.managerProfile?.firstName} {m.managerProfile?.lastName}
                        </p>
                        <p className="text-xs text-[#7A8499]">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-[#AAB3C5]">
                      {m.managerProfile?.department ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-white">—</span>
                  </td>
                  <td>
                    <Badge variant={m.isActive ? 'success' : 'muted'} size="sm" dot>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <span className="text-xs text-[#7A8499]">
                      {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td>
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setMenu(activeMenu === m.id ? null : m.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenu === m.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 z-20 bg-[#0B1224] border border-white/[0.10] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
                            <a href={`/admin/managers/${m.id}/edit`}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#AAB3C5] hover:text-white hover:bg-white/[0.05] transition-all">
                              <Pencil className="w-4 h-4" /> Edit
                            </a>
                            {m.isActive && (
                              <button onClick={() => handleDeactivate(m.id)}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#F59E0B] hover:bg-[rgba(245,158,11,0.06)] transition-all">
                                <UserX className="w-4 h-4" /> Deactivate
                              </button>
                            )}
                            {!m.isActive && (
                              <button
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#22C55E] hover:bg-[rgba(34,197,94,0.06)] transition-all"
                                onClick={() => { setMenu(null); toast.info('Reactivate via edit page'); }}>
                                <CheckCircle2 className="w-4 h-4" /> Reactivate
                              </button>
                            )}
                            <div className="border-t border-white/[0.06] mx-2 my-1" />
                            <button onClick={() => handleDelete(m.id)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.06)] transition-all">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      {initialData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#7A8499] px-1">
          <span>
            Page {initialData.pagination.page} of {initialData.pagination.totalPages}
          </span>
          <span>{initialData.pagination.total} managers</span>
        </div>
      )}
    </div>
  );
}
