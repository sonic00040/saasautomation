# BotAI - AI-Powered Chatbot Platform

> Intelligent chatbot platform for Telegram and WhatsApp with subscription-based token usage tracking.

[![Deployment Ready](https://img.shields.io/badge/Deployment-Ready-brightgreen)]()
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)]()
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-3ECF8E)]()

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- Python 3.12+
- Supabase account
- Google AI API key (for Gemini)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd botai
   ```

2. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   npm run dev
   ```

3. **Set up Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your API keys
   uvicorn main:app --reload
   ```

4. **Set up Database**
   - Go to Supabase Dashboard > SQL Editor
   - Run `supabase-schema.sql`
   - Run `supabase-functions.sql`
   - Run `supabase-rls.sql`

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for Vercel & Railway
- **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** - All fixes applied for production readiness

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- Next.js 15.5.2 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Auth
- React Query

**Backend**:
- FastAPI (Python)
- Supabase (PostgreSQL)
- Google Gemini AI
- Redis (optional, for rate limiting)

**Database**:
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions

## ✨ Features

### Core Features
- ✅ User authentication (Supabase Auth)
- ✅ Platform-locked subscriptions (Telegram/WhatsApp)
- ✅ AI-powered chatbot responses (Google Gemini)
- ✅ Token usage tracking and limits
- ✅ Knowledge base management
- ✅ Real-time dashboard updates
- ✅ Multi-bot support per company

### Subscription System
- **Free Plan**: 1,000 tokens/month (30-day trial)
- **Pro Plan**: 10,000 tokens/month
- **Enterprise Plan**: 50,000 tokens/month
- Platform-locked during billing cycle
- Automatic usage tracking
- Upgrade/downgrade support

### Bot Integration
- ✅ **Telegram**: Full integration with webhook support
- ⏳ **WhatsApp**: UI ready, backend placeholder

### Security
- ✅ Row Level Security (RLS) on all tables
- ✅ Environment variable management
- ✅ CORS configuration
- ✅ Rate limiting (with Redis)
- ✅ Webhook secret validation

## 🗂️ Project Structure

```
botai/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities
│   ├── .env.local           # Frontend env vars
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI app
│   ├── services.py         # Business logic
│   ├── config.py           # Configuration
│   ├── database.py         # Supabase client
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile           # Railway/Heroku config
│   ├── railway.json       # Railway config
│   └── render.yaml        # Render config
│
├── supabase-schema.sql     # Database schema
├── supabase-functions.sql  # Database functions
├── supabase-rls.sql       # Security policies
│
├── DEPLOYMENT.md          # Deployment guide
├── FIXES_SUMMARY.md       # Production fixes
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
```

**Backend** (`.env`):
```bash
ENVIRONMENT=development
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
GOOGLE_API_KEY=your_google_api_key
TELEGRAM_WEBHOOK_SECRET=your_secret
REDIS_URL=redis://localhost:6379
```

## 🚀 Deployment

### Recommended Stack:
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway ($5/mo)
- **Database**: Supabase (Free tier)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy:

**Frontend (Vercel)**:
```bash
cd frontend
vercel --prod
```

**Backend (Railway)**:
1. Go to https://railway.app
2. Import GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

## 📊 Database Schema

### Core Tables:
- `companies` - User organizations
- `plans` - Subscription plans
- `subscriptions` - User subscriptions
- `bots` - Bot configurations
- `conversations` - Message tracking
- `activities` - Activity logs
- `knowledge_bases` - Bot knowledge
- `usage_logs` - Token usage

### Key Features:
- Platform enforcement (trigger-based)
- Automatic updated_at timestamps
- RLS policies for multi-tenancy
- Realtime subscriptions

## 🧪 Testing

### Test User Flow:

1. **Sign Up** → Creates user account
2. **Onboarding** → Creates company, bot, subscription
3. **Dashboard** → View bots and usage
4. **Create Bot** → Add Telegram bot
5. **Test Bot** → Send message, get AI response
6. **Upgrade** → Change subscription plan

### Test Bot Locally:

```bash
# Start backend
cd backend
uvicorn main:app --reload

# Use ngrok to expose local backend
ngrok http 8000

# Set Telegram webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-ngrok-url.ngrok.io/webhook/<TOKEN>"
```

## 🐛 Troubleshooting

### Build Errors
```bash
cd frontend
npm run build
```
If errors occur, check:
- TypeScript errors in console
- Missing environment variables
- Import statement issues

### Database Issues
- Verify all SQL scripts executed
- Check RLS policies are enabled
- Ensure plans table has data

### Bot Not Responding
- Check backend logs
- Verify webhook is set
- Check Telegram webhook info:
  ```bash
  curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
  ```

## 🔐 Security

- All environment variables use placeholders in templates
- RLS enabled on all database tables
- CORS configured for production
- Rate limiting with Redis
- Webhook secret validation
- HTTPS enforced in production

## 📈 Roadmap

### Implemented ✅
- User authentication
- Telegram bot integration
- Token usage tracking
- Subscription management
- Knowledge base system
- Real-time dashboard

### Pending ⏳
- WhatsApp bot integration
- Payment gateway (Stripe)
- Multi-language support
- Advanced analytics
- Team collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: See `/docs` folder
- Issues: GitHub Issues
- Deployment Help: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Built with ❤️ using Next.js, FastAPI, and Supabase**

🚀 **Ready to deploy!** Follow [DEPLOYMENT.md](DEPLOYMENT.md) to get started.
