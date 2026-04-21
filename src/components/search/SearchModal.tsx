'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface SearchItem {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [index, setIndex] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open && index.length === 0) {
      fetch('/api/search')
        .then((r) => r.json())
        .then((data) => setIndex(data));
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, index.length]);

  useEffect(() => {
    if (!query.trim() || index.length === 0) {
      setResults([]);
      return;
    }
    const fuse = new Fuse(index, {
      keys: ['title', 'excerpt', 'tags'],
      threshold: 0.3,
    });
    setResults(fuse.search(query).map((r) => r.item).slice(0, 8));
  }, [query, index]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(true)}
        aria-label="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="flex items-center border-b border-border px-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="border-0 focus-visible:ring-0 shadow-none h-12 text-sm"
            />
            <kbd className="hidden sm:block text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 && query.trim() !== '' && (
              <p className="text-sm text-muted-foreground p-4 text-center">No results for &quot;{query}&quot;</p>
            )}
            {results.length === 0 && query.trim() === '' && (
              <p className="text-sm text-muted-foreground p-4 text-center">Start typing to search…</p>
            )}
            {results.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                onClick={() => { setOpen(false); setQuery(''); }}
                className="flex flex-col px-4 py-3 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.excerpt}</span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
