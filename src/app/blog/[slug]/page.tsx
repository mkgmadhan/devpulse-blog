import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { PostCard } from '@/components/blog/PostCard';
import { AdUnit } from '@/components/ads/AdUnit';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* Main content */}
          <div>
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/topics/${tag.toLowerCase()}`}>
                    <Badge variant="secondary" className="cursor-pointer">{tag}</Badge>
                  </Link>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
              <p className="text-muted-foreground text-lg mb-5">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-b border-border py-3">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {post.readingTime}
                </span>
              </div>
            </header>

            {/* In-article ad */}
            <AdUnit slot="1234567890" className="mb-8" />

            {/* MDX Content */}
            <article className="prose-blog">
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    ],
                  },
                }}
              />
            </article>

            {/* Second ad after content */}
            <AdUnit slot="0987654321" className="mt-8" />

            {/* Related posts */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-lg font-semibold mb-5">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <TableOfContents />
            <div className="mt-8">
              <AdUnit slot="1122334455" format="rectangle" className="min-h-[250px]" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
