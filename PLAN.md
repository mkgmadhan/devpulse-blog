# Blog App Implementation Plan

## Stack Decision

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router) | Industry standard, RSC, server actions |
| UI | shadcn/ui + Tailwind v4 | De facto Next.js standard, Radix base |
| Design | Claude-inspired aesthetic | Dark/cream minimalist, warm neutrals |
| CMS | MDX (file-based) → Sanity v3 | Start simple, upgrade to headless CMS |
| Auth | NextAuth v5 (Auth.js) | Session-based, supports OAuth + credentials |
| Database | PostgreSQL + Prisma | Comments, subscriptions, user data |
| Search | Algolia or Fuse.js (local) | Full-text post search |
| Ads | Google AdSense | `next/script` afterInteractive pattern |
| Analytics | Vercel Analytics + Plausible | Privacy-first, Core Web Vitals |
| Email | Resend + React Email | Newsletter, notifications |
| Deployment | Vercel | Native Next.js 15 support |

---

## Claude-Inspired Design System

Claude.ai uses a warm, minimal aesthetic:
- **Background:** Off-white `#F9F7F4` (light) / Dark `#1A1A1A` (dark)
- **Primary accent:** Warm orange-red `#D97757` (Claude orange)
- **Text:** Near-black `#1A1A1A` / Muted `#6B7280`
- **Card surfaces:** `#FFFFFF` light / `#242424` dark
- **Border:** Subtle `#E5E1D8` light / `#333333` dark
- **Font:** Inter or Geist Sans (clean, modern)
- **Radius:** `0.5rem` (subtle rounding, not bubbly)
- **Shadows:** Very soft, barely visible

---

## Features List

### Core (MVP)
- [ ] Public blog post listing page
- [ ] Individual post page (MDX rendered, syntax highlighting)
- [ ] Tag/category filtering
- [ ] Author profile page
- [ ] SEO: meta tags, OG images, sitemap.xml, robots.txt
- [ ] Dark/light mode toggle
- [ ] Responsive layout (mobile-first)
- [ ] Reading time estimate

### Content & CMS
- [ ] MDX-based posts with frontmatter
- [ ] Code blocks with Shiki syntax highlighting
- [ ] Image optimization (next/image)
- [ ] Table of contents (auto-generated from headings)
- [ ] Related posts (tag-based)
- [ ] Post series support

### Engagement
- [ ] Comment system (Prisma-backed or Giscus for GitHub)
- [ ] Post reactions (like/bookmark)
- [ ] Newsletter subscription (Resend)
- [ ] Social sharing buttons (Twitter/X, LinkedIn, copy link)
- [ ] Reading progress bar

### Search & Discovery
- [ ] Full-text search (Fuse.js client-side or Algolia)
- [ ] Tag archive pages
- [ ] Paginated post listing

### Auth & Admin
- [ ] NextAuth v5 (Google + GitHub OAuth)
- [ ] Admin dashboard (post CRUD, comment moderation)
- [ ] Role-based access (admin, author, reader)
- [ ] Draft posts (only visible to admin)

### Monetization
- [ ] Google AdSense (sidebar, in-article, footer)
- [ ] Ad-free mode toggle (future: paid subscriptions)

### Analytics & SEO
- [ ] Vercel Analytics
- [ ] JSON-LD structured data (Article schema)
- [ ] Canonical URLs
- [ ] Dynamic OG image generation (`@vercel/og`)
- [ ] XML sitemap
- [ ] RSS feed

---

## Phase 0: Documentation Discovery

**Goal:** Confirm exact API signatures before writing code. No assumptions.

### Tasks

- [ ] Read Next.js 15 App Router docs: layouts, dynamic routes, generateMetadata, generateStaticParams
- [ ] Read shadcn/ui v2 install docs for Next.js 15 + Tailwind v4
- [ ] Read NextAuth v5 (Auth.js) docs for App Router
- [ ] Read Prisma docs for Next.js 15 + PostgreSQL setup
- [ ] Read Resend + React Email docs for newsletter
- [ ] Read AdSense `next/script` integration pattern
- [ ] Read `@vercel/og` docs for OG image generation
- [ ] Read `next-mdx-remote` or `contentlayer2` for MDX processing

