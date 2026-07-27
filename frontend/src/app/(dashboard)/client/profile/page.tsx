import { fetchMyProfile } from '@/features/client/client.actions';
import { ClientProfileForm } from './ClientProfileForm';
import { PageHeader } from '@/components/dashboard/PageHeader';

export default async function ClientProfilePage() {
  const profile = await fetchMyProfile();

  if (!profile) {
    return (
      <div className="animate-fade-up max-w-2xl space-y-6">
        <PageHeader title="My Profile" description="Manage your company information." />
        <div className="p-8 text-center bg-white/[0.02] border border-white/[0.05] rounded-2xl">
          <p className="text-[#AAB3C5]">Could not load profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return <ClientProfileForm profile={profile} />;
}
