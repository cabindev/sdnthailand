# SDN Thailand Project - CLAUDE.md

## Project Overview
This is a Next.js web application for SDN Thailand (Sober Drivers / StopDrink Network Thailand) - an organization focused on alcohol-free advocacy and awareness campaigns in Thailand. The platform is a public content hub for blogs, news, videos, and campaigns. It is **content/API-driven**: there is no database or authentication layer; content comes from external WordPress APIs and the only server-side write path is the contact form (email).

For product strategy and the visual design system, see `PRODUCT.md` and `DESIGN.md` at the project root.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS v4 (CSS-first config in `app/globals.css` via `@theme`/`@plugin`; no `tailwind.config.*`) + `@tailwindcss/typography`
- **Animation**: Framer Motion (`framer-motion` v12)
- **Icons**: lucide-react, react-icons, @heroicons/react
- **Maps**: Leaflet + react-leaflet v5 (client-only, `dynamic(..., { ssr: false })`)
- **Carousel**: Embla
- **Data fetching**: SWR (client-side, against internal API routes that proxy WordPress)
- **Email**: Nodemailer (contact form only)
- **Text-to-Speech**: Azure Cognitive Services Speech REST API (called via `fetch`, no SDK)
- **Production server**: Express (`server.js`) for Plesk/Passenger compatibility

> No database, ORM, or auth: Prisma, NextAuth, bcryptjs, and the user/dashboard system were removed. The site is fully driven by external content APIs.

## Project Structure

```
app/
├── about/                   # About pages (mission, principles, contact, chart, projects)
├── api/                     # API routes (proxy/aggregate WordPress + utilities)
│   ├── sdnblog/             # Blog API endpoints (+ related, views)
│   ├── sdnpost/             # News/post API endpoints (+ related, views)
│   ├── sdn-latest/          # Unified latest feed
│   ├── video/               # Video API endpoints
│   ├── civicspace/          # CivicSpace content
│   ├── mapportal/           # MapPortal data
│   ├── projects2020/        # 2020 projects
│   ├── text-to-speech/      # Azure TTS (REST via fetch)
│   ├── contact/             # Contact form (Nodemailer)
│   └── yellow/              # Yellow campaign
├── components/              # Shared components (Navbar, Footer, ...)
├── data/                    # Static data (provinces, regions)
├── features/                # Feature components (blog, news, video, ordain, mapportal, movements)
├── herosection/            # Homepage sections (composed in herosection/components/Home.tsx)
├── library/                # Digital library (maintenance mode)
├── project2020/            # 2020 projects showcase
├── sdnblog/                # Blog pages (list + [id] detail)
├── sdnpost/                # News pages (list + [id] detail)
├── video/                  # Video pages
└── yellow/                 # Yellow campaign page

public/
├── campaign/               # Campaign images and assets
├── images/                 # General images and logos
└── networks/               # Network organization logos
```

## Key Features

### 1. Content (from external WordPress APIs)
- **Blogs**: views tracking, related posts, audio reading (TTS)
- **News/Posts**: sharing, related posts
- **Videos**: video content with related videos
- **Unified feed**: latest blog + news + video on the homepage

### 2. Campaigns & Sections
- Buddhist ordination campaign (saffron-themed section)
- MapPortal interactive map (Leaflet, homepage only)
- Logo showcase for partner organizations
- Various awareness campaigns

### 3. Accessibility
- Text-to-speech (Azure) audio reading for articles
- WCAG AA targets, `prefers-reduced-motion` honored, visible focus states
- Mobile-first responsive design

### 4. Contact
- Contact form (`/about/contact` → `/api/contact`) sends email via Nodemailer

## Development Commands

```bash
npm run dev     # Start dev server (Next 16, Turbopack)
npm run build   # Production build
npm run start   # Start production server (next start)
npm run lint    # ESLint
```

No database/migration commands — there is no DB.

## Environment Setup
Environment variables (in `.env`, gitignored):
- `WORDPRESS_API_URL`, `WP_APPLICATION_PASSWORD` - WordPress content source
- `NEXT_PUBLIC_API_URL` - frontend/base URL
- `MAPPORTAL_API_URL` - MapPortal data source
- `EMAIL_USER`, `EMAIL_PASS` - Nodemailer (contact form)
- `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` - TTS

## Styling Notes (Tailwind v4)
- No `tailwind.config.ts`; theme tokens live in `app/globals.css` under `@theme` (brand color `--accent: #ff7834`, fonts, keyframes).
- Plugins loaded via `@plugin` (e.g. `@tailwindcss/typography`). PostCSS uses `@tailwindcss/postcss`.
- Brand accent contrast rule: use `#ff7834` on dark surfaces / as fills, icons, focus rings; for accent text on light backgrounds use a darker shade (e.g. `#c2410c`) to meet AA. See `DESIGN.md`.

## Special Functionality
- **Text-to-Speech**: Azure Speech REST API for Thai article narration (no SDK dependency).
- **Image Optimization**: Next.js `<Image>` with `remotePatterns` for WordPress/Gravatar/Azure blob sources (see `next.config.js`).
- **MapPortal**: Leaflet map loaded client-only via dynamic import with `ssr: false`.

## Deployment Notes
- Production uses a custom Express server (`server.js`) as the Passenger entry point on Plesk.
- MAMP for local development; default port 3000.
- Fonts self-hosted (Seppuri, IBM Plex Sans Thai Looped) under `app/fonts`.

## Thai Language Support
- Primarily Thai UI and content; Thai TTS; Thailand-specific data (provinces, regions); Thai cultural context (Buddhist campaigns).

## Notes
- Installs may require `--legacy-peer-deps` while some libraries catch up to React 19 peer ranges.
- The contact form is the only feature that sends data server-side (email); everything else is read-only content.
