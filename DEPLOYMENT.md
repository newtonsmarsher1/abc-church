# Deployment Guide for ABC Church Information System

## ⚠️ Important: Database Limitations

**The current SQLite setup will NOT work on Vercel** because:
- Vercel uses serverless functions (stateless)
- File system is read-only
- SQLite database files can't persist between function invocations

## 🔧 Solutions for Vercel Deployment

### Option 1: Use Cloud Database (Recommended)

#### A. Deploy to Railway (Easier)
Railway supports traditional apps with file storage:

1. **Visit**: https://railway.app
2. **Click**: "New Project"
3. **Add**: GitHub repository
4. **Click**: "Deploy"
5. **Done!** Railway auto-detects Node.js and runs your app

**Advantages**:
- SQLite works perfectly
- No code changes needed
- Free tier available
- Auto-deploys on git push

---

#### B. Use Supabase with Vercel

Replace SQLite with Supabase PostgreSQL:

1. **Get Supabase**: https://supabase.com
2. **Install client**:
   ```bash
   npm install @supabase/supabase-js
   ```
3. **Update database.js** to use Supabase
4. **Deploy to Vercel**

**Migration files needed**:
- Update backend models to use Supabase client
- Create schema migration
- Update API routes

---

#### C. Use MongoDB Atlas

1. **Create account**: https://www.mongodb.com/cloud/atlas
2. **Install Mongoose**:
   ```bash
   npm install mongoose
   ```
3. **Restructure models** for MongoDB
4. **Deploy to Vercel**

---

### Option 2: Keep Current Setup (Alternative Platforms)

Your current setup works perfectly on:

1. **Railway** - Best for Node.js apps
2. **Render** - https://render.com
3. **Heroku** - https://www.heroku.com (paid)
4. **DigitalOcean** - VPS deployment
5. **AWS EC2** - Full server control

---

## 🚀 Quick Deploy to Railway (Easiest Option)

### Steps:

1. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Get your URL**: Railway provides a public URL

### Environment Variables (if needed):
```bash
PORT=3000
NODE_ENV=production
```

---

## 🌐 Deploy to Render

### Free Tier Available!

1. **Visit**: https://render.com
2. **Sign up** with GitHub
3. **New**: "Web Service"
4. **Connect** your repository
5. **Settings**:
   - Build Command: (leave empty)
   - Start Command: `npm start`
6. **Deploy!**

Render automatically:
- Detects Node.js
- Builds your app
- Gives you a URL
- SQLite works (15-minute idle spin down on free tier)

---

## 📊 Comparison

| Platform | SQLite Support | Free Tier | Ease of Setup | Best For |
|----------|---------------|-----------|---------------|----------|
| **Railway** | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐⭐ | Current app |
| **Render** | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐ | Current app |
| **Vercel** | ❌ No | ✅ Yes | ⭐⭐⭐ | Serverless |
| **Heroku** | ✅ Yes | ❌ No | ⭐⭐⭐ | Current app |

---

## 🔄 Convert to Vercel-Compatible

If you specifically need Vercel:

### Step 1: Use Supabase (PostgreSQL)
```bash
npm install @supabase/supabase-js
```

### Step 2: Create `.env.local`
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

### Step 3: Update `backend/database.js`
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);
```

### Step 4: Deploy
```bash
vercel
```

---

## ✅ Recommended Approach

**For your current codebase**: Use **Railway** or **Render**

1. **Zero code changes required**
2. **Free tier available**
3. **SQLite works perfectly**
4. **Simple deployment**

### Railway Deployment Steps:

1. Push code to GitHub
2. Go to railway.app
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-deploys!

---

## 📝 Next Steps

1. **Choose your platform** (Railway recommended)
2. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
3. **Connect to deployment platform**
4. **Deploy!**

---

## 🛠️ Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

**For this specific app, I recommend Railway for the easiest deployment experience.**

