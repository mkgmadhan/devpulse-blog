import { getPostsByTag, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag} Articles`,
    description: `All DevPulse articles tagged with ${tag}.`,
  };
}

export default async function TopicPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-sm text-muted-foreground mb-1">Topic</p>
      <h1 className="text-3xl font-bold mb-2 capitalize">{tag}</h1>
      <p className="text-muted-foreground mb-8">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
