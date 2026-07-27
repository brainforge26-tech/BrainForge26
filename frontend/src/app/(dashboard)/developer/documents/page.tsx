import { fetchMyProfile } from '@/features/developer/developer.actions';
import { DeveloperDocumentsClient } from './DeveloperDocumentsClient';

export default async function DeveloperDocumentsPage() {
  const profile = await fetchMyProfile();

  if (!profile) {
    return (
      <div className="p-8 text-center text-[#7A8499]">
        Could not load your profile. Please try logging in again.
      </div>
    );
  }

  return <DeveloperDocumentsClient resumeUrl={profile.resumeUrl || ''} />;
}