### Allowed APIs (post-discovery)
Document confirmed APIs here before Phase 1 begins.

---

## Phase 1: Project Scaffold & Design System

**Self-contained context:** Start fresh Next.js 15 project. No prior code exists.

### Tasks

1. Init Next.js 15 project
   ```bash
   pnpm create next-app@latest blog --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```

2. Install shadcn/ui
   ```bash
   pnpm dlx shadcn@latest init
   ```
   Add components:
   ```bash
   pnpm dlx shadcn@latest add button card badge separator input textarea dialog dropdown-menu pagination
   ```

3. Create Claude-inspired design tokens in `src/lib/tokens.ts` and update `tailwind.config.ts`:
   - Colors: warm off-white, Claude orange accent, dark surfaces
   - Typography: Geist Sans (Next.js default)
   - Shadows: soft, minimal

4. Create core layout components:
   - `src/components/layout/Header.tsx` — logo, nav, dark mode toggle, search icon
   - `src/components/layout/Footer.tsx` — links, newsletter CTA
   - `src/app/layout.tsx` — root layout with font, theme provider

5. Implement dark/light mode with `next-themes`

6. Create `src/app/page.tsx` — hero section + recent posts grid

### Verification
- [ ] `pnpm dev` runs without errors
- [ ] Dark/light toggle works
- [ ] Header/footer render on all pages
- [ ] Colors match Claude aesthetic (off-white bg, orange accent)

### Anti-patterns
- Do NOT use `pages/` directory — App Router only
- Do NOT use Tailwind v3 config syntax with v4

---

## Phase 2: Blog Post System (MDX)

**Self-contained context:** Phase 1 complete. Design system in place.

### Tasks

1. Install MDX dependencies:
   ```bash
   pnpm add next-mdx-remote gray-matter reading-time shiki
   ```

2. Create `content/posts/` directory with sample posts (frontmatter: title, date, slug, tags, author, excerpt, coverImage)

3. Create `src/lib/posts.ts`:
   - `getAllPosts()` — reads all MDX files, parses frontmatter
   - `getPostBySlug(slug)` — returns single post with content
   - `getPostsByTag(tag)` — filtered list

4. Create routes:
   - `src/app/blog/page.tsx` — post listing with pagination
   - `src/app/blog/[slug]/page.tsx` — single post with `generateStaticParams` + `generateMetadata`
   - `src/app/blog/tag/[tag]/page.tsx` — tag archive

5. Create post components:
   - `src/components/blog/PostCard.tsx` — card with cover, title, excerpt, tags, date, reading time
   - `src/components/blog/PostHeader.tsx` — title, date, author, reading time, tags
   - `src/components/blog/TableOfContents.tsx` — auto-extracted from headings
   - `src/components/blog/MDXComponents.tsx` — custom renderers (code, images, callouts)
   - `src/components/blog/ReadingProgress.tsx` — scroll-based progress bar

6. Shiki syntax highlighting config for code blocks

7. Dynamic OG image: `src/app/blog/[slug]/opengraph-image.tsx` using `@vercel/og`

### Verification
- [ ] `/blog` lists all posts
- [ ] `/blog/[slug]` renders MDX content with syntax highlighting
- [ ] `/blog/tag/[tag]` filters correctly
- [ ] `generateMetadata` sets correct title, description, OG image per post
- [ ] Reading time shows on post cards
- [ ] TOC renders with working anchor links

---

## Phase 3: SEO & Sitemap

**Self-contained context:** Blog routes exist from Phase 2.

### Tasks

