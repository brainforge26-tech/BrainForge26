import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-6  h-6  text-[10px]',
  sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const pixelMap = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };

function getInitials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const px = pixelMap[size];

  if (src) {
    return (
      <div className={cn('rounded-full overflow-hidden shrink-0 ring-2 ring-white/10', sizeMap[size], className)}>
        <Image
          src={src}
          alt={name ?? 'Avatar'}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full shrink-0 flex items-center justify-center font-bold',
        'bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] text-white ring-2 ring-white/10',
        sizeMap[size],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
