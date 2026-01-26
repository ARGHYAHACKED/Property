# Deployment Guide: Backend on Render + Frontend on Vercel

## ✅ Changes Made

### Backend (Node.js/Express)
✓ Updated CORS configuration to accept:
  - Local development URLs (localhost:5173, localhost:3000)
  - Render backend URL (https://property-0lu6.onrender.com)
  - Any Vercel deployment (*.vercel.app)
  - Environment variable for custom frontend URLs

### Frontend (React/Vite)
✓ Created centralized API configuration file (`src/config/api.js`)
✓ Updated ALL API calls to use `API_BASE_URL` instead of hardcoded localhost
✓ Created environment files for different deployment stages:
  - `.env.development` - Local development (localhost:5001)
  - `.env.production` - Production/Vercel (Render backend URL)
  - `.env.example` - Reference template

### Files Updated (24 total):
- `backend/server.js` - CORS configuration
- `frontend/src/config/api.js` - New API config file
- `frontend/src/pages/AdminLogin.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/SignUp.jsx`
- `frontend/src/pages/Createuser.jsx`
- `frontend/src/pages/Land.jsx`
- `frontend/src/pages/Property.jsx`
- `frontend/src/pages/PropertyDetails.jsx`
- `frontend/src/pages/LandDetails.jsx`
- `frontend/src/pages/SellLand.jsx`
- `frontend/src/pages/Profile.jsx`
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/components/Navbar.jsx`
- Environment files (.env.development, .env.production, .env.example)

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render
1. Push your backend code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create a new **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - Add environment variables:
     - `MONGO_URI` - Your MongoDB connection string
     - `PORT` - 5001 (or your preferred port)
     - Any other required env vars
6. Deploy!

### Step 2: Deploy Frontend to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. In the frontend directory: `cd frontend`
3. Run: `vercel`
4. Follow the prompts
5. Vercel automatically uses `.env.production` for production builds
6. Your frontend will be deployed to: `yourproject.vercel.app`

### Step 3: Testing
**Local Development:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

**Production (After Deployment):**
- Frontend will automatically use: `https://property-0lu6.onrender.com`
- All API calls will hit the Render backend
- Cookies will work across domains with credentials

---

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
PORT=5001
NODE_ENV=production
```

### Frontend (auto-loaded by Vite)
**Development (.env.development):**
```
VITE_API_URL=http://localhost:5001
```

**Production (.env.production):**
```
VITE_API_URL=https://property-0lu6.onrender.com
```

---

## ✅ CORS is Properly Configured

Your backend CORS now accepts:
- ✓ `http://localhost:5173` (Vite dev server)
- ✓ `http://localhost:3000` (Alternative port)
- ✓ `https://property-0lu6.onrender.com` (Your Render backend)
- ✓ Any `*.vercel.app` domain (For Vercel deployments)
- ✓ Custom URLs via `FRONTEND_URL` environment variable
- ✓ Credentials enabled (cookies work across domains)

---

## 🔍 How It Works

1. **Frontend config (`src/config/api.js`):**
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://property-0lu6.onrender.com';
   export default API_BASE_URL;
   ```

2. **Usage in components:**
   ```javascript
   import API_BASE_URL from '../config/api';
   
   // Instead of: http://localhost:5001/api/auth/login
   axios.post(`${API_BASE_URL}/api/auth/login`, data);
   ```

3. **Environment switching:**
   - During `npm run dev` → Uses `.env.development` (localhost:5001)
   - During `npm run build` → Uses `.env.production` (Render URL)
   - During `vercel deploy` → Uses `.env.production` (Render URL)

---

## 📝 Optional: Add Custom Domain to Vercel

1. In Vercel dashboard, go to your project settings
2. Add your custom domain
3. Update DNS records according to Vercel instructions
4. Update `FRONTEND_URL` in backend .env if needed

---

## 🆘 Troubleshooting

**Issue: CORS errors after deployment**
- Check that frontend URL is in backend CORS list
- Clear browser cache and cookies
- Restart backend service on Render

**Issue: API calls returning 404**
- Verify `VITE_API_URL` is set correctly
- Check network tab in browser DevTools
- Ensure backend routes are correctly deployed

**Issue: Cookies not working**
- Verify `credentials: true` is set in axios calls
- Check CORS headers in response
- Use same domain or properly configured cross-domain cookies

---

## ✨ Summary
Your Property application is now ready for production deployment with:
- ✅ Secure CORS configuration
- ✅ Dynamic API URL switching
- ✅ Environment-based deployments
- ✅ Cookie/credential support across domains
