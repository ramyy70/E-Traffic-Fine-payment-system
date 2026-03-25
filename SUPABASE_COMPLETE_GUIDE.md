# Complete Supabase Setup Guide

## 📋 Table of Contents
1. [Database Overview](#database-overview)
2. [Authentication & JWT](#authentication--jwt)
3. [Database Schema](#database-schema)
4. [User Types & Workflows](#user-types--workflows)
5. [Installation](#installation)
6. [API Services](#api-services)
7. [Security & RLS](#security--rls)
8. [Deployment](#deployment)

---

## Database Overview

### Architecture
- **12 Core Tables** with comprehensive relationships
- **Row Level Security (RLS)** policies for data protection
- **JWT Authentication** via Supabase Auth
- **Audit Logging** for all operations
- **Real-time Notifications** system
- **Automatic Triggers** for timestamps and statistics

### User Types
1. **Driver** - Report complaints, view fines, manage payments
2. **Police Officer** - File complaints, issue fines, manage violations
3. **Admin** - Manage system, approve appeals, view statistics

---

## Authentication & JWT

### JWT Token Flow
```
User (Email/Password)
    ↓
Supabase Auth.signUp/signIn()
    ↓
Returns JWT Token + Refresh Token
    ↓
Stored in Session (localStorage)
    ↓
Used for Authenticated Requests
    ↓
Auto-refresh on expiry
```

### Key Files
- **`src/lib/supabase.js`** - Supabase client & helper functions with JWT support
- **`src/pages/LoginPage.jsx`** - Multi-role login page
- **`src/pages/SignUpPage.jsx`** - Multi-role signup with role-specific fields
- **`src/services/authService.js`** - Authentication operations

### Environment Variables
```env
VITE_SUPABASE_URL=https://hnjucgbzlhztgugnnqaw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Database Schema

### Core Tables

#### 1. **users** (Authentication & Profile)
```sql
- id (UUID) → links to auth.users
- email (unique)
- user_type (driver | police | admin)
- full_name, phone_number
- profile_image_url
- is_active, is_verified
- last_login (JWT tracking)
```

#### 2. **drivers** (Driver Details)
```sql
- user_id (FK → users)
- nic_number (unique)
- license_number, license_expiry_date
- date_of_birth, gender, address
- total_fines_amount (auto-calculated)
- total_paid_amount (auto-calculated)
- pending_fines_count (auto-calculated)
- penalty_points (auto-calculated)
- status (active | suspended | banned)
```

#### 3. **driver_vehicles** (Vehicle Registry)
```sql
- driver_id (FK → drivers)
- registration_number (unique)
- vehicle_type, make, model, year
- insurance_expiry, vehicle_tax_expiry
- is_active (soft delete)
```

#### 4. **police_officers** (Police Details)
```sql
- user_id (FK → users, unique)
- badge_number (unique)
- rank, department
- station_id (FK → police_stations)
- date_of_joining
- status (active | on_leave | retired)
```

#### 5. **police_stations** (Station Information)
```sql
- station_name, station_code (unique)
- location, address, phone, email
- district, province
- latitude, longitude (GPS)
```

#### 6. **admin_users** (Admin Details)
```sql
- user_id (FK → users, unique)
- admin_code (unique)
- department
- role_level (super_admin | admin | manager | operator)
- permissions (TEXT[])
```

#### 7. **traffic_violations** (Violation Registry)
```sql
- violation_code (unique)
- violation_name
- default_fine_amount
- default_penalty_points
- severity_level (minor | major | critical)
```

#### 8. **traffic_complaints** (Complaint Record)
```sql
- complaint_number (unique)
- driver_id, officer_id, vehicle_id
- violation_id, station_id
- location, latitude, longitude
- incident_description, evidence_photos[]
- complaint_date, complaint_time
- status (reported | under_review | resolved | dismissed | appealed)
- resolved_at
```

#### 9. **traffic_fines** (Fine Record)
```sql
- fine_number (unique)
- complaint_id, driver_id, officer_id
- violation_id, vehicle_id
- fine_amount, penalty_points
- issued_date, due_date, payment_deadline
- status (issued | paid | overdue | disputed | waived)
- paid_date
```

#### 10. **fine_payments** (Payment Record)
```sql
- payment_reference (unique)
- fine_id, driver_id
- amount_paid
- payment_method (card | bank_transfer | cash | online | eservice)
- transaction_id (unique, external)
- payment_gateway, receipt_url
- status (pending | completed | failed | refunded)
- payment_date
```

#### 11. **fine_appeals** (Appeal Record)
```sql
- appeal_number (unique)
- fine_id, driver_id, complaint_id
- appeal_reason, supporting_documents[]
- status (pending | under_review | accepted | rejected)
- reviewed_by_id (FK → admin_users)
- appeal_date, reviewed_date
```

#### 12. **Audit & Logging Tables**
- **audit_logs** - All user actions
- **notifications** - User notifications
- **session_logs** - Login/logout tracking
- **dashboard_statistics** - Daily statistics

### Relationships Diagram
```
auth.users
    ↓
users (profile)
    ├─→ drivers
    │    ├─→ driver_vehicles
    │    ├─→ traffic_complaints
    │    ├─→ traffic_fines
    │    └─→ fine_payments
    ├─→ police_officers
    │    ├─→ police_stations
    │    ├─→ traffic_complaints (as officer)
    │    └─→ traffic_fines (as officer)
    └─→ admin_users
         └─→ fine_appeals (as reviewer)

traffic_violations
    └─→ traffic_complaints
    └─→ traffic_fines

traffic_complaints
    └─→ traffic_fines
```

---

## User Types & Workflows

### Driver Workflow
```
1. SIGNUP → Create account with NIC, License
   ↓
2. LOGIN → JWT auth token issued
   ↓
3. VIEW PROFILE → See license, vehicles, status
   ↓
4. VEHICLE MGMT → Add/manage vehicles
   ↓
5. VIEW COMPLAINTS → See filed violations
   ↓
6. VIEW FINES → See issued fines with status
   ↓
7. RECENT PAYMENTS → See payment history
   ↓
8. DISPUTE FINE → Appeal with documents
   ↓
9. PAY FINE → Online payment integration
   ↓
10. NOTIFICATIONS → Real-time updates
```

### Police Officer Workflow
```
1. SIGNUP → Admin approval required (badge #)
   ↓
2. LOGIN → JWT auth token issued
   ↓
3. ASSIGNED STATION → View station details
   ↓
4. CREATE COMPLAINT → File traffic violation
   ↓
5. SELECT VIOLATION → Choose from registry
   ↓
6. ISSUE FINE → Auto-calculate fine amount
   ↓
7. ASSIGNED COMPLAINTS → View own cases
   ↓
8. MANAGE STATUS → Update complaint status
   ↓
9. STATISTICS → View issued fines
```

### Admin Workflow
```
1. SIGNUP → Manual creation with admin code
   ↓
2. LOGIN → JWT auth token issued
   ↓
3. DASHBOARD → System-wide statistics
   ↓
4. VIEW ALL COMPLAINTS → Filter by status/priority
   ↓
5. VIEW ALL FINES → Analytics
   ↓
6. REVIEW APPEALS → Approve/reject disputes
   ↓
7. MANAGE VIOLATIONS → Add/edit violation types
   ↓
8. AUDIT LOGS → Review all actions
   ↓
9. USER MANAGEMENT → Manage accounts
   ↓
10. STATISTICS → Daily reports
```

---

## Installation

### 1. Create Supabase Project
- Go to https://supabase.com
- Create new project
- Note Project URL and API Keys

### 2. Add Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://hnjucgbzlhztgugnnqaw.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 4. Run Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Create New Query
3. Paste `supabase/schema.sql` content
4. Execute all queries

### 5. Configure RLS Policies
- Go to Authentication → Policies
- Review enabled RLS policies
- Adjust based on requirements

### 6. Add Sample Data (Optional)
- 5 Police stations
- 15 Traffic violations
- Sample users for testing

---

## API Services

### Authentication Service
```javascript
import { authService } from './src/services/authService';

// Register
await authService.register(email, password, userData);

// Login
const { user, session } = await authService.login(email, password);

// Logout
await authService.logout();

// Get current user
const { user, profile } = await authService.getCurrentUser();

// Reset password
await authService.requestPasswordReset(email);
```

### Driver Service Helpers
```javascript
import { driverHelpers } from './src/lib/supabase';

// Get driver profile
const profile = await driverHelpers.getDriverProfile(driverId);

// Get fines
const fines = await driverHelpers.getDriverFines(driverId);

// Get recent payments
const payments = await driverHelpers.getDriverPayments(driverId, limit: 10);

// Get complaints
const complaints = await driverHelpers.getDriverComplaints(driverId);
```

### Complaint Service
```javascript
import { complaintService } from './src/services/complaintService';

// Create complaint
await complaintService.createComplaint(complaintData);

// Get all complaints
const complaints = await complaintService.getAllComplaints(filters);

// Update status
await complaintService.updateComplaintStatus(id, status);
```

### Fine Service
```javascript
import { fineService } from './src/services/fineService';

// Issue fine
await fineService.issueFine(fineData);

// Get fines
const fines = await fineService.getDriverFines(driverId);

// Dispute fine
await fineService.disputeFine(fineId, reason, documents);

// Waive fine (admin)
await fineService.waiveFine(fineId, reason);
```

### Payment Service
```javascript
import { paymentService } from './src/services/paymentService';

// Get payments
const payments = await paymentService.getDriverPayments(driverId);

// Create payment
const payment = await paymentService.createPayment(paymentData);

// Complete payment
await paymentService.completePayment(paymentId, transactionId);

// Refund payment (admin)
await paymentService.refundPayment(paymentId, reason);
```

---

## Security & RLS

### Row Level Security Policies Enabled

#### Users Table
- Users can view/update own profile
- Admins can view all users

#### Drivers Table
- Drivers see only own record
- Police/Admins see all drivers

#### Traffic_Fines Table
- Drivers see only own fines
- Police/Admins see all fines

#### Notifications Table
- Users see only own notifications

#### Audit_Logs Table
- Users see own actions only
- Admins see all logs

### JWT Token Management
- Tokens auto-refresh on expiry
- Secure session storage
- Tokens included in all authenticated requests

### Password Security
- Minimum 8 characters required
- Hashed server-side
- Reset via email

---

## Deployment

### Pre-Deployment Checklist
- [ ] Environment variables set in production
- [ ] RLS policies reviewed
- [ ] Backups configured
- [ ] SSL certificate enabled
- [ ] Rate limiting configured
- [ ] Email templates configured
- [ ] Search paths optimized

### Deploy Steps
1. Build: `npm run build`
2. Test: `npm run preview`
3. Deploy to hosting
4. Update Supabase URL in settings
5. Configure CORS if needed
6. Monitor logs

### Scaling Considerations
- Database indexes are pre-configured
- Pagination recommended for large result sets
- Cache policy headers set
- Connection pooling enabled

---

## Support & Troubleshooting

### Common Issues

**JWT Token Expired**
```javascript
// Automatically handled by Supabase client
// If manual: await supabase.auth.refreshSession()
```

**RLS Policy Blocking Access**
- Check user role matches policy
- Verify auth user is logged in
- Check policy conditions

**Connection Timeout**
- Check internet connection
- Verify Supabase project is active
- Check API rate limits

### Debugging
```javascript
// Enable verbose logging
supabase.on('*', (payload) => console.log(payload));

// Check current session
const { data, error } = await supabase.auth.getSession();
```

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/functions.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## Project Structure
```
src/
├── lib/
│   └── supabase.js              # Supabase client & helpers
├── services/
│   ├── authService.js           # Authentication
│   ├── complaintService.js      # Complaints
│   ├── fineService.js           # Fines
│   └── paymentService.js        # Payments
├── pages/
│   ├── LoginPage.jsx            # Multi-role login
│   └── SignUpPage.jsx           # Multi-role signup
└── context/
    └── AuthContext.jsx          # Auth state management

supabase/
├── schema.sql                   # Complete database schema
└── README.md                    # Setup documentation
```

---

**Version**: 1.0
**Last Updated**: March 4, 2026
**Status**: Production Ready ✅
