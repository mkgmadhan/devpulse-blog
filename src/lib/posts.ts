import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorAvatar: string;
  tags: string[];
  coverImage: string;
  readingTime: string;
  featured?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      const rt = readingTime(content);
      return {
        slug,
        title: data.title ?? '',
        excerpt: data.excerpt ?? '',
        date: data.date ?? '',
        author: data.author ?? 'Staff',
        authorAvatar: data.authorAvatar ?? '/avatars/default.png',
        tags: data.tags ?? [],
        coverImage: data.coverImage ?? '/images/default-cover.png',
        readingTime: rt.text,
        featured: data.featured ?? false,
      } satisfies PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    date: data.date ?? '',
    author: data.author ?? 'Staff',
    authorAvatar: data.authorAvatar ?? '/avatars/default.png',
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? '/images/default-cover.png',
    readingTime: rt.text,
    featured: data.featured ?? false,
    content,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}
