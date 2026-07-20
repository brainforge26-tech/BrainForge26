import { Suspense } from 'react';
import { Users, Building2, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Avatar }     from '@/components/ui/Avatar';
import { Spinner }    from '@/components/ui/Spinner';
import { Card, CardContent } from '@/components/ui/Card';

// Minimal server-side client list — full data via API in real usage
async function ClientsData() {
  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <Users className="w-4 h-4 text-[#7C5CFF]" />
        <span className="text-sm font-semibold text-white">All Clients</span>
        <span className="ml-auto text-xs text-[#7A8499]">API data loads when backend is running</span>
      </div>
      <CardContent className="p-0">
        {/* Placeholder rows — replace with real data from fetchClients() */}
        {['Acme Corp', 'TechStart Inc', 'BlueSky Ltd', 'DataFlow Co'].map((name, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-center gap-3">
              <Avatar name={name} size="md" />
              <div>
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-[#7A8499] flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3" />
                  {['John Smith','Alice Chen','Bob Johnson','Maria Garcia'][i]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={i % 3 === 2 ? 'muted' : 'success'} size="sm" dot>
                {i % 3 === 2 ? 'Inactive' : 'Active'}
              </Badge>
              <span className="text-xs text-[#7A8499]">{[2, 1, 4, 3][i]} project{[2,1,4,3][i] !== 1 ? 's' : ''}</span>
              <ExternalLink className="w-4 h-4 text-[#7A8499] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ManagerClientsPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Clients"
        description="View and manage your assigned clients."
      />
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
        <ClientsData />
      </Suspense>
    </div>
  );
}
