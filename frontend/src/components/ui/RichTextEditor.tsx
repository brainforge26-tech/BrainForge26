'use client';

import { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading3,
  Code,
  Eye,
  Edit3,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { FormattedText } from './FormattedText';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write job description, responsibilities, and benefits here...',
  label = 'Job Description',
  required = false,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('rich-text-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const insertBulletList = () => {
    insertFormat('\n- ', '');
  };

  const insertNumberedList = () => {
    insertFormat('\n1. ', '');
  };

  const insertHeading = () => {
    insertFormat('\n### ', '');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'edit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editor Mode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.1] bg-[#090D16] overflow-hidden shadow-inner focus-within:border-cyan-400 transition-colors">
        {/* Formatting Toolbar */}
        {activeTab === 'edit' && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-white/[0.03] border-b border-white/[0.08]">
            <button
              type="button"
              title="Bold"
              onClick={() => insertFormat('**', '**')}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => insertFormat('*', '*')}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={insertHeading}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/[0.1] mx-1" />

            <button
              type="button"
              title="Bullet List"
              onClick={insertBulletList}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Numbered List"
              onClick={insertNumberedList}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/[0.1] mx-1" />

            <button
              type="button"
              title="Code Tag"
              onClick={() => insertFormat('`', '`')}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Clear Text"
              onClick={() => onChange('')}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Editor Body */}
        {activeTab === 'edit' ? (
          <textarea
            id="rich-text-input"
            rows={7}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-transparent text-white text-sm focus:outline-none resize-y leading-relaxed"
          />
        ) : (
          <div className="p-5 min-h-[160px] max-h-[300px] overflow-y-auto bg-[#0B1224]/80">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 flex items-center gap-1 mb-3">
              <Sparkles className="w-3 h-3" /> Exact Public Rendering Preview
            </span>
            <FormattedText content={value || '*(No description entered yet...)*'} />
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <span>Formatting shortcuts:</span>
        <code className="px-1 py-0.5 rounded bg-white/[0.08] text-[10px] text-cyan-300">**bold**</code>
        <code className="px-1 py-0.5 rounded bg-white/[0.08] text-[10px] text-cyan-300">### Heading</code>
        <code className="px-1 py-0.5 rounded bg-white/[0.08] text-[10px] text-cyan-300">- Bullet item</code>
      </p>
    </div>
  );
}
