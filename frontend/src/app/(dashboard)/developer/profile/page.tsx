import { fetchMyProfile } from '@/features/developer/developer.actions';
import { DeveloperProfileClient } from './DeveloperProfileClient';
import { redirect } from 'next/navigation';

export default async function DeveloperProfilePage() {
  const profile = await fetchMyProfile();

  if (!profile) {
    // If somehow missing profile, redirect to onboarding or show error.
    // For now we just show a message.
    return (
      <div className="p-8 text-center text-[#7A8499]">
        Could not load your profile. Please try logging in again.
      </div>
    );
  }

  return <DeveloperProfileClient initialProfile={profile} />;
}
