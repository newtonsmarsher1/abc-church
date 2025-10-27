# 🚀 Deploy to Render - Complete Guide

## Quick Deploy Steps

### 1. Push Your Code (Already Done!)
Your code is already on GitHub: `https://github.com/newtonsmarsher1/abc-church`

### 2. Create Render Account
1. Go to **https://render.com**
2. Sign up with **GitHub**
3. Connect your GitHub account

### 3. Deploy Your App
1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect GitHub repository"**
4. Select your repository: **`abc-church`**
5. Configure settings:
   - **Name**: `abc-church-system`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: (leave empty - root of repo)
   - **Environment**: `Node`
   - **Build Command**: (leave empty or type `npm install`)
   - **Start Command**: `npm start`
6. Under **"Advanced"**:
   - Add Environment Variable:
     - **Key**: `NODE_ENV`
     - **Value**: `production`
7. Click **"Create Web Service"**

### 4. Wait for Deployment
- Render will install dependencies
- Build your app
- Start the server
- Give you a URL like: `https://abc-church-system.onrender.com`

### 5. Your App is Live! 🎉

Visit your URL and start using the app!

---

## Free Tier Details

✅ **Includes**:
- Unlimited free deploys
- Automatic SSL
- Custom domains
- ~750 hours/month free
- 15-minute spin down after inactivity

⚠️ **Note**: App sleeps after 15 minutes of inactivity (free tier)
- First request after sleep takes ~30 seconds
- Subsequent requests are fast

---

## Persistent Storage

✅ SQLite database **WILL persist** between deploys
- Database stored in HOME directory
- Survives restarts
- Automatically backed up

---

## Automatic Deploys

✅ **Enabled by default**:
- Every push to `main` branch auto-deploys
- View logs in Render dashboard
- Monitor builds and status

---

## Troubleshooting

### If deployment fails:
1. Check **Logs** tab in Render
2. Common issues:
   - Port mismatch (should use `process.env.PORT`)
   - Database path issues
   - Missing dependencies

### Check these files:
- ✅ `server.js` - exports Express app
- ✅ `package.json` - has start script
- ✅ `backend/database.js` - handles cloud paths

---

## Custom Domain (Optional)

1. In Render dashboard, click your service
2. Go to **"Settings"** tab
3. Click **"Add Custom Domain"**
4. Enter your domain
5. Follow DNS instructions

---

## Monitor Your App

- **Logs**: Real-time in Render dashboard
- **Metrics**: CPU, memory usage
- **Alerts**: Email notifications

---

## Next Steps

1. **Test your app** at the Render URL
2. **Share the URL** with church staff
3. **Monitor logs** for any issues
4. **Customize domain** if needed

**Your ABC Church Information System is now live! 🎉**

