import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { ArrowRight } from 'lucide-react';

const FEATURED_TAGS = ['AI', 'Next.js', 'TypeScript', 'Cloud', 'MCP', 'DevOps'];

export default function HomePage() {
  const allPosts = getAllPosts();
  const featured = allPosts.find((p) => p.featured) ?? allPosts[0];
  const recent = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="mb-14 text-center md:text-left">
        <p className="text-sm font-medium text-[--claude-accent] mb-3 uppercase tracking-wider">
          Deep-dive tech writing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
          Stay ahead of the<br className="hidden md:block" /> tech curve.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto md:mx-0 mb-6">
          Practical articles on AI, full-stack development, cloud infrastructure, and the tools shaping software in 2026.
        </p>
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
          {FEATURED_TAGS.map((tag) => (
            <Link key={tag} href={`/topics/${tag.toLowerCase()}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-[--claude-accent]/10 transition-colors">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Featured</h2>
          </div>
          <PostCard post={featured} featured />
        </section>
      )}

      {/* Recent posts */}
      {recent.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Latest Articles</h2>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-[--claude-accent] hover:text-[--claude-accent]">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-card border border-border rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Get the weekly digest</h2>
        <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
          Top articles, curated picks, and occasional deep dives. Every Friday. No spam.
        </p>
        <div className="max-w-sm mx-auto">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
