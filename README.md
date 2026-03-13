# NexusAI — The Ultimate AI Productivity Suite

NexusAI is a powerful, production-ready SaaS platform that integrates multiple AI-driven tools into a single, sleek dashboard. Built with Next.js 15, Supabase, and Stripe, it's designed to streamline workflows for students, professionals, and developers.

![NexusAI Dashboard](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000)

## 🚀 Key Features

### 🛠 Specialized AI Tools
- **YouTube Summarizer**: Get instant summaries, key takeaways, and timestamps from any video.
- **AI Job Search**: Integrated web scraping for real-time job matching and bookmarking.
- **Document Analysis**: Upload PDFs/Docs for AI-powered insights and extraction.
- **Meeting Notes AI**: Transform raw transcripts into structured action items and decisions.
- **Resume Builder**: Professional editor with AI-powered metric enhancement and PDF export.
- **Custom Workflows**: A visual builder to orchestrate multi-step AI tasks.

### 💼 SaaS Infrastructure
- **Authentication**: Secure Google OAuth and Email login via Supabase.
- **Credit System**: Automated usage tracking and credit deduction per task.
- **Personalized Dashboard**: Real-time stats and activity tracking.
- **Billing & Subscriptions**: Tiered plans integrated with Stripe Checkout and Webhooks.
- **Zero-Config Demo Mode**: Experience the platform instantly even without backend keys.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion
- **Backend/Auth**: Supabase (PostgreSQL, Auth, RLS)
- **AI Engine**: OpenAI (GPT-4o / GPT-4o-mini)
- **Web Scraping**: Firecrawl
- **Payments**: Stripe Checkout & Webhooks
- **Deployment**: Optimized for Vercel

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- A Supabase Project
- API Keys for OpenAI and Firecrawl

### 2. Installation
```bash
git clone https://github.com/your-username/nexus-ai-suite.git
cd nexus-ai-suite
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root and add your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
STRIPE_SECRET_KEY=your-stripe-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Run the SQL found in `supabase_schema.sql` inside your Supabase SQL Editor.

### 5. Running Locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to see your app in action.

## 📁 Project Structure
- `/src/app`: Next.js App Router (Routes & Layouts)
- `/src/components`: UI Design System & Dashboard Views
- `/src/context`: Auth & Global State Management
- `/src/lib`: Core API integrations (OpenAI, Stripe, Firecrawl)
- `/src/api`: Backend logic for credits and data persistence

---
Developed with ❤️ by [Your Name]
