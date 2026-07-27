'use client';

import { useActionState, useEffect, useState } from 'react';
import {
  Building2, User, Phone, Globe, MapPin, FileText,
  Edit3, Loader2, CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { updateClientProfileAction } from '@/features/client/client.actions';
import type { ActionState, ClientProfile } from '@/features/client/client.actions';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function ClientProfileForm({ profile }: { profile: ClientProfile }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateClientProfileAction, initial);

  useEffect(() => {
    if (state.success) { 
      toast.success(state.message); 
      setEditing(false); 
    }
  }, [state.success, state]);

  return (
    <div className="animate-fade-up max-w-2xl space-y-6">
      <PageHeader title="My Profile" description="Manage your company information." />

      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={profile.companyName} size="xl" />
              <div>
                <h2 className="text-xl font-bold text-white">{profile.companyName}</h2>
                <p className="text-sm text-[#7A8499] mt-0.5">{profile.contactPerson}</p>
                <p className="text-xs text-[#7A8499] mt-1">
                  Member since {new Date(profile.user.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}
                </p>
              </div>
            </div>
            <button onClick={() => setEditing(v => !v)}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full shrink-0">
              <Edit3 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {!editing ? (
            <div className="space-y-4 mt-4">
              {[
                { icon: User,      label: 'Contact Person', value: profile.contactPerson },
                { icon: Building2, label: 'Company',        value: profile.companyName  },
                { icon: Phone,     label: 'Phone',          value: profile.phone        },
                { icon: Globe,     label: 'Website',        value: profile.website      },
                { icon: MapPin,    label: 'Address',        value: profile.address      },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Icon className="w-4 h-4 text-[#4F7DFF] shrink-0" />
                  <div>
                    <p className="text-xs text-[#7A8499]">{label}</p>
                    <p className="text-sm text-white">{value || '—'}</p>
                  </div>
                </div>
              ))}
              {profile.companyDescription && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#4F7DFF]" />
                    <p className="text-xs text-[#7A8499]">Company Description</p>
                  </div>
                  <p className="text-sm text-[#AAB3C5] leading-relaxed">{profile.companyDescription}</p>
                </div>
              )}
            </div>
          ) : (
            <form action={formAction} className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Company Name</label>
                  <input name="companyName" defaultValue={profile.companyName} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Contact Person</label>
                  <input name="contactPerson" defaultValue={profile.contactPerson} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Phone</label>
                  <input name="phone" type="tel" defaultValue={profile.phone ?? ''} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#AAB3C5]">Website</label>
                  <input name="website" type="url" defaultValue={profile.website ?? ''} className="input-field" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Address</label>
                <input name="address" defaultValue={profile.address ?? ''} className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Company Description</label>
                <textarea name="companyDescription" rows={3} defaultValue={profile.companyDescription ?? ''}
                  className="input-field resize-none py-3" />
              </div>

              {'error' in state && state.error && (
                <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
                  {state.error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={pending}
                  className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
                  {pending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="btn-secondary px-5 py-2.5 rounded-full text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
