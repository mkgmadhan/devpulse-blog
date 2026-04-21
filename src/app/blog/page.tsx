import { getAllPosts, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse all deep-dive technical articles on AI, full-stack development, cloud infrastructure, and emerging technology.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">All Articles</h1>
      <p className="text-muted-foreground mb-8">
        {posts.length} articles on AI, dev tools, cloud, and more.
      </p>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Link key={tag} href={`/topics/${tag.toLowerCase()}`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              {tag}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-muted-foreground text-center py-16">No articles yet. Check back soon.</p>
      )}
    </div>
  );
}
