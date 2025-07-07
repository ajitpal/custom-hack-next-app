# ShopAI - Personalized E-commerce Shopping Assistant

## 🛍️ Overview

ShopAI is a comprehensive e-commerce platform that delivers personalized shopping experiences through AI-powered recommendations, adaptive UI, dynamic pricing, and accessibility features. Built with Next.js and integrated with multiple modern services.

## ✨ Key Features

- **🤖 AI-Powered Recommendations**: Intelligent product suggestions based on user behavior and preferences
- **🎨 Adaptive UI**: Dynamic interface that adjusts based on user personas and accessibility needs
- **💰 Dynamic Pricing**: Real-time price adjustments based on loyalty, demographics, and trends
- **🌍 Real-time Localization**: Multi-language support with instant translation
- **♿ Accessibility First**: Comprehensive accessibility features and high-contrast themes
- **💬 Conversational Shopping**: AI chat assistant for natural shopping interactions
- **📊 Persona-Based Experience**: Different user types get tailored experiences

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Prisma** - Database ORM

### Integrated Services
- **[Lingo.dev](https://lingo.dev)** - Real-time localization and translation
- **[Tambo.co](https://tambo.co)** - Conversational AI for shopping assistance
- **[Autumn](https://useautumn.com/)** - Dynamic pricing and feature gating
- **[Better Auth](https://better-auth.com/)** - Advanced authentication
- **[Supabase](https://supabase.com/)** - Database and real-time features
- **[Resend](https://resend.com/)** - Transactional emails
- **[Firecrawl](https://firecrawl.dev/)** - Web scraping for product data
- **[Magic UI](https://magicui.design/)** - Beautiful UI components

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account and database
- API keys for integrated services

### Installation

1. **Clone and install dependencies:**

```bash
git clone [repository-url]
cd custom-hack-next-app
pnpm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Fill in your API keys and database connection strings.

3. **Initialize the database:**

```bash
pnpm run setup
```

This will generate Prisma client, run migrations, and seed the database with sample data.

4. **Start the development server:**

```bash
pnpm dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** to see the application.

## 🎭 User Personas

The application supports multiple user personas with different experiences:

### Tech Enthusiast
- **Preferences**: Electronics, Gaming, Latest gadgets
- **UI**: Dark theme, medium fonts
- **Budget**: $100-$2000
- **Behavior**: Weekly shopping, high-value orders

### Accessibility Focused
- **Preferences**: Books, Health & Beauty
- **UI**: High contrast, large fonts, reduced motion
- **Budget**: $20-$200  
- **Behavior**: Monthly shopping, screen reader support

### Budget Conscious
- **Preferences**: Clothing, Books, Home goods
- **UI**: Light theme, standard fonts
- **Budget**: $5-$100
- **Behavior**: Occasional shopping, deal-focused

## 🚀 Key Features Deep Dive

### Intelligent Recommendations
- Behavior-based suggestions from user activity logs
- Demographic targeting using signup data
- Cold start solutions for new users
- Real-time trending product integration

### Adaptive User Interface
- Theme switching (Light/Dark/High Contrast)
- Font size adjustment (Small/Medium/Large)
- Accessibility options (Screen reader, reduced motion)
- Persona-based layout changes

### Dynamic Pricing System
- Loyalty tier discounts (Bronze/Silver/Gold)
- Accessibility support discounts
- Time-based promotional pricing
- Regional price adjustments

### Conversational Shopping
- Natural language product search
- AI-powered shopping assistance
- Context-aware recommendations
- Multi-language conversation support

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── auth/               # Authentication pages
│   ├── shop/               # Shopping interface
│   ├── dashboard/          # User dashboard
│   └── api/                # API routes
├── components/             # React components
│   ├── ecommerce/         # Shopping-specific components
│   ├── tambo/             # AI chat components
│   ├── auth/              # Authentication components
│   └── common/            # Shared components
├── contexts/              # React contexts
├── lib/                   # Utilities and configurations
└── scripts/               # Database seeding scripts
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm run setup        # Initialize database (generate + migrate + seed)
pnpm run db:generate  # Generate Prisma client
pnpm run db:migrate   # Run database migrations
pnpm run db:seed      # Seed with sample data
pnpm run db:reset     # Reset database
```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-direct-connection-string"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Services
LINGODOTDEV_API_KEY="your-lingo-api-key"
NEXT_PUBLIC_TAMBO_API_KEY="your-tambo-api-key"
AUTUMN_SECRET_KEY="your-autumn-api-key"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="your-sender-email"
FIRECRAWL_API_KEY="your-firecrawl-api-key"
```

## 🎯 Usage Examples

### User Journey - New User
1. Sign up and complete onboarding questionnaire
2. Receive AI-powered welcome recommendations
3. Browse with personalized filters and pricing
4. Chat with AI assistant for product discovery
5. Experience adaptive UI based on preferences

### User Journey - Returning User  
1. Login with personalized dashboard
2. View activity history and recommendations
3. Continue shopping with learned preferences
4. Receive loyalty-based dynamic pricing
5. Get contextual email communications

## 🔗 Service Integration Details

### Lingo.dev

AI localization for teams who ship fast. Translate apps, websites, and entire databases using the best LLM models.

- https://lingo.dev

Set your Lingo.dev API key as `LINGODOTDEV_API_KEY` (or login via `npx lingo.dev@latest login`) to use Compiler and CLI.

#### Compiler

Next.js application is localized using Lingo.dev Compiler.

- https://lingo.dev/en/compiler/frameworks/nextjs

#### CLI

Resend email templates are localized via Lingo.dev CLI.

- https://lingo.dev/en/cli

To localize templates tun `npx lingo.dev@latest run`.

### Autumn

The most simple and flexible way to setup payments.

- https://useautumn.com/
- [Sign up via this link](https://app.useautumn.com/sign-in?token=2zMnk448D3OFlXKsL9SBdj3609w) to auto create sample free and pro tiers in your Autumn sandbox.
- Paste in [Stripe test secret key](https://dashboard.stripe.com/test/apikeys) to your Autumn account on [this page](https://app.useautumn.com/sandbox/onboarding)
- Create your Autumn API key [in your account here](https://app.useautumn.com/sandbox/dev)

Set your API key as `AUTUMN_SECRET_KEY` env variable.

### Tambo

Add React components to your AI assistant, copilot, or agent.

- https://tambo.co/
- https://tambo.co/docs

Set your Tambo API key as `NEXT_PUBLIC_TAMBO_API_KEY` env variable. [The `NEXT_PUBLIC_` prefix makes it available client-side in browser.](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser)

**Use Tambo with BetterAuth** (`src/app/tambo/auth/page.tsx`):

```typescript
// Check session and get Google ID token
const { data: session } = useSession();
const token = await getAccessToken({ providerId: "google" });

// Pass idToken to Tambo as userToken
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  userToken={token.data?.idToken}
>
  <MessageThreadFull />
</TamboProvider>
```

### BetterAuth

The most comprehensive authentication framework for TypeScript.

- http://better-auth.com/
- http://better-auth.com/docs

Set the following env vars:

- secret key as `BETTER_AUTH_SECRET`
- base url as `BETTER_AUTH_URL`

### Supabase: Database Sync & Management via Prisma

After editing your Prisma schema (`prisma/schema.prisma` file) or on first setup, run:

```bash
# Run a new migration and apply it to your database
npx prisma migrate dev --name <migration-name>

# Generate the Prisma client (usually done automatically by migrate)
npx prisma generate
```

Set database connection string as `DATABASE_URL` and `DIRECT_URL` env vars (in Supabase, choose _Connect -> ORMs -> Prisma_)

For more details on Prisma, see:

- https://www.prisma.io/
- https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma

You can setup a Supabase database and lear about it here:

- https://supabase.com/
- https://supabase.com/docs/guides/database/overview

### Resend

Email for developers

- https://resend.com/
- https://resend.com/docs/send-with-nextjs

Set your API key as `RESEND_API_KEY` and sender email as `RESEND_FROM_EMAIL` env variables. Make sure you have the sender domain correctly configured in your Resend account.

### Firecrawl

Web scraping for devs & agents

- https://www.firecrawl.dev/
- https://docs.firecrawl.dev/

Set your API key as `FIRECRAWL_API_KEY` env variable.

### MagicUI

UI library for Design Engineers

- https://magicui.design/
- https://magicui.design/docs/components

## 🧪 Testing

### User Personas Testing
1. Use the persona switcher in the top navigation
2. Switch between different personas to see:
   - UI theme and font size changes
   - Different product recommendations
   - Adjusted pricing and discounts
   - Accessibility features activation

### AI Chat Testing
1. Visit `/tambo` for general chat
2. Visit `/tambo/auth` for authenticated chat
3. Try queries like:
   - "Show me electronics under $500"
   - "I need running shoes"
   - "What's trending in books?"

### API Testing
- Health check: `GET /api/health`
- Products: `GET /api/products?category=Electronics`
- Recommendations: `GET /api/products/recommendations`
- Cart: `POST /api/cart` with `{productId, quantity}`

## 🚨 Troubleshooting

### Database Issues
- Run `pnpm run db:reset` to reset database
- Check Supabase connection strings
- Ensure proper environment variables

### Service Integration Issues
- Verify all API keys are correctly set
- Check service-specific documentation for setup

### Next.js

The React Framework for the Web

- https://nextjs.org/docs
- https://nextjs.org/learn

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review service documentation
- Open an issue in the repository

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

When deploying make sure to populate all environment variables and set up your database.