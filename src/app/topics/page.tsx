import { getAllTags, getPostsByTag } from '@/lib/posts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Browse articles by topic — AI, Next.js, TypeScript, Cloud, and more.',
};

export default function TopicsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Topics</h1>
      <p className="text-muted-foreground mb-8">Browse articles by topic.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {tags.map((tag) => {
          const count = getPostsByTag(tag).length;
          return (
            <Link key={tag} href={`/topics/${tag.toLowerCase()}`}>
              <div className="border border-border rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer">
                <p className="font-semibold text-sm">{tag}</p>
                <p className="text-xs text-muted-foreground mt-1">{count} article{count !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {tags.length === 0 && (
        <p className="text-muted-foreground">No topics yet.</p>
      )}
    </div>
  );
}
