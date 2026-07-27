'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { uploadFileAction, type Project, type ActionState } from '../manager.actions';
import { Loader2, UploadCloud, File, Download } from 'lucide-react';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function FilesTab({ project, files }: { project: Project, files: any[] }) {
  const uploadAction = uploadFileAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(uploadAction, initial);
  
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setSelectedFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [state.success, state]);

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <form action={formAction} className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Upload New File</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">File Category</label>
            <select name="category" className="input-field">
              <option value="PROPOSAL">Proposal</option>
              <option value="CONTRACT">Contract</option>
              <option value="REQUIREMENT">Requirement</option>
              <option value="DESIGN">Design</option>
              <option value="DELIVERABLE">Deliverable</option>
              <option value="INVOICE">Invoice</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F7DFF]/20 to-[#7C5CFF]/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.1] rounded-xl hover:border-[#4F7DFF]/50 bg-white/[0.02] cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 text-[#7A8499] mb-2" />
              <p className="text-sm text-[#AAB3C5]">
                {selectedFileName ? <span className="text-white font-medium">{selectedFileName}</span> : 'Click to select a file to upload'}
              </p>
            </div>
            <input 
              ref={fileInputRef}
              name="file" 
              type="file" 
              required
              className="hidden" 
              onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || null)}
            />
          </label>
        </div>

        {'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending || !selectedFileName} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><UploadCloud className="w-4 h-4" /> Upload File</>}
        </button>
      </form>

      <div className="w-full h-px bg-white/[0.06]" />

      {/* Existing Files */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Project Files</h3>
        {files?.length === 0 && (
          <p className="text-sm text-[#7A8499]">No files uploaded yet.</p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {files?.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5 text-[#4F7DFF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{f.name}</p>
                  <p className="text-xs text-[#7A8499]">{f.category}</p>
                </div>
              </div>
              <a 
                href={f.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 text-[#AAB3C5] hover:text-white transition-colors"
                title="Download File"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
