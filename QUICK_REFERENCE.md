# Quick Reference: Render + Vercel Deployment

## ⚡ Fast Setup (Copy & Paste)

### Backend - Render Setup
```bash
# 1. Go to https://dashboard.render.com
# 2. Click "New +" → "Web Service"
# 3. Connect your GitHub repo

# 4. Fill in these details:
#    Name: property-backend
#    Environment: Node
#    Build Command: npm install
#    Start Command: node server.js

# 5. Add Environment Variables (important!):
#    MONGO_URI = your_mongodb_connection_string
#    PORT = 5001

# 6. Click "Create Web Service"
```

**Your Render Backend URL:** `https://property-0lu6.onrender.com`

---

### Frontend - Vercel Setup
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend folder
cd /Users/shamikbanerjee/property/ok/Property/frontend

# 3. Deploy
vercel

# 4. Answer the prompts:
#    - Link to existing project? No
#    - Set project name
#    - Default settings for others

# 5. Done! Your URL will be shown
```

**Your Vercel Frontend URL:** `something.vercel.app`

---

## ✅ What's Already Done For You

1. ✓ API Base URL is configurable via environment variables
2. ✓ Backend CORS accepts Vercel domains automatically
3. ✓ All 14 components updated to use API_BASE_URL
4. ✓ Environment files set up (.env.development, .env.production)
5. ✓ Cookies work across domains

---

## 🧪 Test It Works

### Local Testing (Before Deployment)
```bash
# Terminal 1: Backend
cd backend
npm start
# Should say: "Server running on port 5001"

# Terminal 2: Frontend
cd frontend
npm run dev
# Should open http://localhost:5173
```

### Production Testing (After Deployment)
- Open your Vercel URL: `https://your-app.vercel.app`
- Try logging in
- Try creating a property/land
- Check Network tab in DevTools
- Should see API calls going to `https://property-0lu6.onrender.com/api/...`

---

## 🔑 Key URLs to Remember

| Component | Dev | Production |
|-----------|-----|------------|
| Frontend | http://localhost:5173 | your-app.vercel.app |
| Backend API | http://localhost:5001 | https://property-0lu6.onrender.com |
| Database | Your MongoDB | Your MongoDB |

---

## 📱 Important: Mobile Testing

If you want to test on a mobile device:

1. **Local Network:**
   - Find your laptop's IP: `ifconfig | grep "inet "`
   - Access: `http://YOUR_IP:5173`
   - Backend: `http://YOUR_IP:5001`

2. **Production:**
   - Just use your Vercel URL
   - Works anywhere

---

## 🆘 Common Issues & Fixes

**Issue: "Cannot reach backend"**
```
✓ Check Render service is running
✓ Check CORS in backend/server.js
✓ Check VITE_API_URL in .env.production
```

**Issue: "CORS error"**
```
✓ Make sure Vercel domain is allowed in backend CORS
✓ Clear browser cache
✓ Check if request headers include credentials
```

**Issue: "401 Unauthorized"**
```
✓ Token might be missing
✓ Check if withCredentials is set in axios
✓ Check if Authorization header is sent
```

---

## 🎯 File Locations for Quick Reference

**API Configuration:**
```
frontend/src/config/api.js  ← Single source of truth
```

**Environment Files:**
```
frontend/.env.development   ← Local dev
frontend/.env.production    ← Production/Vercel
frontend/.env.example       ← Reference
```

**Backend CORS:**
```
backend/server.js (lines 30-40)  ← Edit if adding new domains
```

---

## ✨ That's It!

Your application is production-ready. Just deploy and it will work! 🚀
