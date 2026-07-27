import { notFound } from 'next/navigation';
import { fetchApplicationById } from '@/features/manager/manager.actions';
import { HiringDetailClient } from './HiringDetailClient';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HiringApplicationPage({ params }: PageProps) {
  const { id } = await params;
  const app = await fetchApplicationById(id);

  if (!app) {
    notFound();
  }

  return <HiringDetailClient app={app} />;
}
