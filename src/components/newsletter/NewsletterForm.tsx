'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Props {
  compact?: boolean;
}

export function NewsletterForm({ compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? 'Subscribed! Check your inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-[--claude-accent] font-medium">{message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', compact ? 'flex-col' : 'flex-row')}>
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="h-9 text-sm"
      />
      <Button
        type="submit"
        size="sm"
        disabled={status === 'loading'}
        className="bg-[--claude-accent] hover:opacity-90 text-white shrink-0"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </Button>
      {status === 'error' && (
        <p className="text-xs text-destructive col-span-full">{message}</p>
      )}
    </form>
  );
}
