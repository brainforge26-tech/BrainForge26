import { fetchMyMessages } from '@/features/client/client.actions';
import { MessagesClient } from './MessagesClient';

export default async function ClientMessagesPage() {
  const initialMessages = await fetchMyMessages();
  return <MessagesClient initialMessages={initialMessages} />;
}
