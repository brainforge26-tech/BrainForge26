import { CreditCard, Download, CheckCircle2, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { StatCard }   from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

const STATUS_VARIANT: Record<PaymentStatus, 'success' | 'warning' | 'error'> = {
  PAID: 'success', PENDING: 'warning', OVERDUE: 'error',
};
const STATUS_ICON: Record<PaymentStatus, React.ElementType> = {
  PAID: CheckCircle2, PENDING: Clock, OVERDUE: AlertCircle,
};

const SAMPLE_PAYMENTS = [
  { id: '1', invoiceNumber: 'INV-041', amount: '4500', currency: 'USD', status: 'PAID'    as PaymentStatus, method: 'Bank Transfer', paidAt: '2026-07-01', dueDate: '2026-07-01', description: 'Project kickoff payment — 50%', project: { name: 'E-Commerce Platform' } },
  { id: '2', invoiceNumber: 'INV-042', amount: '3200', currency: 'USD', status: 'PENDING' as PaymentStatus, method: null,            paidAt: null,          dueDate: '2026-08-01', description: 'Milestone 2 — Frontend complete', project: { name: 'E-Commerce Platform' } },
  { id: '3', invoiceNumber: 'INV-043', amount: '2800', currency: 'USD', status: 'OVERDUE' as PaymentStatus, method: null,            paidAt: null,          dueDate: '2026-06-15', description: 'Mobile App deposit', project: { name: 'Mobile App v2' } },
  { id: '4', invoiceNumber: 'INV-040', amount: '8500', currency: 'USD', status: 'PAID'    as PaymentStatus, method: 'Credit Card',   paidAt: '2026-06-01', dueDate: '2026-06-01', description: 'Full project payment', project: { name: 'Landing Page' } },
];

const totalPaid    = SAMPLE_PAYMENTS.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0);
const totalPending = SAMPLE_PAYMENTS.filter(p => p.status === 'PENDING').reduce((s, p) => s + Number(p.amount), 0);
const totalOverdue = SAMPLE_PAYMENTS.filter(p => p.status === 'OVERDUE').reduce((s, p) => s + Number(p.amount), 0);

export default function ClientInvoicesPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Invoices & Payments" description="View your payment history and outstanding invoices." />

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard title="Total Paid"    value={`$${totalPaid.toLocaleString()}`}    icon={CheckCircle2} iconColor="#22C55E" />
        <StatCard title="Pending"       value={`$${totalPending.toLocaleString()}`} icon={Clock}        iconColor="#F59E0B" />
        <StatCard title="Overdue"       value={`$${totalOverdue.toLocaleString()}`} icon={AlertCircle}  iconColor="#EF4444" />
      </div>

      {/* Invoices table */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#7C5CFF]" />
            <CardTitle>All Invoices</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Method</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_PAYMENTS.map(pay => {
                const Icon = STATUS_ICON[pay.status];
                return (
                  <tr key={pay.id}>
                    <td>
                      <div>
                        <p className="text-sm font-semibold text-white">{pay.invoiceNumber}</p>
                        <p className="text-xs text-[#7A8499]">{pay.description}</p>
                      </div>
                    </td>
                    <td><span className="text-sm text-[#AAB3C5]">{pay.project.name}</span></td>
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
                    <td>
                      <Badge variant={STATUS_VARIANT[pay.status]} size="sm">
                        <span className="flex items-center gap-1">
                          <Icon className="w-3 h-3" /> {pay.status}
                        </span>
                      </Badge>
                    </td>
                    <td><span className="text-sm text-[#7A8499]">{pay.method ?? '—'}</span></td>
                    <td>
                      <button className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
