'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slot: string;
  format?: 'auto' | 'rectangle' | 'leaderboard' | 'skyscraper';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdUnit({ slot, format = 'auto', className = '' }: Props) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not ready yet
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`bg-muted/50 border border-dashed border-border rounded flex items-center justify-center text-xs text-muted-foreground min-h-[90px] ${className}`}>
        Ad Placeholder ({slot})
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
