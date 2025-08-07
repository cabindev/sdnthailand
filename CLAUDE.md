# SDN Thailand Project - CLAUDE.md

## Project Overview
This is a Next.js 14 web application for SDN Thailand (Sober Drivers Network Thailand) - an organization focused on alcohol-free advocacy and awareness campaigns in Thailand. The platform serves as a comprehensive hub for blogs, news, videos, user management, and various campaigns promoting alcohol-free lifestyle.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js v4 with Prisma adapter
- **Styling**: Tailwind CSS with DaisyUI components
- **UI Components**: Tremor React, Framer Motion, Lucide React icons
- **Image handling**: Browser image compression
- **Text-to-Speech**: Microsoft Cognitive Services Speech SDK
- **Data fetching**: SWR for client-side data fetching
- **Email**: Nodemailer
- **Password hashing**: bcryptjs

## Project Structure

```
app/
├── about/                    # About pages (mission, principles, projects)
├── api/                      # API routes
│   ├── auth/                 # Authentication endpoints
│   ├── sdnblog/             # Blog API endpoints
│   ├── sdnpost/             # Posts API endpoints
│   ├── video/               # Video API endpoints
│   ├── text-to-speech/      # TTS functionality
│   └── users/               # User management APIs
├── auth/                     # Authentication pages
├── components/               # Shared components
├── dashboard/                # User dashboard
├── data/                     # Static data (provinces, regions)
├── features/                 # Feature-specific components
│   ├── blog/                # Blog components and types
│   ├── news/                # News components
│   ├── ordain/              # Ordination campaign
│   └── video/               # Video components
├── herosection/             # Homepage sections
├── library/                 # Digital library (maintenance mode)
├── project2020/             # 2020 projects showcase
├── sdnblog/                 # Blog pages
├── sdnpost/                 # Post pages
├── video/                   # Video pages
└── yellow/                  # Yellow campaign page

public/
├── campaign/                # Campaign images and assets
├── images/                  # Profile and general images
├── networks/               # Network organization logos
└── procurement/            # Procurement documents
```

## Key Features

### 1. Content Management
- **Blogs**: Full blog system with views tracking, related posts, audio reading
- **Posts**: News/announcement system with sharing capabilities
- **Videos**: Video content management with related videos
- **Projects**: Showcase of projects from 2020 and 2567 (2024)

### 2. User Management
- User registration and authentication
- Profile management with image upload
- Role-based access (MEMBER, ADMIN)
- Password reset functionality
- Dashboard with user statistics

### 3. Campaigns & Features
- Buddhist ordination campaign
- Various awareness campaigns (Dry January, PM 2.5, etc.)
- Logo showcase for partner organizations
- Network information display

### 4. Accessibility Features
- Text-to-speech functionality using Azure Cognitive Services
- Audio reading for blog posts
- Responsive design for mobile and desktop

### 5. Data Management
- Province and regional data for Thailand
- User statistics and analytics
- Media request system
- Procurement system (DRAFT, OPEN, CLOSED, CANCELLED)

## Database Schema

### User Model
- Authentication and profile information
- Role-based permissions (MEMBER/ADMIN)
- Password reset tokens with expiration
- Media request relationships

### Content Models
- MediaRequest: User media requests with file attachments
- Procurement: Procurement management with status tracking
- AnnounceResult: Procurement announcement results

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma migrate dev    # Apply database migrations
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes
```

## Environment Setup
Required environment variables:
- `DATABASE_URL` - MySQL database connection
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL
- Azure Speech Services credentials for TTS

## Content Types

### External APIs
The application fetches content from external WordPress APIs:
- Blog content from `blog.sdnthailand.com`
- News content from `sdnthailand.com`
- Images from various sources including Gravatar and WordPress

### Local Content
- User-generated media requests
- Procurement documents and announcements
- Profile images and campaign assets

## Special Functionality

### Text-to-Speech
Integrated Azure Cognitive Services for Thai language text-to-speech conversion, particularly useful for blog content accessibility.

### Image Optimization
Uses Next.js Image component with optimized loading for external sources including WordPress and Gravatar.

### Responsive Design
Mobile-first approach with Tailwind CSS responsive utilities and DaisyUI component system.

## Deployment Notes
- Uses Express.js server for production with static file serving
- Configured for MAMP local development environment
- Images served from `/images` and `/img` static routes
- Port configuration defaults to 3000

## Recent Development Activity
Based on recent commits:
- Button improvements and fixes
- New carousel implementation
- Azure API text-to-speech integration
- Design updates for Home 2025
- Various UI/UX enhancements

## Thai Language Support
The application is primarily in Thai language with:
- Thai content management
- Thai text-to-speech capabilities
- Thailand-specific data (provinces, regions)
- Thai cultural context (Buddhist campaigns, local awareness)

## Security Considerations
- Password hashing with bcryptjs
- NextAuth.js for secure authentication
- Role-based access control
- File upload security measures
- Reset token expiration handling