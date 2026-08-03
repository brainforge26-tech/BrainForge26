import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

export function FormattedText({ content = '', className = '' }: FormattedTextProps) {
  if (!content) return null;

  // Split lines and parse basic Markdown/Rich text structures safely
  const lines = content.split('\n');

  return (
    <div className={`space-y-3 text-slate-300 leading-relaxed text-sm ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} className="h-2" />;

        // Heading 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base font-extrabold text-white mt-4 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-cyan-400 inline-block" />
              {parseInlineFormatting(trimmed.replace('### ', ''))}
            </h3>
          );
        }

        // Heading 2: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg font-extrabold text-white mt-5 mb-2">
              {parseInlineFormatting(trimmed.replace('## ', ''))}
            </h2>
          );
        }

        // Bullet list item: - Item or * Item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
              <span className="text-slate-200">{parseInlineFormatting(trimmed.substring(2))}</span>
            </div>
          );
        }

        // Numbered list item: 1. Item
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s(.*)/);
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-400 font-bold text-[10px] shrink-0 mt-0.5">
                  {match[1]}
                </span>
                <span className="text-slate-200">{parseInlineFormatting(match[2])}</span>
              </div>
            );
          }
        }

        // Normal paragraph
        return (
          <p key={idx} className="text-slate-300 leading-relaxed">
            {parseInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline parser for **bold**, *italic*, and `code`
function parseInlineFormatting(text: string): React.ReactNode {
  // Regex to match **bold**, *italic*, and `code`
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-cyan-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-white/[0.08] text-cyan-300 font-mono text-xs border border-white/[0.1]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
