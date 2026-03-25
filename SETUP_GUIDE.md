# 📚 Step-by-Step Setup Guide

## Phase 1: Environment Setup (5 minutes)

### Step 1.1: Install Dependencies
```bash
npm install @supabase/supabase-js@2.41.0
npm install react-router-dom@6
npm install lucide-react  # for icons
```

### Step 1.2: Create `.env.local`
In your project root, create `.env.local`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://hnjucgbzlhztgugnnqaw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 1.3: Verify `.env.local` is Git-Ignored
Check `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## Phase 2: Database Schema Setup (10 minutes)

### Step 2.1: Access Supabase SQL Editor
1. Go to [supabase.co](https://supabase.co)
2. Login to your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2.2: Copy Schema SQL
1. Open `supabase/schema.sql` in your project
2. Copy entire content
3. Paste into Supabase SQL Editor
4. Click **Run**

**Expected Output:**
```
Query executed successfully
(Returns: CREATE TABLE, CREATE TRIGGER, etc.)
```

### Step 2.3: Verify Tables Created
1. Go to **Database** → **Tables** (left sidebar)
2. You should see 12 tables:
   - users
   - drivers
   - driver_vehicles
   - police_officers
   - police_stations
   - admin_users
   - traffic_violations
   - traffic_complaints
   - traffic_fines
   - fine_payments
   - fine_appeals
   - audit_logs

✅ If you see all 12 tables, schema setup is complete!

---

## Phase 3: File Organization (5 minutes)

### Step 3.1: Ensure File Structure
Your project should have:
```
src/
├── components/
│   ├── Admin/
│   ├── Driver/
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Notifications.jsx
│   └── UI/
├── context/
│   ├── AuthContext.new.jsx        ← NEW (rename to AuthContext.jsx)
│   ├── DataContext.jsx
│   ├── LangContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── Login.jsx                  → LoginPage.jsx
│   ├── LoginPage.jsx              ← NEW
│   ├── SignUpPage.jsx             ← NEW
│   ├── DriverDashboard.jsx        ← BUILD NEXT
│   ├── PoliceDashboard.jsx        ← BUILD NEXT
│   └── AdminDashboard.jsx         ← BUILD NEXT
├── services/
│   ├── authService.js
│   ├── complaintService.js
│   ├── fineService.js             → UPDATE (use fineService2.js)
│   ├── fineService2.js            ← NEW
│   ├── paymentService.js          → UPDATE (use paymentService2.js)
│   └── paymentService2.js         ← NEW
├── lib/
│   └── supabase.js                ← NEW (contains all helpers)
└── data/
    └── mockData.js
```

### Step 3.2: Update Context File
**Option A: Rename File**
```bash
# In terminal/PowerShell
mv src/context/AuthContext.new.jsx src/context/AuthContext.jsx
```

**Option B: Copy Content (if rename doesn't work)**
1. Open `src/context/AuthContext.new.jsx`
2. Copy all content
3. Open `src/context/AuthContext.jsx`
4. Replace all with copied content
5. Delete `AuthContext.new.jsx`

### Step 3.3: Update Service Files

**For `fineService.js`:**
1. Open `src/services/fineService2.js`
2. Copy all content
3. Open `src/services/fineService.js`
4. Replace all with copied content
5. Delete `fineService2.js`

**For `paymentService.js`:**
1. Open `src/services/paymentService2.js`
2. Copy all content
3. Open `src/services/paymentService.js`
4. Replace all with copied content
5. Delete `paymentService2.js`

---

## Phase 4: App Configuration (10 minutes)

### Step 4.1: Update `App.jsx`

Replace your current `App.jsx` with:

```jsx
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Layout from './components/Layout/Layout'

// Protected route wrapper
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userProfile?.user_type !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return element
}

// Placeholder pages (replace with actual pages)
const Dashboard = () => {
  const { userProfile } = useAuth()
  return <Layout><h1>Welcome, {userProfile?.full_name}!</h1></Layout>
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Driver Routes */}
          <Route 
            path="/driver/dashboard" 
            element={<ProtectedRoute element={<Dashboard />} requiredRole="driver" />} 
          />

          {/* Police Routes */}
          <Route 
            path="/police/dashboard" 
            element={<ProtectedRoute element={<Dashboard />} requiredRole="police" />} 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
```

### Step 4.2: Update `main.jsx`

Ensure your `main.jsx` has:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Phase 5: Testing (15 minutes)

### Step 5.1: Start Development Server
```bash
npm run dev
```

### Step 5.2: Test Signup
1. Navigate to `http://localhost:5173/signup`
2. Click **Driver** tab
3. Fill in form:
   ```
   Email: test.driver@example.com
   Password: TestPass123!
   Full Name: John Driver
   Phone: +94712345678
   NIC: 123456789V
   License Number: DLN001
   License Expiry: 2027-12-31
   ```
