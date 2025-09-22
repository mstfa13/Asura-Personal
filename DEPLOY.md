# Asura Personal - Multi-User Activity Tracker

A comprehensive activity tracking app with gamification, progress visualization, and multi-user support.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account with this repository (mstfa13/Asura-Personal)
- Vercel account

### Deploy Steps
1. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `mstfa13/Asura-Personal`
   - Framework Preset: **Vite** (auto-detected)

2. **Add Database**
   - In your Vercel project dashboard
   - Go to "Storage" tab
   - Add "Vercel Postgres" integration
   - This automatically adds POSTGRES_* environment variables

3. **Add Environment Variables**
   - In project settings → Environment Variables
   - Add: `JWT_SECRET` = (generate a strong random string, e.g., 32+ characters)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

## 🧪 Test the Deployment

### Mostafa's Account (Full Experience)
- Email: `www.mostfaakram@gmail.com`
- Password: `mostafa@asura123`
- Gets: All pages, full data, complete tracking setup

### New User Experience
- Register with any other email
- Gets: Progress + Daily Activities only (minimal mode)
- As you add custom activities, more features unlock
- All data saves automatically per user

## 📱 Features

### Core Pages
- **Progress**: Radar chart, level tracking, overview
- **Daily Activities**: Task management and tracking
- **Boxing**: Fitness tests, tape watching, fight records
- **Gym**: Weight tracking, exercise progress, power lifts
- **Music (Oud/Violin)**: Practice tracking, concerts
- **Languages (Spanish/German)**: Learning progress
- **Custom Activities**: Add your own with templates

### Multi-User Features
- JWT authentication
- Per-user state persistence in Postgres
- Automatic data sync
- Minimal onboarding for new users
- Full data seeding for Mostafa

### Backend API
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/me` - Current user profile
- `GET /api/state` - Load user data
- `PUT /api/state` - Save user data

## 🛠 Local Development

### Option 1: With Vercel Dev (Recommended)
```bash
npm install
npm run dev:all
```
- Frontend: http://localhost:8080
- API: http://localhost:3000 (auto-proxied)

### Option 2: Point to Deployed API
```powershell
$env:VITE_API_BASE="https://your-app.vercel.app/api"
npm run dev
```

### Setup Vercel CLI (Optional)
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
```

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);
```

### States Table
```sql
CREATE TABLE states (
  user_id text PRIMARY KEY REFERENCES users(id),
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

## 🔧 Configuration

### Environment Variables
- `JWT_SECRET` - Required for auth tokens
- `POSTGRES_*` - Auto-provided by Vercel Postgres integration

### Files Structure
- `/api/*` - Serverless functions
- `/src/*` - React frontend
- `vercel.json` - SPA routing config
- `vite.config.ts` - Dev proxy setup

## 📊 Data Seeding

### Mostafa Account
- Boxing: 96h, fitness tests, tape data
- Gym: 24h, power lifts, weight tracking
- Music: Oud 16h, Violin 780h, concerts
- Languages: Spanish 393h, German 556h
- All features enabled

### New Users
- Minimal starting data (0 hours)
- Only Progress + Daily Activities visible
- Core pages hidden until user adds content
- minimalMode flag controls UI restrictions

## 🚀 Next Steps After Deployment

1. **Test Both User Types**
   - Register Mostafa to see full experience
   - Register new user to see minimal onboarding

2. **Customize**
   - Add your own activities via + button in sidebar
   - Choose templates (Boxing, Gym, Music, Language, or None)
   - Track progress and watch it reflect in Progress page

3. **Scale**
   - Vercel auto-scales
   - Postgres handles multiple users
   - Each user's data is isolated and persistent

---

Built with React + TypeScript + Vite + Vercel + Postgres
