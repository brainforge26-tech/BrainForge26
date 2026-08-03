import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SocialSidebar } from '@/components/layout/SocialSidebar';
import { MouseCursor } from '@/components/ui/MouseCursor';
import { ThreeBackground } from '@/components/ui/ThreeBackground';
import { getSession } from '@/lib/session';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <MouseCursor />
      <ThreeBackground />
      <Navbar user={session.user} />
      <SocialSidebar />
      <main className="flex flex-col relative z-10">{children}</main>
      <Footer />
    </>
  );
}