4. Click **Sign Up**
5. Should redirect to login page with success message

### Step 5.3: Test Login
1. On Login page, click **Driver** tab
2. Enter credentials:
   ```
   Email: test.driver@example.com
   Password: TestPass123!
   ```
3. Click **LOG IN**
4. Should redirect to `/driver/dashboard`

### Step 5.4: Check Supabase Data
1. Go to Supabase Dashboard
2. Go to **Database** → **users table**
3. You should see your test user
4. Go to **drivers table**
5. You should see driver profile with your data

✅ If you can signup, login, and see data in Supabase → Setup is working!

### Step 5.5: Test All Roles
Repeat steps 5.2-5.3 for Police and Admin roles:

**Police:**
```
Email: test.officer@example.com
Password: TestPass123!
Full Name: Jane Officer
Phone: +94712345679
Badge Number: POL-001
Rank: Constable
Department: Traffic
```

**Admin:**
```
Email: test.admin@example.com
Password: TestPass123!
Full Name: Bob Admin
Phone: +94712345680
Admin Code: ADM001
Department: Administration
```

---

## Phase 6: Using Services (Reference during development)

### Example: Get Driver Fines
```jsx
import { fineService } from './services/fineService'
import { useAuth } from './context/AuthContext'
import { useEffect, useState } from 'react'

function FinesList() {
  const { userProfile } = useAuth()
  const [fines, setFines] = useState([])

  useEffect(() => {
    const loadFines = async () => {
      const result = await fineService.getDriverFines(userProfile.id)
      if (result.success) {
        setFines(result.fines)
      }
    }
    loadFines()
  }, [userProfile.id])

  return (
    <div>
      {fines.map(fine => (
        <div key={fine.fine_number}>
          <h3>Fine #{fine.fine_number}</h3>
          <p>Amount: ${fine.amount}</p>
          <p>Due: {fine.due_date}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example: Process Payment
```jsx
import { paymentService } from './services/paymentService'

async function handlePayment(fineId, amount) {
  const result = await paymentService.createPayment({
    fine_id: fineId,
    driver_id: userProfile.id,
    amount_paid: amount,
    payment_method: 'card'
  })

  if (result.success) {
    console.log('Payment created:', result.payment)
    // Integrate with Stripe/PayPal here
  }
}
```

---

## Phase 7: Common Issues & Solutions

### Issue: "VITE_SUPABASE_URL is not defined"
**Solution:**
1. Check `.env.local` exists in project root
2. Ensure variables have `VITE_` prefix
3. Restart dev server: `npm run dev`

### Issue: "RLS policy error" when querying
**Solution:**
1. Verify user is authenticated
2. Check RLS policies in Supabase → Database → Policies
3. Ensure user's role matches policy

### Issue: "Cannot find module './lib/supabase'"
**Solution:**
1. Ensure `src/lib/supabase.js` exists
2. Check file path matches import
3. Verify file has `export` statements

### Issue: "Signup works but login fails"
**Solution:**
1. Check password is correct
2. Verify email matches signup email
3. Check user_type in database matches selected tab

### Issue: "Dashboard shows 'Loading...' forever"
**Solution:**
1. Check browser console for errors
2. Verify `.env.local` variables
3. Check Supabase project is active
4. Verify RLS policies allow user access

---

## 🎯 Next Steps

After setup is complete:

1. **Build Driver Dashboard** (`/pages/DriverDashboard.jsx`)
   - Show recent fines
   - Show payment section
   - Show profile info
   - Show vehicles

2. **Build Police Dashboard** (`/pages/PoliceDashboard.jsx`)
   - List assigned complaints
   - Issue fine form
   - Show statistics

3. **Build Admin Dashboard** (`/pages/AdminDashboard.jsx`)
   - System overview
   - All complaints/fines
   - Appeal management

4. **Integrate Payment Gateway**
   - Add Stripe/PayPal integration
   - Handle payment webhooks

5. **Setup Email Notifications**
   - Send fine notifications
   - Send payment confirmations

6. **Configure File Upload**
   - For appeal evidence
   - For documents

---

## 📞 Support

If you encounter issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Supabase → Database → Logs
3. **Check Browser Console**: F12 → Console tab for errors
4. **Verify Credentials**: .env.local has correct values
5. **Test with curl**: 
   ```bash
   curl -X GET https://hnjucgbzlhztgugnnqaw.supabase.co/rest/v1/users \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

---

**Setup Time**: ~45 minutes
**Status**: ✅ Ready to proceed to dashboard building
**Last Updated**: March 4, 2026
