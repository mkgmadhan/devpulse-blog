import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Code2, MessageSquare, Rss } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-bold text-lg mb-2">
              <span className="text-[--claude-accent]">Dev</span>Pulse
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deep-dive technical articles on AI, full-stack dev, cloud infrastructure, and emerging tech.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="https://github.com" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                <Code2 className="h-4 w-4" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="h-4 w-4" />
              </Link>
              <Link href="/feed.xml" aria-label="RSS" className="text-muted-foreground hover:text-foreground transition-colors">
                <Rss className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-sm mb-3">Explore</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { href: '/blog', label: 'All Articles' },
                { href: '/topics', label: 'Topics' },
                { href: '/about', label: 'About' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-semibold text-sm mb-3">Weekly digest</p>
            <p className="text-sm text-muted-foreground mb-3">
              Top articles delivered every Friday.
            </p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2026 DevPulse. All rights reserved.</p>
          <p>Built with Next.js · Hosted on Azure</p>
        </div>
      </div>
    </footer>
  );
}
