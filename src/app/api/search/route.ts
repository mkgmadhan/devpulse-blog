import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export function GET() {
  const posts = getAllPosts().map(({ slug, title, excerpt, tags }) => ({
    slug,
    title,
    excerpt,
    tags,
  }));
  return NextResponse.json(posts);
}
