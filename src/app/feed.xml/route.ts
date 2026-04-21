import { getAllPosts } from '@/lib/posts';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devpulse.blog';

export function GET() {
  const posts = getAllPosts().slice(0, 20);

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid>${BASE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
      <author>${p.author}</author>
      ${p.tags.map((t) => `<category>${t}</category>`).join('\n      ')}
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DevPulse</title>
    <link>${BASE}</link>
    <description>Deep-dive tech articles on AI, full-stack dev, cloud, and more.</description>
    <language>en-us</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
