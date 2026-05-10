# Aesther AI — AI-Powered Chatbot SaaS for Businesses

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=flat-square&logo=openai)
![Stripe](https://img.shields.io/badge/Stripe-Connect-635BFF?style=flat-square&logo=stripe)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)
![Pusher](https://img.shields.io/badge/Pusher-Realtime-300D4F?style=flat-square&logo=pusher)

## Overview

Aesther AI is a multi-tenant SaaS platform that lets businesses deploy AI-powered chatbots on their websites in minutes. Each business registers domains, configures a custom chatbot with GPT-3.5-turbo, and can monitor — or live-take-over — customer conversations in real time. The platform handles the full customer journey: lead capture via chat, appointment scheduling, and in-chat product payments through Stripe Connect. Tiered subscription plans (Standard / Pro / Ultimate) gate how many domains and email credits each account can use.

## Key Features

- **AI Chatbot per Domain** — GPT-3.5-turbo drives each chatbot with a configurable welcome message, icon, colors, and a set of qualifying filter questions the AI works through naturally
- **Real-time Chat Takeover** — Business owners monitor live conversations via Pusher WebSockets and can flip any chat to "live mode," instantly taking over from the AI; a one-shot email notification fires the first time a chat goes live
- **Customer Lead Qualification** — The AI extracts customer email addresses from conversation, creates a customer record, and walks through domain-specific filter questions, recording every answer to the database
- **Appointment Booking Portal** — Time-slot based booking at `/portal/[domainid]/appointment/[customerid]`; the AI drops the link automatically when a customer asks to book
- **In-Chat Product Payments** — Stripe payment intents created on behalf of connected merchant accounts; customers complete checkout at `/portal/[domainid]/payment/[customerid]`
- **Stripe Connect Onboarding** — Fully automated merchant account creation and onboarding flow via `/api/stripe/connect`
- **Email Marketing Campaigns** — Bulk email sender (Gmail SMTP via Nodemailer) with HTML templates, customer segmentation, and a credit-based quota system (Standard: 10 / Pro: 50 / Ultimate: 500 emails/month)
- **HelpDesk Q&A** — Owners pre-load question/answer pairs the chatbot can reference
- **File Uploads** — UploadCare handles chatbot icon and domain icon uploads with CDN delivery via `ucarecdn.com`
- **Tiered Billing** — STANDARD (free, 1 domain), PRO ($15/mo, 5 domains), ULTIMATE ($35/mo, 10 domains); plan upgrades processed via Stripe payment intents

## Architecture

```
Browser
  │
  ├── Next.js 14 App Router (React Server Components + Server Actions)
  │     ├── Public routes: /  /auth/*  /portal/*  /chatbot  /blogs/*
  │     ├── Protected routes: /dashboard  /conversation  /appointment
  │     │                     /email-marketing  /integration  /settings/*
  │     └── API route: /api/stripe/connect  (GET — Stripe Connect onboarding)
  │
  ├── Server Actions (src/actions/*)
  │     ├── auth        — user registration + login via Clerk
  │     ├── bot         — OpenAI completions, customer creation, message storage
  │     ├── conversation — Pusher trigger, chat room CRUD, read receipts
  │     ├── settings    — domain CRUD, chatbot config, helpdesk, filter questions
  │     ├── stripe      — payment intent creation, subscription management
  │     ├── dashboard   — balance, transaction, client count aggregation
  │     ├── mail        — bulk email send + campaign management
  │     ├── mailer      — single notification email (live chat alert)
  │     ├── payments    — customer product payment intents
  │     └── appointment — booking creation, time-slot management
  │
  ├── Clerk        — authentication, session management, password updates
  ├── Pusher       — WebSocket channels for real-time chat delivery
  ├── OpenAI       — GPT-3.5-turbo completions (sales + lead qualification personas)
  ├── Stripe       — Connect marketplace, payment intents, subscription billing
  ├── UploadCare   — CDN file uploads for chatbot/domain icons
  ├── Nodemailer   — Gmail SMTP for bulk marketing emails + live-chat notifications
  └── MongoDB Atlas ← Prisma ORM
        Models: User · Domain · ChatBot · ChatRoom · ChatMessage
                Customer · CustomerResponses · FilterQuestions · HelpDesk
                Bookings · Campaign · Product · Billings
```

**Data flow — chatbot conversation:**
1. Customer visits a business's website (chatbot embedded via `/chatbot` route)
2. `onAiChatBotAssistant` server action receives message, queries domain config from MongoDB
3. If no email yet: GPT-3.5-turbo (sales persona) steers conversation toward capturing email
4. Once email captured: new `Customer` record created, filter questions assigned
5. GPT-3.5-turbo (qualification persona) works through filter questions; answers persisted per response
6. On appointment/payment intent: AI generates portal link and hands it off
7. If AI detects out-of-scope input: chat room flipped to `live: true`, Pusher event fired, owner notified by email (once per chat)
8. Owner can reply directly through the dashboard; messages delivered via Pusher to the customer in real time

## Tech Stack

**Frontend**
- Next.js 14 (App Router, React Server Components)
- React 18, TypeScript 5
- Tailwind CSS 3, tailwind-merge, tailwindcss-animate
- Radix UI (complete primitives: accordion, dialog, dropdown, tabs, tooltip, etc.)
- shadcn/ui component system (`components.json` present)
- React Hook Form + Zod (schema validation)
- Embla Carousel, React Day Picker, input-otp, Vaul (drawer)
- next-themes (dark/light mode), Sonner (toasts), Lucide React (icons)
- Plus Jakarta Sans (Google Fonts)

**Backend / Runtime**
- Next.js Server Actions (full-stack, no separate API server)
- Prisma 5 ORM with MongoDB Atlas

**External Services**
- **Auth**: Clerk (`@clerk/nextjs` 4.29)
- **AI**: OpenAI SDK 4.47 — `gpt-3.5-turbo`
- **Realtime**: Pusher Server 5.2 + Pusher JS 8.4
- **Payments**: Stripe 15.8 + `@stripe/react-stripe-js` 2.7
- **File Uploads**: UploadCare Blocks 0.40
- **Email**: Nodemailer 6.9 (Gmail SMTP)
- **HTTP**: Axios 1.7

## Project Structure

```
aesther-ai/
├── prisma/
│   └── schema.prisma          # MongoDB data models (12 models, 2 enums)
├── public/
│   ├── images/                # Landing page, UI screenshots, logo assets
│   ├── blogimages/            # Blog post hero images
│   └── icons/                 # SVG icons (dashboard navigation)
├── src/
│   ├── actions/               # Next.js Server Actions (all business logic)
│   │   ├── auth/              # User registration + login
│   │   ├── bot/               # AI chatbot logic + OpenAI integration
│   │   ├── conversation/      # Chat room management + Pusher real-time
│   │   ├── dashboard/         # Analytics aggregation + Stripe balance
│   │   ├── mail/              # Email marketing campaigns
│   │   ├── mailer/            # Transactional email (live chat notifications)
│   │   ├── payments/          # Customer product payment intents
│   │   ├── appointment/       # Booking creation and retrieval
│   │   ├── settings/          # Domain, chatbot, helpdesk, filter Q management
│   │   ├── stripe/            # Subscription + payment intent creation
│   │   └── landing/           # Blog post fetching (Cloudways/WP REST API)
│   ├── app/
│   │   ├── (dashboard)/       # Protected layout group
│   │   │   ├── dashboard/     # Analytics dashboard page
│   │   │   ├── conversation/  # Chat monitoring + live takeover UI
│   │   │   ├── appointment/   # Booking management page
│   │   │   ├── email-marketing/ # Campaign builder + bulk sender
│   │   │   ├── integration/   # Domain onboarding
│   │   │   └── settings/      # Account + per-domain settings
│   │   ├── api/stripe/connect/ # Stripe Connect onboarding endpoint
│   │   ├── auth/              # Sign-in / sign-up pages (Clerk)
│   │   ├── blogs/[id]/        # Individual blog post page
│   │   ├── chatbot/           # Embeddable chatbot widget (public)
│   │   ├── portal/[domainid]/ # Customer-facing booking + payment portals
│   │   ├── layout.tsx         # Root layout (Clerk + ThemeProvider + Toaster)
│   │   └── page.tsx           # Landing page
│   ├── components/            # UI component library
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── forms/             # Auth, settings, portal form components
│   │   ├── chatbot/           # Chatbot widget UI
│   │   ├── conversations/     # Conversation list + message UI
│   │   ├── dashboard/         # Metric cards and charts
│   │   ├── email-marketing/   # Campaign builder components
│   │   ├── appointment/       # Booking calendar components
│   │   ├── settings/          # Domain and chatbot config components
│   │   ├── sidebar/           # Dashboard navigation sidebar
│   │   └── ...                # (navbar, modal, drawer, table, etc.)
│   ├── constants/             # Static data (pricing, menu items, form fields)
│   ├── context/               # React context (theme, auth, sidebar, chat)
│   ├── hooks/                 # Custom React hooks per feature domain
│   ├── icons/                 # React SVG icon components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # cn(), Pusher client/server init, string helpers
│   ├── middleware.ts           # Clerk auth middleware (public/protected routes)
│   └── schemas/               # Zod validation schemas (auth, conversation, etc.)
├── .env.example               # Template — copy to .env and fill in values
├── .gitignore
├── components.json            # shadcn/ui config
├── next.config.mjs            # Next.js config (UploadCare CDN remote patterns)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.x
- A MongoDB Atlas cluster (free tier works)
- Accounts on: Clerk, OpenAI, Pusher, Stripe, UploadCare
- Gmail account with App Passwords enabled (for email campaigns)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd aesther-ai

# 2. Install dependencies (project uses Bun lockfile)
bun install
# or: npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in every value in .env (see table below)

# 4. Generate the Prisma client
npx prisma generate

# 5. (Optional) Push schema to your MongoDB Atlas database
npx prisma db push
```

### Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `NODE_MAILER_EMAIL` | Gmail address used to send marketing emails | Your Gmail account |
| `NODE_MAILER_GMAIL_APP_PASSWORD` | Gmail App Password (not your account password) | Google Account → Security → App Passwords |
| `NEXT_PUBLIC_PUSHER_APP_ID` | Pusher Channels App ID | [pusher.com](https://pusher.com) → Your App → App Keys |
| `NEXT_PUBLIC_PUSHER_APP_KEY` | Pusher public key (used client-side) | Pusher dashboard |
| `NEXT_PUBLIC_PUSHER_APP_SECRET` | Pusher secret (used server-side) | Pusher dashboard |
| `NEXT_PUBLIC_PUSHER_APP_CLUSTOR` | Pusher cluster region (e.g. `ap2`) | Pusher dashboard |
| `OPEN_AI_KEY` | OpenAI API key for GPT-3.5-turbo completions | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY` | UploadCare public key (client uploads) | [app.uploadcare.com](https://app.uploadcare.com) → API Keys |
| `UPLOAD_CARE_SECRET_KEY` | UploadCare secret key (server operations) | UploadCare dashboard |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (client-side auth) | [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side auth) | Clerk dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in redirect path | Set to `/auth/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up redirect path | Set to `/auth/sign-up` |
| `STRIPE_SECRET` | Stripe secret key (server-side) | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISH_KEY` | Stripe publishable key (client-side) | Stripe dashboard |
| `DATABASE_URL` | MongoDB Atlas connection string with credentials | Atlas → Connect → Drivers |
| `CLOUDWAYS_POSTS_URL` | WordPress REST API posts endpoint (optional blog) | Your Cloudways WordPress instance |
| `CLOUDWAYS_FEATURED_IMAGES_URL` | WP REST API media endpoint | Cloudways WordPress |
| `CLOUDWAYS_UPLOADS_URL` | WP uploads base URL | Cloudways WordPress |
| `CLOUDWAYS_USERS_URL` | WP REST API users endpoint | Cloudways WordPress |

### Running the Project

```bash
# Development server (hot reload)
bun dev
# or: npm run dev

# Production build
bun run build
bun run start
# or: npm run build && npm start

# Lint
bun run lint
```

The app runs at [http://localhost:3000](http://localhost:3000).

## API Endpoints

The application is primarily built on **Next.js Server Actions** (not REST endpoints). The single REST API route is:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/stripe/connect` | Creates a Stripe Connect custom account, fully onboards it with test data, saves the `stripeId` to the authenticated user, and returns a Stripe Account Link URL for the onboarding flow |

**Public portal routes** (no auth required, customer-facing):

| Path | Description |
|---|---|
| `/portal/[domainid]/appointment/[customerid]` | Time-slot appointment booking form for a customer of a specific domain |
| `/portal/[domainid]/payment/[customerid]` | Stripe payment form for a customer purchasing a product from a domain |
| `/chatbot` | Embeddable chatbot widget (loaded inside an iframe on the merchant's website) |

## Status

**Working:**
- Full authentication flow (Clerk sign-up / sign-in / OTP)
- Domain registration and management (per-plan limits enforced)
- Chatbot configuration (welcome message, icon, colors, helpdesk, filter questions)
- AI chatbot conversations (OpenAI GPT-3.5-turbo)
- Real-time chat monitoring and owner takeover (Pusher)
- Customer lead capture and qualification
- Appointment booking portal
- Product catalog and Stripe payment portal
- Stripe Connect onboarding
- Subscription plan management
- Email marketing campaign builder and bulk sender
- Dashboard analytics (client count, balance, transactions, product totals)

**Hardcoded / In Progress:**
- Stripe Connect onboarding uses placeholder test data (cookie company details at [src/app/api/stripe/connect/route.ts:35-99](src/app/api/stripe/connect/route.ts#L35-L99)) — needs to be replaced with real merchant input
- Stripe callback URLs are hardcoded to `http://localhost:3000` — needs environment-based configuration for production
- Blog feature requires a Cloudways-hosted WordPress backend (Cloudways env vars)
- AI model is hardcoded to `gpt-3.5-turbo` — no model selection UI yet