1. `src/app/sitemap.ts` — dynamic sitemap from all post slugs + static pages
2. `src/app/robots.ts` — robots.txt
3. `src/app/feed.xml/route.ts` — RSS feed (returns XML)
4. JSON-LD in `src/app/blog/[slug]/page.tsx`:
   ```json
   {
     "@type": "BlogPosting",
     "headline": "...",
     "author": { "@type": "Person" },
     "datePublished": "..."
   }
   ```
5. Root `src/app/layout.tsx` — set `metadataBase`, default OG, twitter card

### Verification
- [ ] `/sitemap.xml` returns valid XML with all post URLs
- [ ] `/robots.txt` correct
- [ ] `/feed.xml` valid RSS
- [ ] Google Rich Results Test passes for post pages
- [ ] Lighthouse SEO score ≥ 95

---

## Phase 4: Google AdSense Integration

**Self-contained context:** Blog posts render. SEO in place.

### Tasks

1. Create `src/components/ads/AdSense.tsx`:
   ```tsx
   'use client';
   import Script from 'next/script';
   
   export function AdSenseScript() {
     if (process.env.NODE_ENV !== 'production') return null;
     return (
       <Script
         async
         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
         strategy="afterInteractive"
         crossOrigin="anonymous"
       />
     );
   }
   ```

2. Create `src/components/ads/AdUnit.tsx` — reusable ad slot component (responsive)

3. Add `AdSenseScript` to root `src/app/layout.tsx`

4. Place `AdUnit` components:
   - Sidebar (desktop only, sticky)
   - In-article (after paragraph 3 on long posts)
   - Footer banner

5. Add `.env.local`:
   ```
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

6. Update `next.config.ts` to allow AdSense domains in Content Security Policy

### Verification
- [ ] Ads script loads only in production
- [ ] `NEXT_PUBLIC_ADSENSE_ID` is used (not hardcoded)
- [ ] Ad slots render without layout shift (define min-height)
- [ ] Core Web Vitals CLS score not impacted

---

## Phase 5: Auth & Comments

**Self-contained context:** Blog posts exist. Database needed.

### Tasks

1. Install Auth.js + Prisma:
   ```bash
   pnpm add next-auth@beta @auth/prisma-adapter
   pnpm add prisma @prisma/client
   pnpm add bcryptjs
   ```

2. Initialize Prisma:
   ```bash
   pnpm dlx prisma init
   ```

3. Schema (`prisma/schema.prisma`):
   - `User` (id, name, email, image, role: ADMIN|AUTHOR|READER)
   - `Account` (NextAuth OAuth)
   - `Session`
   - `Comment` (id, content, postSlug, authorId, createdAt, approved)
   - `Reaction` (postSlug, userId, type: LIKE|BOOKMARK)

4. `src/auth.ts` — NextAuth config with Google + GitHub providers + PrismaAdapter

5. `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler

6. Create server actions:
   - `src/app/actions/comments.ts` — `addComment`, `deleteComment`, `approveComment`
   - `src/app/actions/reactions.ts` — `toggleReaction`

7. Comment components:
   - `src/components/blog/CommentForm.tsx`
   - `src/components/blog/CommentList.tsx`
   - `src/components/blog/ReactionBar.tsx`

### Verification
- [ ] Google + GitHub OAuth sign-in work
- [ ] Signed-in users can post comments
- [ ] Admin can approve/delete comments
- [ ] Reactions persist per user per post

---

## Phase 6: Search & Newsletter

**Self-contained context:** All posts exist. Auth in place.

### Tasks

**Search:**
1. Install Fuse.js: `pnpm add fuse.js`
2. `src/app/api/search/route.ts` — returns serialized post index (title, slug, excerpt, tags)
3. `src/components/search/SearchModal.tsx` — `Cmd+K` triggered dialog, client-side Fuse.js search
4. Add keyboard shortcut hook

