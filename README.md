# Orten SaaS Platform

منصة إدارة سيرفرات Discord الاحترافية - Professional Discord Server Management Platform

## Features / المميزات

### 🔐 Discord OAuth2 Login
- Login exclusively via Discord OAuth2
- Scopes: `identify`, `guilds`, `guilds.join`
- Auto-filters servers where user has Admin permissions
- Bot presence check with "Add Bot" / "Dashboard" buttons

### 📋 User Dashboard (لوحة تحكم العميل)
- **Templates (القوالب)**: Apply ready-made server structures (Store, Gaming, Community, Support) with one click - creates channels, categories, and roles
- **Plugins (الإضافات)**: Toggle switches for Tickets, Levels, Protection, and Invites systems
- **Branding (التخصيص)**: White-label bot name/avatar and channel name font styles (Premium subscribers only)

### 🛡️ Admin Panel (لوحة تحكم الإدارة)
- **Promo Codes (أكواد الخصم)**: Create discount codes with percentage, max uses, and expiry date
- **Subscribers (المشتركين)**: Search users by Discord ID, manually activate Elite/Premium plans

### 💳 Stripe Integration
- Automated subscription management (Free, Elite, Premium plans)
- Webhook handling for payment events
- Auto-revoke features on subscription cancellation

### 🌐 Bilingual Support (دعم اللغات)
- Full Arabic (RTL) and English (LTR) support
- Runtime language switching

### 🎨 Cyber-Tech Neon Design
- Dark theme with neon accent colors
- Framer Motion animations throughout
- Glass-morphism effects and neon glow

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Auth**: NextAuth.js v4 with Discord Provider
- **Database**: SQLite with Prisma ORM
- **Payments**: Stripe
- **Bot**: Discord.js API integration

## Setup / الإعداد

### Prerequisites
- Node.js 18+
- Discord Application (Bot + OAuth2)
- Stripe Account

### Installation

```bash
# Clone the repo
git clone https://github.com/OrtenStore/Orten-Web.git
cd Orten-Web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
# - DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
# - ADMIN_DISCORD_ID (your Discord user ID)

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Discord Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Copy Client ID and Client Secret to `.env`
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Enable Bot and copy Bot Token to `.env`
6. Enable required intents (Server Members, Message Content)

### Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Copy API keys to `.env`
3. Create products for Elite and Premium plans
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
5. Copy webhook secret to `.env`

## Project Structure

```
src/
├── app/
│   ├── (admin)/admin/        # Admin panel pages
│   ├── (auth)/login/         # Login page
│   ├── (dashboard)/dashboard/# User dashboard pages
│   ├── api/                  # API routes
│   └── page.tsx              # Landing page
├── components/
│   ├── layout/               # Navbar, Sidebar, Providers
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client
│   ├── discord.ts            # Discord API utilities
│   ├── i18n.ts               # Internationalization
│   ├── stripe.ts             # Stripe configuration
│   └── templates.ts          # Server templates
└── types/
    └── next-auth.d.ts        # NextAuth type extensions
```
