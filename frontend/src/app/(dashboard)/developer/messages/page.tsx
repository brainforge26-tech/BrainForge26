import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquareOff } from 'lucide-react';

export default function DeveloperMessagesPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader 
        title="Messages" 
        description="Communicate with team members (Coming Soon)" 
      />

      <Card variant="default" padding="lg">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
            <MessageSquareOff className="w-8 h-8 text-[#7A8499]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Message Center is under construction</h3>
          <p className="text-sm text-[#AAB3C5] max-w-md">
            The developer messaging functionality is currently being built. 
            Soon you will be able to discuss project details directly from this panel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