**Newsletter:**
1. Install Resend: `pnpm add resend react-email`
2. `src/app/api/newsletter/subscribe/route.ts` — add email to Resend audience
3. `src/components/newsletter/NewsletterForm.tsx` — email input + subscribe button
4. Welcome email template: `src/emails/WelcomeEmail.tsx`
5. Place `NewsletterForm` in footer and blog sidebar

### Verification
- [ ] `Cmd+K` opens search modal
- [ ] Search returns relevant posts instantly (< 50ms)
- [ ] Newsletter form submits and shows success state
- [ ] Welcome email received on subscribe
- [ ] No duplicate subscriptions

---

## Phase 7: Admin Dashboard

**Self-contained context:** Auth + database from Phase 5.

### Tasks

1. `src/middleware.ts` — protect `/admin/*` routes (redirect non-admins)
2. Admin layout: `src/app/admin/layout.tsx` — sidebar nav
3. Pages:
   - `src/app/admin/page.tsx` — stats dashboard (post count, comment count, subscriber count)
   - `src/app/admin/comments/page.tsx` — comment moderation table
   - `src/app/admin/subscribers/page.tsx` — newsletter subscriber list

### Verification
- [ ] Non-admin users redirected from `/admin`
- [ ] Admin can approve/delete comments
- [ ] Dashboard stats update in real-time

---

## Phase 8: Performance & Polish

**Self-contained context:** All features built.

### Tasks

1. Image optimization — ensure all `<img>` replaced with `next/image`
2. Font optimization — `next/font/google` for Geist
3. Bundle analysis: `pnpm add @next/bundle-analyzer`
4. Lazy load heavy components (search modal, comment form) with `next/dynamic`
5. Add `loading.tsx` for blog listing and post pages (skeleton UI)
6. Error boundaries: `error.tsx` for blog routes
7. Add Vercel Analytics: `pnpm add @vercel/analytics`
8. Run Lighthouse — target scores: Performance ≥ 90, SEO ≥ 95, A11y ≥ 90

### Verification
- [ ] Lighthouse scores meet targets
- [ ] No layout shift from ads (CLS ≤ 0.1)
- [ ] First Contentful Paint ≤ 1.5s
- [ ] All images have width/height (no CLS)

---

## File Structure (Final)

```
src/
├── app/
│   ├── layout.tsx              # Root layout, theme, fonts, AdSense script
│   ├── page.tsx                # Homepage
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── feed.xml/route.ts
│   ├── blog/
│   │   ├── page.tsx            # Post listing
│   │   ├── [slug]/
│   │   │   ├── page.tsx        # Post detail
│   │   │   └── opengraph-image.tsx
│   │   └── tag/[tag]/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── comments/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── search/route.ts
│   │   └── newsletter/subscribe/route.ts
│   └── actions/
│       ├── comments.ts
│       └── reactions.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostHeader.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── MDXComponents.tsx
│   │   ├── ReadingProgress.tsx
│   │   ├── CommentForm.tsx
│   │   ├── CommentList.tsx
│   │   └── ReactionBar.tsx
│   ├── ads/
│   │   ├── AdSenseScript.tsx
│   │   └── AdUnit.tsx
│   ├── search/
│   │   └── SearchModal.tsx
│   └── newsletter/
│       └── NewsletterForm.tsx
├── lib/
│   ├── posts.ts
│   ├── tokens.ts               # Design tokens
│   └── utils.ts
├── auth.ts
└── middleware.ts
content/
└── posts/
    └── *.mdx
prisma/
└── schema.prisma
```

---

## Environment Variables

```env
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Database
DATABASE_URL=postgresql://...

# Ads
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX

# Email
RESEND_API_KEY=

# Analytics (Vercel auto-injects)
```

---

## Execution Order

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
Discovery  Scaffold   MDX Blog   SEO      AdSense    Auth+DB    Search+   Admin    Polish
                                                               Newsletter
```

Each phase is a self-contained Claude Code session. Start each with: "Read PLAN.md Phase N, implement only that phase."
