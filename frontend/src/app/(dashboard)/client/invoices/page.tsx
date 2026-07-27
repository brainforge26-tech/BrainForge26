import {
  CreditCard, Download, CheckCircle2, Clock, AlertCircle, DollarSign, ArrowUpRight
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { StatCard }   from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { fetchMyPayments } from '@/features/client/client.actions';

const PAYMENT_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'muted'> = {
  PAID: 'success', PENDING: 'warning', OVERDUE: 'error', CANCELLED: 'muted', REFUNDED: 'muted',
};

export default async function ClientInvoicesPage() {
  const payments = await fetchMyPayments();

  const totalPaid    = payments.filter((p: any) => p.status === 'PAID').reduce((s: number, p: any) => s + Number(p.amount), 0);
  const totalPending = payments.filter((p: any) => p.status === 'PENDING').reduce((s: number, p: any) => s + Number(p.amount), 0);
  const totalOverdue = payments.filter((p: any) => p.status === 'OVERDUE').reduce((s: number, p: any) => s + Number(p.amount), 0);

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Invoices" description="Download invoices for your project payments." />

      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard title="Total Paid"  value={`$${totalPaid.toLocaleString()}`}    icon={CheckCircle2} iconColor="#22C55E" />
        <StatCard title="Pending"     value={`$${totalPending.toLocaleString()}`} icon={Clock}        iconColor="#F59E0B" />
        <StatCard title="Overdue"     value={`$${totalOverdue.toLocaleString()}`} icon={AlertCircle}  iconColor="#EF4444" />
      </div>

      <Card variant="default" padding="none" className="overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#7C5CFF]" />
            <CardTitle>All Invoices</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Invoice</th><th>Project</th><th>Amount</th>
                  <th>Due</th><th>Status</th><th>Method</th><th></th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#7A8499]">No invoices found.</td>
                  </tr>
                )}
                {payments.map((pay: any) => (
                  <tr key={pay.id}>
                    <td>
                      <p className="text-sm font-semibold text-white">{pay.invoiceNumber}</p>
                      <p className="text-xs text-[#7A8499]">{pay.description}</p>
                    </td>
                    <td><span className="text-sm text-[#AAB3C5]">{pay.project?.name || 'N/A'}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#7A8499]" />
                        <span className="text-sm font-bold text-white">{Number(pay.amount).toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-[#AAB3C5]">
                        {pay.dueDate ? new Date(pay.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                      </span>
                    </td>
                    <td><Badge variant={PAYMENT_VARIANT[pay.status] || 'muted'} size="sm" dot>{pay.status}</Badge></td>
                    <td><span className="text-sm text-[#7A8499]">{pay.method ?? '—'}</span></td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {pay.invoiceUrl && (
                          <a href={pay.invoiceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors p-2">
                            <Download className="w-3.5 h-3.5" /> PDF
                          </a>
                        )}
                        {(pay.status === 'PENDING' || pay.status === 'OVERDUE') && (
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F7DFF]/10 text-[#4F7DFF] hover:bg-[#4F7DFF]/20 transition-colors text-xs font-semibold">
                            Pay Now <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
