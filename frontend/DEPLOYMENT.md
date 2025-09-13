# Production Deployment Guide

This guide covers the secure deployment of the AI Customer Support Chatbot SaaS platform.

## Prerequisites

- Node.js 18+ 
- Supabase project setup
- Stripe account with API keys
- Domain with SSL certificate
- CDN setup (recommended)

## Environment Variables

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
CSRF_SECRET=your_csrf_secret

# Optional: External Services
OPENAI_API_KEY=your_openai_api_key (if using OpenAI)
GEMINI_API_KEY=your_gemini_api_key (if using Google Gemini)
```

### Environment Variable Validation

The application validates required environment variables on startup. Missing variables will prevent the application from starting.

## Database Setup

### 1. Supabase Database Schema

Run the SQL commands in `src/lib/database-schema.sql` in your Supabase SQL editor:

```sql
-- Run all commands from database-schema.sql
```

### 2. Storage Bucket Setup

In Supabase Dashboard > Storage:

1. Create a new bucket called `knowledge-base`
2. Set it to private (not public)
3. Configure storage policies:

```sql
-- Allow users to upload files to their own folder
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Row Level Security (RLS)

Ensure RLS is enabled on all tables:

- `knowledge_files`
- `bot_configurations`
- `analytics_data`
- `user_subscriptions`
- `usage_tracking`

## Stripe Setup

### 1. Create Products and Prices

In Stripe Dashboard:

1. Create products for each plan (Starter, Professional, Enterprise)
2. Create recurring prices for each product
3. Update the price IDs in `src/lib/stripe-client.ts`

### 2. Webhook Configuration

1. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
2. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Security Checklist

### SSL/TLS Configuration
- [ ] SSL certificate installed and configured
- [ ] HTTPS redirect enabled
- [ ] HSTS headers configured
- [ ] TLS 1.2+ enforced

### Headers Security
- [ ] Content Security Policy configured
- [ ] X-Frame-Options set to DENY
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-XSS-Protection enabled
- [ ] Referrer-Policy configured

### Authentication & Authorization
- [ ] Supabase RLS enabled on all tables
- [ ] Session timeout configured
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] API keys secured in environment variables
- [ ] File upload validation implemented
- [ ] Input sanitization in place

## Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Test the build locally
npm start
```

### 2. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### 3. Alternative: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t botai-frontend .
docker run -p 3000:3000 --env-file .env.local botai-frontend
```

## Post-Deployment

### 1. Health Checks

Set up monitoring for:
- Application uptime
- Database connectivity
- Stripe webhook delivery
- File upload functionality

### 2. Performance Monitoring

Monitor:
- Page load times
- API response times
- Database query performance
- CDN cache hit rates

### 3. Security Monitoring

Monitor for:
- Failed login attempts
- Rate limit violations
- Unusual API usage patterns
- File upload attempts

### 4. Backup Strategy

- Database backups (Supabase handles this automatically)
- Configuration backups
- SSL certificate renewal monitoring

## Scaling Considerations

### Database Scaling
- Monitor connection pool usage
- Consider read replicas for heavy read operations
- Implement connection pooling

### File Storage
- Monitor storage usage and costs
- Implement file cleanup for deleted accounts
- Consider CDN for file delivery

### Rate Limiting
- Implement distributed rate limiting with Redis
- Monitor API usage patterns
- Adjust limits based on user feedback

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Verify `.env.local` file location
   - Check for typos in variable names
   - Ensure no trailing spaces in values

2. **Supabase Connection Issues**
   - Verify URL and anon key
   - Check RLS policies
   - Confirm user permissions

3. **Stripe Webhook Failures**
   - Verify webhook endpoint URL
   - Check webhook secret
   - Monitor webhook logs in Stripe dashboard

4. **File Upload Issues**
   - Check storage bucket permissions
   - Verify file size limits
   - Monitor storage quota

## Security Incident Response

1. **Immediate Actions**
   - Identify and isolate affected systems
   - Change compromised credentials
   - Enable additional monitoring

2. **Investigation**
   - Review access logs
   - Check for data exfiltration
   - Document the incident

3. **Recovery**
   - Apply security patches
   - Update security policies
   - Communicate with affected users

4. **Prevention**
   - Conduct security review
   - Update incident response procedures
   - Implement additional safeguards

## Monitoring and Alerts

### Application Metrics
- Response times
- Error rates
- User engagement
- Conversion rates

### Infrastructure Metrics
- CPU and memory usage
- Database performance
- Storage usage
- Network latency

### Security Alerts
- Multiple failed login attempts
- Suspicious API usage
- Rate limit violations
- Unusual file upload patterns

## Compliance

### GDPR Compliance
- User data deletion procedures
- Data export functionality  
- Privacy policy updates
- Cookie consent management

### SOC 2 Preparation
- Access control documentation
- Security policy implementation
- Audit trail maintenance
- Incident response procedures