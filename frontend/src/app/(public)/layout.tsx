import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SocialSidebar } from '@/components/layout/SocialSidebar';
import { getSession } from '@/lib/session';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <Navbar user={session.user} />
      <SocialSidebar />
      <main className="flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
