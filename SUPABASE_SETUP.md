# 🚀 Supabase Database Setup - Quick Start

## ✅ What Was Created

### Folders & Files:
```
supabase/
├── schema.sql          # Complete database schema with all tables
└── README.md           # Detailed setup documentation

src/lib/
└── supabase.js         # Supabase client & helper functions

src/services/
├── authService.js      # Authentication service
├── complaintService.js # Complaint management
├── fineService.js      # Fine management
└── paymentService.js   # Payment processing

Root Files:
├── .env.local          # Environment variables (⚠️ KEEP SECRET)
├── .env.example        # Example env template
└── package.json        # Updated with @supabase/supabase-js
```

### Database Tables (12 total):
- **Users**: drivers, police_officers, admin_users
- **Incidents**: complaints, fines, appeal_requests
- **Payments**: payments, session tracking
- **Management**: audit_logs, notifications, police_stations

## 🔧 Next Steps

### 1. Install Supabase Package:
```bash
npm install
```

### 2. Add Schema to Supabase:
1. Go to your Supabase Dashboard
2. Open SQL Editor
3. Create a new query and copy-paste contents of `supabase/schema.sql`
4. Click "Run"

### 3. Verify Environment Variables:
Check `.env.local` has:
```
VITE_SUPABASE_URL=https://lkcanjpmciumslifijphf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Test Connection:
```javascript
import { supabase } from './src/lib/supabase';

const { data, error } = await supabase.from('police_stations').select('*');
console.log(data); // Should show 5 police stations
```

## 📋 Table Structure Overview

### Users Table
```
id (UUID) → driver/police/admin
├── nic (for drivers)
├── officer_id (for police)
├── admin_id (for admins)
├── full_name
├── phone_number
└── status (active/inactive/suspended)
```

### Complaints → Fines → Payments (Flow)
```
Complaint (reported)
    ↓
Fine (issued)
    ↓
Payment (processed)
```

### Supporting Flows
```
Fine → Appeal Request (if disputed)
Fine → Payment (with multiple payment methods)
User → Audit Log (all actions tracked)
User → Notifications (for updates)
```

## 🔐 Security Important!

⚠️ **CREDENTIALS EXPOSED** - You shared real Supabase keys!
```bash
# DO THIS NOW:
1. Go to Supabase Dashboard
2. Settings → API → Rotate Keys
3. Update .env.local with NEW keys
4. .env.local is gitignored ✅
```

## 🎯 Using the Services

### Example: Login Flow
```javascript
import { authService } from './src/services/authService';

// Driver Login (with NIC)
const driver = await authService.authenticateDriver('901234567V');

// Officer Login (with badge)
const officer = await authService.authenticateOfficer('POL999');

// Admin Login (with code)
const admin = await authService.authenticateAdmin('ADM999');
```

### Example: Create Complaint
```javascript
import { complaintService } from './src/services/complaintService';

const complaint = await complaintService.createComplaint({
  driver_id: 'uuid',
  complaint_type: 'speeding',
  location: 'Colombo',
  vehicle_registration: 'ABC-1234',
  incident_details: 'Driving at 80 km/h in 40 km/h zone'
});
```

### Example: Issue Fine
```javascript
import { fineService } from './src/services/fineService';

const fine = await fineService.issueFine({
  complaint_id: 'uuid',
  driver_id: 'uuid',
  officer_id: 'uuid',
  fine_amount: 5000,
  fine_type: 'speeding',
  penalty_points: 12,
  reason: 'Exceeded speed limit',
  due_date: '2026-04-04'
});
```

### Example: Process Payment
```javascript
import { paymentService } from './src/services/paymentService';

const payment = await paymentService.createPayment({
  fine_id: 'uuid',
  driver_id: 'uuid',
  amount: 5000,
  payment_method: 'online'
});

// After successful payment
await paymentService.completePayment(payment.id, 'transaction-123');
```

## 📊 Database Features

✅ **Automatic Timestamps** - created_at, updated_at auto-managed
✅ **Audit Trail** - Every action logged
✅ **Notifications** - Real-time user notifications
✅ **Row Level Security** - Ready for RLS policies
✅ **Performance** - Indexed on frequently queried columns
✅ **Data Integrity** - Foreign keys & constraints

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing env variables" | Check .env.local exists with correct values |
| "Connection refused" | Verify Supabase project is active (not paused) |
| "Auth fails" | Ensure user exists in database with correct role |
| "Empty query results" | Check RLS policies aren't blocking access |

## 📚 Files Reference

- `supabase/schema.sql` - Run this in Supabase SQL Editor first!
- `supabase/README.md` - Detailed technical documentation
- `src/lib/supabase.js` - Import this to use database
- `src/services/*` - Import specific services for features

---

**Status**: ✅ Database ready for integration!
**Next**: Update Login.jsx to use `authService` for real authentication
