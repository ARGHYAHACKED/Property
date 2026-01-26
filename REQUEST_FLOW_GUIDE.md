# How Requests Flow Through Vercel + Render

## 🔄 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL FRONTEND                              │
│                  yourapp.vercel.app                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │   vercel.json ROUTING RULES       │
         └───────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    /api/*     /uploads/*   SPA Routes
        │           │           │
        └─────┬─────┘           │
              │                 │
              ▼                 ▼
    ┌──────────────────┐  ┌──────────────┐
    │ RENDER BACKEND   │  │ index.html   │
    │ property-0lu6... │  │ (React App)  │
    │                  │  └──────────────┘
    │ ✓ /api/auth     │
    │ ✓ /api/lands    │
    │ ✓ /api/props    │
    │ ✓ /uploads      │
    └──────────────────┘
```

---

## 📍 Detailed Routes

### User Authentication
```
POST /api/auth/register
    ↓ Frontend: SignUp.jsx
    ↓ Backend: authController.js → register()
    ✓ Creates user

POST /api/auth/verify-otp
    ↓ Frontend: SignUp.jsx
    ↓ Backend: authController.js → verifyOTP()
    ✓ Verifies OTP

POST /api/auth/login
    ↓ Frontend: Login.jsx
    ↓ Backend: authController.js → login()
    ✓ Login via phone

POST /api/auth/loginVerifyOtp
    ↓ Frontend: Login.jsx
    ↓ Backend: authController.js → loginVerifyOtp()
    ✓ Verify login OTP
```

### Property Management
```
GET /api/properties
    ↓ Frontend: Property.jsx
    ↓ Backend: propertyController.js → getAllProperties()
    ✓ Fetch all properties

POST /api/properties
    ↓ Frontend: AddProperty.jsx
    ↓ Backend: propertyController.js → addProperty()
    ✓ Create property

GET /api/properties/:id
    ↓ Frontend: PropertyDetails.jsx
    ↓ Backend: propertyController.js → getPropertyById()
    ✓ Fetch single property
```

### Land Management
```
GET /api/lands
    ↓ Frontend: Land.jsx
    ↓ Backend: landController.js → getAllLands()
    ✓ Fetch all lands

POST /api/lands
    ↓ Frontend: SellLand.jsx
    ↓ Backend: landController.js → addLand()
    ✓ Create land

GET /api/lands/:id
    ↓ Frontend: LandDetails.jsx
    ↓ Backend: landController.js → getLandById()
    ✓ Fetch single land
```

### Land Requests
```
POST /api/land-request/create
    ↓ Frontend: PropertyDetails.jsx, LandDetails.jsx
    ↓ Backend: requestLandController.js → createLandRequest()
    ✓ Request to buy/lease land

GET /api/land-request
    ↓ Backend: requestLandController.js → getLandRequests()
    ✓ Get all requests
```

### Messages
```
POST /api/messages/create
    ↓ Frontend: SellLand.jsx
    ↓ Backend: messageController.js → createMessage()
    ✓ Create message

GET /api/messages
    ↓ Frontend: AdminDashboard.jsx
    ↓ Backend: messageController.js → getAllMessages()
    ✓ Get all messages

DELETE /api/messages/:id
    ↓ Frontend: AdminDashboard.jsx
    ↓ Backend: messageController.js → deleteMessage()
    ✓ Delete message
```

### Admin Routes
```
POST /api/admin/login
    ↓ Frontend: AdminLogin.jsx
    ↓ Backend: adminController.js → adminLogin()
    ✓ Admin login
```

---

## 🔐 Authentication Flow

```
1. User visits app
   ↓
2. Check token from cookies
   GET /api/auth/verify
   ↓
3. Token valid? → Redirect to home
   Token invalid? → Redirect to login
   ↓
4. User enters credentials
   POST /api/auth/login
   ↓
5. Backend sends OTP
   ↓
6. User enters OTP
   POST /api/auth/loginVerifyOtp
   ↓
7. Backend returns JWT token
   ↓
8. Frontend stores token in cookies
   ↓
9. All future requests include token in header:
   Authorization: Bearer <token>
```

---

## 🚦 Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful, data fetched |
| 201 | Created | Property/Land created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid token or credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend crash |

---

## 💾 Database Relations

```
User
├── Has many Properties
├── Has many Lands
├── Has many Messages
└── Has many LandRequests

Property
├── Belongs to User
└── Has many LandRequests

Land
├── Belongs to User
└── Has many LandRequests

Message
└── Belongs to User

LandRequest
├── Belongs to User
└── References Property or Land
```

---

## 🎯 Now Test With:

1. **Local Dev:**
   ```bash
   npm run dev  # Port 5173
   curl http://localhost:5001/api/lands
   ```

2. **Vercel:**
   ```bash
   vercel --prod
   curl https://yourapp.vercel.app/api/lands
   # (This will rewrite to https://property-0lu6.onrender.com/api/lands)
   ```

Everything should work perfectly now! ✨
