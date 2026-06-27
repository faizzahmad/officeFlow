\newpage

# CHAPTER 12
# DEPLOYMENT & INSTALLATION

## 12.1 Introduction

This chapter provides step-by-step instructions for setting up the development environment, configuring external services, and deploying Office Flow to production.

## 12.2 System Requirements

### 12.2.1 Development Machine

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Operating System | Windows 10, macOS 12, Ubuntu 20.04 | Latest stable version |
| Processor | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| RAM | 8 GB | 16 GB |
| Storage | 10 GB free | 20 GB SSD |
| Node.js | 20.x | 20.x LTS |
| npm | 10.x | 10.x |
| Git | 2.30+ | Latest |
| Internet | Broadband | Broadband |

### 12.2.2 Production Infrastructure

| Service | Provider | Tier |
|---------|----------|------|
| Application Hosting | Vercel | Hobby (free) or Pro |
| Database | Neon | Free tier or Scale |
| File Storage | UploadThing | Free tier |
| Email | Resend | Free tier (100/day) |

## 12.3 Development Setup

### 12.3.1 Step 1: Clone Repository

```bash
git clone https://github.com/your-username/office-flow.git
cd office-flow
```

### 12.3.2 Step 2: Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json` (~200MB node_modules).

### 12.3.3 Step 3: Configure Environment Variables

Create `.env.local` file in project root:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# Authentication (Required)
BETTER_AUTH_SECRET=your-32-character-random-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional - notifications work in-app without this)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=Office Flow <onboarding@resend.dev>

# File Uploads (Optional - for profile/logo uploads)
UPLOADTHING_TOKEN=sk_live_xxxxxxxxxxxxxxxx
```

**Generating BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 12.3.4 Step 4: Set Up Database

**Option A: Push schema directly (development)**
```bash
npm run db:push
```

**Option B: Run migrations (production-like)**
```bash
npm run db:generate
npm run db:migrate
```

**Verify with Drizzle Studio:**
```bash
npm run db:studio
```
Opens browser at http://localhost:4983 to inspect tables.

### 12.3.5 Step 5: Start Development Server

```bash
npm run dev
```

Application available at http://localhost:3000

### 12.3.6 Step 6: Create First Account

1. Navigate to http://localhost:3000/register
2. Fill in name, email, password, company name
3. Click "Create workspace"
4. You are now admin of your organization

## 12.4 External Service Setup

### 12.4.1 Neon PostgreSQL

1. Go to https://neon.tech
2. Sign up with GitHub or email
3. Create new project
4. Copy connection string from dashboard
5. Paste as `DATABASE_URL` in `.env.local`

**Free tier includes:**
- 1 project
- 10 branches
- 3 GB storage
- Automatic backups

### 12.4.2 UploadThing

1. Go to https://uploadthing.com
2. Sign up and create app
3. Copy API token
4. Paste as `UPLOADTHING_TOKEN` in `.env.local`

**Free tier includes:**
- 2 GB storage
- 2 GB bandwidth/month

### 12.4.3 Resend (Email)

1. Go to https://resend.com
2. Sign up and verify domain (or use onboarding@resend.dev for testing)
3. Create API key
4. Paste as `RESEND_API_KEY` in `.env.local`

**Free tier includes:**
- 100 emails/day
- 3,000 emails/month

## 12.5 Production Deployment

### 12.5.1 Deploy to Vercel

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Import to Vercel**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import GitHub repository
4. Framework preset: Next.js (auto-detected)

**Step 3: Configure Environment Variables**

In Vercel project settings, add:

| Variable | Value |
|----------|-------|
| DATABASE_URL | Production Neon connection string |
| BETTER_AUTH_SECRET | Same as development (or generate new) |
| BETTER_AUTH_URL | https://your-app.vercel.app |
| NEXT_PUBLIC_APP_URL | https://your-app.vercel.app |
| RESEND_API_KEY | Production Resend key |
| EMAIL_FROM | your-verified@yourdomain.com |
| UPLOADTHING_TOKEN | Production UploadThing token |

**Step 4: Deploy**
Click "Deploy" — Vercel builds and deploys automatically.

**Step 5: Run Database Migrations**
```bash
# Connect to production database
DATABASE_URL="production-url" npm run db:push
```

### 12.5.2 Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your domain (e.g., officeflow.yourcompany.com)
3. Update DNS records as instructed
4. Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`

### 12.5.3 Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Production database created and migrated
- [ ] BETTER_AUTH_SECRET is strong (32+ characters)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Resend domain verified for email
- [ ] UploadThing app configured
- [ ] Test registration and login flow
- [ ] Test all major modules

## 12.6 Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Create production build |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint checks |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio GUI |

## 12.7 Troubleshooting

### 12.7.1 Database Connection Errors

**Error:** `Connection refused` or `SSL required`

**Solution:**
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Check Neon project is not suspended (free tier auto-suspends)
- Verify IP is not blocked (Neon allows all by default)

### 12.7.2 Authentication Errors

**Error:** `Invalid session` or redirect loops

**Solution:**
- Ensure `BETTER_AUTH_SECRET` is set and consistent
- Check `BETTER_AUTH_URL` matches actual URL (including https)
- Clear browser cookies and try again

### 12.7.3 Build Errors

**Error:** TypeScript or ESLint errors

**Solution:**
```bash
npm run lint
# Fix reported issues
npm run build
```

### 12.7.4 Upload Errors

**Error:** `UploadThing token invalid`

**Solution:**
- Verify `UPLOADTHING_TOKEN` is correct
- Check UploadThing dashboard for app status
- Ensure token has not expired

## 12.8 Maintenance

### 12.8.1 Database Backups

Neon provides automatic backups:
- Free tier: 7-day history
- Paid tiers: 30-day history

Manual backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### 12.8.2 Dependency Updates

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update major versions (careful)
npx npm-check-updates -u
npm install
```

### 12.8.3 Monitoring

Vercel provides:
- Deployment logs
- Function execution logs
- Analytics (Pro plan)
- Error tracking (integrate Sentry for advanced monitoring)

## 12.9 Summary

Office Flow can be deployed from development to production in under 30 minutes using Vercel, Neon, and optional third-party services. The serverless architecture eliminates server management overhead while providing automatic scaling.
