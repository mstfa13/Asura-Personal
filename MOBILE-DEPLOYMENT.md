# Asura - Mobile Deployment Guide

## Quick Mobile Access via Vercel

### Step 1: Deploy to Vercel
1. **Push to GitHub**: Make sure your code is committed and pushed to your GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project" 
   - Select your Asura repository
3. **Deploy Settings**:
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Root Directory: `./` (leave default)
4. **Deploy**: Click "Deploy" - Vercel will build and deploy automatically

### Step 2: Access on Mobile
1. **Get Your URL**: After deployment, you'll get a URL like `https://asura-personal-yourname.vercel.app`
2. **Open on Mobile**: Visit this URL on your phone's browser
3. **Install as PWA**:
   - **iPhone**: Safari → Share button → "Add to Home Screen"
   - **Android**: Chrome → Menu (⋮) → "Add to Home screen" or "Install app"

### Step 3: Mobile Features
✅ **Native app experience** - Full-screen, no browser UI
✅ **Offline functionality** - Works without internet
✅ **Home screen icon** - Quick access from phone
✅ **All data synced** - Your progress, levels, daily goals
✅ **Cross-device access** - Same URL works on desktop and mobile

### Alternative: Local Network Access
If you want to test before deploying:
1. Run `npm run build && npx vite preview --host`
2. Use your WiFi IP: `http://192.168.1.13:4173/`
3. Install as PWA from local network

---

## Technical Details
- **PWA Ready**: Manifest, service worker, mobile optimized
- **Responsive Design**: Works on all screen sizes  
- **Data Persistence**: localStorage with backup/restore
- **Deployment**: Static build, no server required