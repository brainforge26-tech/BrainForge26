'use client';

import { useState, useActionState, useEffect, useTransition } from 'react';
import { Plus, Trash2, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }      from '@/components/ui/Badge';
import { createPricingAction, deletePricingAction } from '@/features/manager/manager.actions';
import type { ActionState } from '@/features/manager/manager.actions';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

const SAMPLE_PLANS = [
  { id: '1', name: 'Starter',      price: '2500', billingCycle: 'one-time', isPopular: false, features: ['Up to 5 pages','Responsive design','30-day support'] },
  { id: '2', name: 'Professional', price: '7500', billingCycle: 'one-time', isPopular: true,  features: ['Custom web app','Auth & roles','REST API','90-day support'] },
  { id: '3', name: 'Enterprise',   price: 'Custom', billingCycle: '',       isPopular: false, features: ['Everything in Professional','Dedicated team','SLA guarantee'] },
];

export default function ManagerPricingPage() {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createPricingAction, initial);
  const [isPending, startT] = useTransition();

  useEffect(() => {
    if (state.success) { toast.success(state.message); setShowForm(false); }
  }, [state.success, state]);

  function handleDelete(id: string) {
    startT(async () => {
      const r = await deletePricingAction(id);
      if (r.success) toast.success(r.message); else toast.error(r.error);
    });
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Pricing Plans" description="Manage pricing displayed on the homepage."
        action={
          <button onClick={() => setShowForm(v => !v)}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-full">
            <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Plan'}
          </button>
        }
      />

      {/* Create form */}
      {showForm && (
        <Card variant="accent" padding="lg">
          <CardHeader><CardTitle>New Pricing Plan</CardTitle></CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Plan Name *</label>
                  <input name="name" required placeholder="Professional" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Price (USD) *</label>
                  <input name="price" type="number" min="0" required placeholder="7500" className="input-field" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Billing Cycle</label>
                  <select name="billingCycle" className="input-field">
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Description</label>
                  <input name="description" placeholder="Short description" className="input-field" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Features <span className="text-[#7A8499] text-xs">(one per line)</span></label>
                <textarea name="features" rows={4} placeholder={"Custom web app\nAuth & roles\nREST API backend"} className="input-field resize-none py-3" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="isPopular" type="checkbox" value="true" className="w-4 h-4 accent-[#4F7DFF]" />
                  <span className="text-sm text-[#AAB3C5]">Mark as Most Popular</span>
                </label>
              </div>
              {'error' in state && state.error && (
                <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{state.error}</p>
              )}
              <button type="submit" disabled={pending} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
                {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Plan'}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {SAMPLE_PLANS.map(plan => (
          <Card key={plan.id} variant={plan.isPopular ? 'accent' : 'default'} padding="md" className="relative flex flex-col gap-4">
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#4F7DFF] text-white text-xs font-bold">
                  <Star className="w-3 h-3" /> Popular
                </span>
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-bold text-white">{plan.name}</p>
                <p className="text-2xl font-extrabold mt-1">
                  {plan.price === 'Custom' ? <span className="text-white">Custom</span> : <><span className="text-sm text-[#AAB3C5]">$</span><span className="text-white">{Number(plan.price).toLocaleString()}</span></>}
                </p>
                {plan.billingCycle && <p className="text-xs text-[#7A8499]">/{plan.billingCycle}</p>}
              </div>
              <button onClick={() => handleDelete(plan.id)} disabled={isPending}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#AAB3C5]">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7DFF] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Badge variant="muted" size="sm">Synced to homepage</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
