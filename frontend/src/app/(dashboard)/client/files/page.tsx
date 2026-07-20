import {
  FileText, Download, ExternalLink, File,
  FileImage, FileCode, Archive,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

type FileCategory = 'PROPOSAL' | 'CONTRACT' | 'REQUIREMENT' | 'DESIGN' | 'DELIVERABLE' | 'INVOICE' | 'OTHER';

const CATEGORY_VARIANT: Record<FileCategory, 'primary'|'secondary'|'cyan'|'warning'|'success'|'muted'> = {
  PROPOSAL:    'primary',
  CONTRACT:    'secondary',
  REQUIREMENT: 'cyan',
  DESIGN:      'warning',
  DELIVERABLE: 'success',
  INVOICE:     'muted',
  OTHER:       'muted',
};

const ICON_FOR_MIME: Record<string, React.ElementType> = {
  'image': FileImage,
  'code':  FileCode,
  'zip':   Archive,
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

const SAMPLE_FILES = [
  { id: '1', name: 'Project_Proposal_ECommerce.pdf',  category: 'PROPOSAL'    as FileCategory, mimeType: 'application/pdf', sizeBytes: 512000,  createdAt: '2026-06-01', url: '#', project: { name: 'E-Commerce Platform' } },
  { id: '2', name: 'Service_Agreement_Signed.pdf',    category: 'CONTRACT'    as FileCategory, mimeType: 'application/pdf', sizeBytes: 248000,  createdAt: '2026-06-05', url: '#', project: { name: 'E-Commerce Platform' } },
  { id: '3', name: 'Requirements_Document_v2.docx',   category: 'REQUIREMENT' as FileCategory, mimeType: 'application/vnd.openxmlformats', sizeBytes: 128000,  createdAt: '2026-06-10', url: '#', project: { name: 'E-Commerce Platform' } },
  { id: '4', name: 'UI_Designs_Figma_Export.zip',     category: 'DESIGN'      as FileCategory, mimeType: 'application/zip', sizeBytes: 8200000, createdAt: '2026-07-01', url: '#', project: { name: 'E-Commerce Platform' } },
  { id: '5', name: 'Homepage_Preview.png',            category: 'DESIGN'      as FileCategory, mimeType: 'image/png',       sizeBytes: 1400000, createdAt: '2026-07-05', url: '#', project: { name: 'E-Commerce Platform' } },
  { id: '6', name: 'Invoice_INV-041.pdf',             category: 'INVOICE'     as FileCategory, mimeType: 'application/pdf', sizeBytes: 95000,   createdAt: '2026-07-01', url: '#', project: { name: 'E-Commerce Platform' } },
];

const grouped = SAMPLE_FILES.reduce<Record<string, typeof SAMPLE_FILES>>((acc, f) => {
  const cat = f.category;
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(f);
  return acc;
}, {});

export default function ClientFilesPage() {
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

      {/* Files by category */}
      {Object.entries(grouped).map(([category, files]) => (
        <Card key={category} variant="default" padding="none" className="overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base capitalize">{category.charAt(0) + category.slice(1).toLowerCase()}s</CardTitle>
              <Badge variant={CATEGORY_VARIANT[category as FileCategory]} size="sm">{files.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-white/[0.04]">
            {files.map(file => {
              const Icon = getIcon(file.mimeType);
              return (
                <div key={file.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#4F7DFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-[#7A8499] mt-0.5">
                      {file.project.name} · {formatBytes(file.sizeBytes)} · {new Date(file.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
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
