import { PageHeader } from '@/components/dashboard/PageHeader';
import { MessageClient } from './MessageClient';
import { fetchConversations } from '@/features/manager/message.actions';
import { getSession } from '@/lib/session';
import { fetchClients } from '@/features/manager/manager.actions';

export default async function ManagerMessagesPage() {
  const session = await getSession();
  const conversations = await fetchConversations();
  const clients = await fetchClients();

  return (
    <div className="animate-fade-up space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <PageHeader 
        title="Message Center" 
        description="Communicate with clients." 
      />

      <div className="flex-1 min-h-0 bg-white/[0.02] border border-white/[0.08] rounded-[24px] overflow-hidden">
        <MessageClient initialConversations={conversations} currentUser={session?.user} clients={clients} />
      </div>
    </div>
  );
}
