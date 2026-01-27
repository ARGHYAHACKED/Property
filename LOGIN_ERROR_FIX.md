# 🔧 Backend Login Error: 500 Internal Server Error

## ❌ Error Message
```
POST https://property-0lu6.onrender.com/api/auth/login 500 (Internal Server Error)
Error sending OTP: {error: 'Server error'}
```

---

## 🔍 Root Causes (Most Likely)

### 1️⃣ **Twilio Configuration Missing** (Most Common)
The backend can't send SMS because Twilio credentials aren't set.

**Environment Variables Required:**
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

**Check:**
- [ ] Are these variables set in your `.env` file?
- [ ] Are they correctly added to Render environment variables?
- [ ] No typos in variable names?

---

### 2️⃣ **Invalid Phone Number Format**
Twilio requires E.164 format: `+[country code][number]`

**❌ Wrong formats:**
```
9876543210          # Missing country code
919876543210        # Missing +
+91 9876543210      # Spaces not allowed
```

**✅ Correct formats:**
```
+919876543210       # India
+14155552671        # USA
+447911123456       # UK
```

---

### 3️⃣ **Twilio Account Issues**
- Account doesn't have SMS capability
- Account suspended or out of credits
- Phone number not verified in Twilio sandbox
- Trial account with restrictions

---

## ✅ Solutions

### Step 1: Fix Error Logging (Already Done)
I've updated the code to show detailed Twilio errors:

```javascript
console.error('Twilio error:', {
    message: twilioError.message,
    code: twilioError.code,
    status: twilioError.status
});
```

**Check Render logs:** https://dashboard.render.com → Select your service → Logs

---

### Step 2: Verify Twilio Setup

**A) Get Twilio Credentials:**
1. Go to [Twilio Console](https://console.twilio.com)
2. Copy Account SID and Auth Token
3. Go to Phone Numbers → Manage Numbers
4. Copy your Twilio phone number

**B) Format Phone Numbers Correctly:**
- User enters: `9876543210`
- You must add country code: `+91` + `9876543210` = `+919876543210`

**C) Update Frontend to Collect Country Code:**

Currently your frontend does:
```javascript
const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { phone });
```

**Better approach** - Let users select country code:
```jsx
const [countryCode, setCountryCode] = useState('+91'); // Default to India
const [phone, setPhone] = useState('');

const handleLogin = async () => {
    const fullPhone = countryCode + phone; // +919876543210
    await axios.post(`${API_BASE_URL}/api/auth/login`, { phone: fullPhone });
};
```

---

### Step 3: Add to Render Environment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to **Environment**
4. Add these variables:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
```

5. **Redeploy** your service

---

### Step 4: Test with Mock SMS (Temporary)

While troubleshooting, use a mock SMS service:

**File:** `backend/controllers/authController.js`

**Temporary Test Code:**
```javascript
// Temporarily skip Twilio for testing
const mockSendOTP = async (phone, otp) => {
    console.log(`[MOCK SMS] OTP ${otp} sent to ${phone}`);
    return true;
};

exports.login = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.findOneAndUpdate({ phone }, { otp }, { upsert: true });
        
        // Use mock for testing
        await mockSendOTP(phone, otp);
        console.log(`Debug OTP for ${phone}: ${otp}`); // Check logs!
        
        res.status(200).json({ message: 'OTP sent successfully', phone });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};
```

**Check Render logs for:** `[MOCK SMS] OTP 123456 sent to +919876543210`

---

## 🧪 Test Locally

```bash
# 1. Create .env file with real credentials
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+your_twilio_number

# 2. Start backend
npm start

# 3. Test with curl
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# 4. Check console for errors
```

---

## 📋 Checklist to Fix

- [ ] Get Twilio Account SID
- [ ] Get Twilio Auth Token
- [ ] Get Twilio Phone Number
- [ ] Add to `.env` locally
- [ ] Add to Render environment variables
- [ ] Redeploy Render service
- [ ] Format phone numbers as `+country_codenumber`
- [ ] Check Render logs for detailed Twilio error
- [ ] Test login endpoint with proper phone format

---

## 🆘 Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Unable to create message - Invalid phone number` | Wrong format | Use +919876543210 |
| `Invalid Twilio credentials` | Bad SID/token | Copy from Twilio console |
| `REST API not enabled` | Account issue | Enable SMS in Twilio |
| `Attempting to send SMS from invalid number` | Phone not in account | Add/verify phone in Twilio |
| `Account suspended` | No credits | Add payment method |

---

## 📞 Debug: Print Actual Error

Update your code temporarily to see the real error:

```javascript
exports.login = async (req, res) => {
    try {
        // ... code ...
        res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        console.error('FULL ERROR:', error); // Log full error
        res.status(500).json({ error: error.message || 'Unknown error' });
    }
};
```

Then check Render logs and share the actual error message!

---

## ✨ Next Steps

1. **Set up Twilio** if not already done
2. **Add credentials to Render**
3. **Redeploy backend**
4. **Test login endpoint**
5. **Check Render logs** for detailed errors

Once Twilio is configured properly, login will work! 🚀
