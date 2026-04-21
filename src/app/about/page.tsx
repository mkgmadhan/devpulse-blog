import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About DevPulse — who we are and what we write about.',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">About DevPulse</h1>
      <div className="prose-blog">
        <p>
          DevPulse is an independent technical blog covering the topics that matter most to software engineers in 2026: artificial intelligence, full-stack development, cloud infrastructure, and the tools reshaping how we build software.
        </p>
        <p>
          Every article is written by practitioners — engineers who use these tools daily and have hard-won opinions about what works and what doesn&apos;t.
        </p>
        <h2>What we cover</h2>
        <ul>
          <li><strong>AI & LLMs</strong> — model capabilities, agent frameworks, MCP, practical use cases</li>
          <li><strong>Full-stack dev</strong> — Next.js, React, TypeScript, databases, APIs</li>
          <li><strong>Cloud & DevOps</strong> — Azure, containerization, CI/CD, observability</li>
          <li><strong>Developer tools</strong> — IDEs, CLIs, productivity, emerging tooling</li>
        </ul>
        <h2>Contact</h2>
        <p>
          Have a topic suggestion or want to contribute? Reach out at{' '}
          <a href="mailto:hello@devpulse.blog">hello@devpulse.blog</a>.
        </p>
      </div>
    </div>
  );
}
