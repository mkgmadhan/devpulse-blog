import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import type { PostMeta } from '@/lib/posts';

interface Props {
  post: PostMeta;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: Props) {
  return (
    <Card className={`group overflow-hidden hover:shadow-md transition-shadow border-border ${featured ? 'md:flex' : ''}`}>
      {/* Cover image placeholder */}
      <div
        className={`bg-gradient-to-br from-[--claude-accent]/20 to-muted ${
          featured ? 'md:w-64 md:shrink-0 h-40 md:h-auto' : 'h-40'
        } flex items-center justify-center`}
      >
        <span className="text-4xl opacity-30 select-none">
          {post.tags[0] === 'AI' ? '🤖' :
           post.tags[0] === 'TypeScript' ? '🔷' :
           post.tags[0] === 'Cloud' ? '☁️' :
           post.tags[0] === 'Next.js' ? '▲' : '📝'}
        </span>
      </div>

      <CardContent className={`p-5 ${featured ? 'flex flex-col justify-center' : ''}`}>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className={`font-semibold leading-snug hover:text-[--claude-accent] transition-colors ${
            featured ? 'text-xl' : 'text-base'
          }`}>
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(post.date), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
