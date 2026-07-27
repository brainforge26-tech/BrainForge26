'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { Plus, Trash2, Pencil, Loader2, Globe, Smartphone, Cpu, Palette, CheckCircle2, X } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  type SpecializedService,
  type ActionState,
} from '@/features/manager/manager.actions';
import { toast } from 'sonner';

const ICON_OPTIONS = [
  { value: 'Globe',      label: 'Website',     icon: Globe },
  { value: 'Smartphone', label: 'Mobile App',  icon: Smartphone },
  { value: 'Cpu',        label: 'AI/ML',       icon: Cpu },
  { value: 'Palette',    label: 'UI/UX Design', icon: Palette },
];

function getIcon(name: string | null) {
  const found = ICON_OPTIONS.find(o => o.value === name);
  if (!found) return Globe;
  return found.icon;
}

const initial: ActionState = { success: false, error: '' } as ActionState;

export function ServicesClient({ initialServices }: { initialServices: SpecializedService[] }) {
  const [services, setServices]       = useState(initialServices);
  const [showForm, setShowForm]       = useState(false);
  const [editTarget, setEditTarget]   = useState<SpecializedService | null>(null);
  const [isPending, startT]           = useTransition();

  const [createState, createAction, creating] = useActionState<ActionState, FormData>(createServiceAction, initial);

  // Wrap updateServiceAction to match the (prev, formData) => ActionState shape for a given id
  const boundUpdate = editTarget
    ? (_prev: ActionState, fd: FormData) => updateServiceAction(editTarget.id, _prev, fd)
    : (_prev: ActionState, _fd: FormData) => Promise.resolve({ success: false, error: 'No target' } as ActionState);

  const [updateState, updateAction, updating] = useActionState<ActionState, FormData>(boundUpdate, initial);

  useEffect(() => {
    if (createState.success) {
      toast.success((createState as { message: string }).message);
      setShowForm(false);
      window.location.reload();
    }
  }, [createState]);

  useEffect(() => {
    if (updateState.success) {
      toast.success((updateState as { message: string }).message);
      setEditTarget(null);
      window.location.reload();
    }
  }, [updateState]);

  function handleDelete(id: string) {
    startT(async () => {
      const r = await deleteServiceAction(id);
      if (r.success) {
        toast.success((r as { message: string }).message);
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        toast.error((r as { error: string }).error);
      }
    });
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Specialized Services"
        description="Manage the 'Our Specialized Services' section on the homepage."
        action={
          <button
            onClick={() => { setShowForm(v => !v); setEditTarget(null); }}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-full"
          >
            <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Service'}
          </button>
        }
      />

      {/* ── Create Form ──────────────────────────────────────────────────────── */}
      {showForm && (
        <Card variant="accent" padding="lg">
          <CardHeader><CardTitle>New Specialized Service</CardTitle></CardHeader>
          <CardContent>
            <form action={createAction} className="space-y-4">
              <ServiceFormFields />
              {'error' in createState && createState.error && (
                <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{createState.error}</p>
              )}
              <button type="submit" disabled={creating} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : 'Save Service'}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card variant="accent" padding="lg" className="w-full max-w-xl relative">
            <button onClick={() => setEditTarget(null)} className="absolute top-4 right-4 text-[#7A8499] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <CardHeader><CardTitle>Edit: {editTarget.title}</CardTitle></CardHeader>
            <CardContent>
              <form action={updateAction} className="space-y-4">
                <ServiceFormFields defaultValues={editTarget} />
                {'error' in updateState && updateState.error && (
                  <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{updateState.error}</p>
                )}
                <button type="submit" disabled={updating} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
                  {updating ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : 'Update Service'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Services Grid ─────────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {services.map(service => {
          const Icon = getIcon(service.icon);
          return (
            <Card key={service.id} variant="default" padding="md" className="flex flex-col gap-4 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(166,28,67,0.08)] border border-[rgba(166,28,67,0.18)]">
                    <Icon className="w-5 h-5 text-[#C02C54]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{service.title}</p>
                    <Badge variant={service.isActive ? 'success' : 'muted'} size="sm">
                      {service.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditTarget(service)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#AAB3C5] hover:text-white hover:bg-white/[0.08] transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={isPending}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <ul className="space-y-1.5 flex-1">
                {service.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#AAB3C5]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C02C54] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-[#7A8499] text-sm">
            No services yet. Click "Add Service" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceFormFields({ defaultValues }: { defaultValues?: SpecializedService }) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Service Title *</label>
          <input name="title" required defaultValue={defaultValues?.title} placeholder="Website" className="input-field" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Icon</label>
          <select name="icon" defaultValue={defaultValues?.icon ?? ''} className="input-field">
            <option value="">Select icon…</option>
            {[
              { value: 'Globe',      label: '🌐 Website' },
              { value: 'Smartphone', label: '📱 Mobile App' },
              { value: 'Cpu',        label: '🤖 AI/ML' },
              { value: 'Palette',    label: '🎨 UI/UX Design' },
            ].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#AAB3C5]">
          Features <span className="text-[#7A8499] text-xs">(one per line)</span>
        </label>
        <textarea
          name="features"
          rows={8}
          defaultValue={defaultValues?.features?.join('\n')}
          placeholder={"Customized Design\nSEO/GEO Optimized\nGoogle Analytics\nPerformance Optimized"}
          className="input-field resize-none py-3 font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input name="isActive" type="checkbox" value="true" defaultChecked={defaultValues?.isActive ?? true} className="w-4 h-4 accent-[#A61C43]" />
          <span className="text-sm text-[#AAB3C5]">Visible on homepage</span>
        </label>
      </div>
    </>
  );
}
