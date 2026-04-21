'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(): Heading[] {
  const els = document.querySelectorAll('article h2, article h3');
  return Array.from(els).map((el) => ({
    id: el.id,
    text: el.textContent ?? '',
    level: parseInt(el.tagName[1]),
  }));
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    setHeadings(extractHeadings());
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );
    document.querySelectorAll('article h2, article h3').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-20 text-sm">
      <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block pl-4 py-0.5 transition-colors hover:text-foreground ${
                h.level === 3 ? 'pl-7 text-xs' : ''
              } ${
                active === h.id
                  ? 'text-[--claude-accent] border-l-2 border-[--claude-accent] -ml-px'
                  : 'text-muted-foreground'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
