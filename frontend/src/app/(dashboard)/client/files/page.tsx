import {
  FileText, Download, ExternalLink, File,
  FileImage, FileCode, Archive,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { fetchMyFiles } from '@/features/client/client.actions';

type FileCategory = 'PROPOSAL' | 'CONTRACT' | 'REQUIREMENT' | 'DESIGN' | 'DELIVERABLE' | 'INVOICE' | 'OTHER';

const CATEGORY_VARIANT: Record<string, 'primary'|'secondary'|'cyan'|'warning'|'success'|'muted'> = {
  PROPOSAL:    'primary',
  CONTRACT:    'secondary',
  REQUIREMENT: 'cyan',
  DESIGN:      'warning',
  DELIVERABLE: 'success',
  INVOICE:     'muted',
  OTHER:       'muted',
};

function getIcon(mime?: string | null): React.ElementType {
  if (!mime) return FileText;
  if (mime.startsWith('image/')) return FileImage;
  if (mime.includes('pdf'))       return FileText;
  if (mime.includes('zip') || mime.includes('tar')) return Archive;
  return File;
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return '—';
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ClientFilesPage() {
  const files = await fetchMyFiles();

  const grouped = files.reduce<Record<string, typeof files>>((acc, f: any) => {
    const cat = f.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Files"
        description="Documents shared by your project manager."
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['PROPOSAL','CONTRACT','DESIGN','DELIVERABLE'] as FileCategory[]).map(cat => (
          <div key={cat} className="p-4 rounded-[20px] bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all">
            <p className="text-lg font-extrabold text-white">{(grouped[cat] ?? []).length}</p>
            <p className="text-xs text-[#7A8499] mt-0.5">{cat.charAt(0) + cat.slice(1).toLowerCase()}</p>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="p-12 text-center text-[#7A8499] border border-white/[0.06] rounded-2xl bg-white/[0.02]">
          <p>No files shared with you yet.</p>
        </div>
      )}

      {/* Files by category */}
      {Object.entries(grouped).map(([category, catFiles]) => (
        <Card key={category} variant="default" padding="none" className="overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base capitalize">{category.charAt(0) + category.slice(1).toLowerCase()}s</CardTitle>
              <Badge variant={CATEGORY_VARIANT[category] || 'muted'} size="sm">{(catFiles as any[]).length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-white/[0.04]">
            {(catFiles as any[]).map(file => {
              const Icon = getIcon(file.mimeType);
              return (
                <div key={file.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#4F7DFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-[#7A8499] mt-0.5">
                      {file.project?.name || 'N/A'} · {formatBytes(file.sizeBytes)} · {new Date(file.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={file.url}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4F7DFF] hover:bg-[rgba(79,125,255,0.08)] transition-all"
                      title="Download" download>
                      <Download className="w-4 h-4" />
                    </a>
                    <a href={file.url} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all"
                      title="Open">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
