# Supabase Database Setup Guide

## Overview
This project uses Supabase as the backend database for the Traffic Complaint Management System. The system manages user authentication, traffic complaints, fines, payments, and audit logs.

## Database Tables

### Core Tables

1. **users** - Main user account information
   - Stores: id, email, NIC, officer_id, admin_id, name, phone, role, status
   - Roles: driver, police, admin

2. **drivers** - Driver-specific information
   - Linked to users table
   - Stores: license_number, vehicle_registration, insurance info

3. **police_officers** - Police officer information
   - Linked to users table
   - Stores: badge_number, station, rank, department

4. **admin_users** - Admin user information
   - Linked to users table
   - Stores: admin_code, department, permissions

5. **police_stations** - Police station details
   - Stores: name, location, address, contact info, coordinates

### Traffic Complaint Tables

6. **complaints** - Traffic complaints
   - Stores: complaint_number, driver_id, officer_id, location, status, priority
   - Status: pending, under_review, resolved, dismissed, appealed

7. **fines** - Traffic fines issued
   - Stores: fine_number, complaint_id, fine_amount, status, due_date
   - Status: pending, paid, overdue, disputed, waived

8. **payments** - Payment records
   - Stores: payment_reference, fine_id, amount, method, status
   - Status: pending, completed, failed, refunded

### Management Tables

9. **audit_logs** - Complete audit trail
   - Logs all user actions and changes

10. **notifications** - User notifications
    - Stores: title, message, type, read status

11. **appeal_requests** - Fine/complaint appeals
    - Stores: appeal_number, fine_id, reason, status

12. **session_logs** - User session tracking
    - Logs login/logout times and session duration

## Environment Setup

### 1. Create `.env.local` file in project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Get Credentials from Supabase:
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon Key → `VITE_SUPABASE_ANON_KEY`

## Installation

### 1. Install Dependencies:
```bash
npm install
```

### 2. Run Database Schema:
In Supabase SQL Editor, copy and paste the contents of `supabase/schema.sql` and execute.

### 3. Set Row Level Security (RLS) Policies:
Configure RLS policies in Supabase Dashboard for data access control.

## Services

### Authentication Service (`src/services/authService.js`)
```javascript
import { authService } from './services/authService';

// Authenticate driver
const result = await authService.authenticateDriver(nicNumber);

// Authenticate police officer
const result = await authService.authenticateOfficer(badgeNumber);

// Register new driver
const result = await authService.registerDriver(userData);
```

### Complaint Service (`src/services/complaintService.js`)
```javascript
import { complaintService } from './services/complaintService';

// Get driver complaints
const complaints = await complaintService.getDriverComplaints(driverId);

// Create new complaint
const complaint = await complaintService.createComplaint(complaintData);

// Update complaint status
await complaintService.updateComplaintStatus(complaintId, 'resolved');
```

### Fine Service (`src/services/fineService.js`)
```javascript
import { fineService } from './services/fineService';

// Get driver fines
const fines = await fineService.getDriverFines(driverId);

// Issue new fine
const fine = await fineService.issueFine(fineData);

// Dispute fine
const appeal = await fineService.disputeFine(fineId, reason);
```

### Payment Service (`src/services/paymentService.js`)
```javascript
import { paymentService } from './services/paymentService';

// Get payments
const payments = await paymentService.getDriverPayments(driverId);

// Create payment
const payment = await paymentService.createPayment(paymentData);

// Complete payment
await paymentService.completePayment(paymentId, transactionId);
```

## Supabase Client (`src/lib/supabase.js`)

The Supabase client is configured in `src/lib/supabase.js` and exported with helper functions for common database operations.

## Security Notes

⚠️ **IMPORTANT**:
1. Never commit `.env.local` (add it to `.gitignore`)
2. Keep credentials private
3. Use `.env.example` for showing required environment variables
4. Rotate credentials if accidentally exposed

## Database Schema Highlights

### Indexes
- Optimized indexes on role, status, driver_id, officer_id, created_at for fast queries

### Triggers
- Automatic `updated_at` timestamp updates on all main tables

### Row Level Security
- Implement RLS policies to ensure:
  - Drivers can only see their own data
  - Officers can see their assigned complaints
  - Admins have full access

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] RLS policies configured
- [ ] Sample police stations data inserted (if needed)
- [ ] User roles and permissions set
- [ ] Test authentication flows
- [ ] Verify audit logging works

## Troubleshooting

### Connection Issues
- Verify Supabase URL and API key
- Check internet connection
- Ensure project is not in "paused" state

### Authentication Fails
- Confirm user exists in database
- Check user role and status
- Verify NIC/badge number format

### Queries Return Empty
- Verify RLS policies are not blocking access
- Check user has correct role
- Confirm data exists in database

## Support

For more info, visit: https://supabase.com/docs
