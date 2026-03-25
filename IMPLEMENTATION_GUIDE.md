# Complete Supabase Integration Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
npm install react-router-dom  # for routing
```

### 2. Configure Environment
Create `.env.local`:
```env
VITE_SUPABASE_URL=https://hnjucgbzlhztgugnnqaw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Initialize Supabase Schema
1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy-paste entire `supabase/schema.sql`
4. Execute

### 4. Update App.jsx
```jsx
import { AuthProvider } from './context/AuthContext.new';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Add dashboard routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

---

## 📱 Page Integration

### Login Page Integration
```jsx
import LoginPage from './pages/LoginPage';

// Add to routes in App.jsx
<Route path="/login" element={<LoginPage />} />
```

### Signup Page Integration
```jsx
import SignUpPage from './pages/SignUpPage';

// Add to routes in App.jsx
<Route path="/signup" element={<SignUpPage />} />
```

---

## 🎯 Service Usage Examples

### Authentication
```javascript
import { authService } from './services/authService';
import { useAuth } from './context/AuthContext.new';

// In a component
const MyComponent = () => {
  const { user, signin, signup, signout } = useAuth();

  const handleLogin = async () => {
    const result = await signin('user@example.com', 'password');
    if (result.success) {
      console.log('Logged in:', result.user);
    }
  };

  return (
    <div>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={handleLogin}>Sign In</button>
      <button onClick={signout}>Sign Out</button>
    </div>
  );
};
```

### Driver Operations
```javascript
import { driverHelpers } from './lib/supabase';

// Get driver profile
const profile = await driverHelpers.getDriverProfile(driverId);

// Get fines
const fines = await driverHelpers.getDriverFines(driverId);

// Recent payments
const payments = await driverHelpers.getDriverPayments(driverId);

// Register vehicle
const vehicle = await driverHelpers.addVehicle(driverId, {
  registration_number: 'ABC-1234',
  vehicle_type: 'Car',
  make: 'Toyota',
  model: 'Corolla',
  year: 2022,
  insurance_expiry: '2025-12-31'
});
```

### Police Operations
```javascript
import { policeHelpers } from './lib/supabase';

// Issue fine
const fine = await policeHelpers.issueFine({
  complaint_id: 'uuid',
  driver_id: 'uuid',
  officer_id: 'uuid',
  violation_id: 'uuid',
  fine_amount: 5000,
  penalty_points: 12,
  due_date: '2026-04-04'
});

// Create complaint
const complaint = await policeHelpers.createComplaint({
  driver_id: 'uuid',
  vehicle_id: 'uuid',
  station_id: 'uuid',
  violation_id: 'uuid',
  location: 'Main Street',
  incident_description: 'Speeding violation'
});
```

### Admin Operations
```javascript
import { adminHelpers } from './lib/supabase';

// Get all complaints
const complaints = await adminHelpers.getAllComplaints({
  status: 'pending'
});

// Review appeal
const result = await adminHelpers.reviewAppeal(
  appealId,
  'accepted',  // or 'rejected'
  'Fine waived due to technical error'
);

// Get statistics
const stats = await adminHelpers.getDashboardStats();
```

### Complaint Service
```javascript
import { complaintService } from './services/complaintService';

// Get driver complaints
const result = await complaintService.getDriverComplaints(driverId);
if (result.success) {
  console.log(result.complaints);
}

// Update status
const updated = await complaintService.updateComplaintStatus(
  complaintId,
  'resolved',
  'Issue addressed'
);
```

### Fine Service
```javascript
import { fineService } from './services/fineService';

// Get driver fines
const { fines } = await fineService.getDriverFines(driverId);

// Dispute fine
const appeal = await fineService.disputeFine(
  fineId,
  'I was not speeding',
  ['document-url-1', 'document-url-2']
);

// Get statistics
const stats = await fineService.getFineStatistics();
```

### Payment Service
```javascript
import { paymentService } from './services/paymentService';

// Get payments
const { payments } = await paymentService.getDriverPayments(driverId);

// Create payment
const payment = await paymentService.createPayment({
  fine_id: 'uuid',
  driver_id: 'uuid',
  amount_paid: 5000,
  payment_method: 'card'
});

// Complete payment
const completed = await paymentService.completePayment(
  paymentId,
  'TXN-123456',
  'receipt-url'
);

// Get statistics
const { statistics } = await paymentService.getPaymentStatistics();
```

---

## 🛠️ Role-Based Page Structure

### Driver Pages
```
/driver/
  ├── dashboard/          # Main dashboard
  ├── profile/            # View/edit profile
  ├── vehicles/           # Manage vehicles
  ├── complaints/         # View complaints
  ├── fines/              # View fines
  ├── fines/:id           # Fine details & dispute
  ├── payments/           # Payment history
  ├── payments/new        # Make payment
  └── notifications/      # View notifications
```

### Police Pages
```
/police/
  ├── dashboard/          # Main dashboard
  ├── profile/            # View/edit profile
  ├── create-complaint/   # File complaint
  ├── assigned/           # Assigned complaints
  ├── complaints/:id      # Complaint details
  ├── issue-fine/         # Issue fine
  ├── fines/              # View issued fines
  └── notifications/      # View notifications
```

### Admin Pages
```
/admin/
  ├── dashboard/          # Main dashboard
  ├── profile/            # View/edit profile
  ├── complaints/         # All complaints
  ├── complaints/:id      # Complaint details
  ├── fines/              # All fines
  ├── payments/           # All payments
  ├── appeals/            # Fine appeals
  ├── appeals/:id         # Appeal details
  ├── violations/         # Manage violations
  ├── users/              # User management
  ├── audit-logs/         # Audit trail
  └── reports/            # Statistics
```

---

## 🔐 Advanced Features

### Real-time Notifications
```javascript
// Subscribe to notifications
supabase
  .from('notifications')
  .on('INSERT', payload => {
    console.log('New notification:', payload);
  })
  .subscribe();
```

### Audit Logging
```javascript
import { auditHelpers } from './lib/supabase';

await auditHelpers.logAction(
  'VIEW_FINE',
  'traffic_fine',
  fineId,
  null,
  { viewed_by: userId }
);
```

### Statistics Dashboard
```javascript
import { supabase } from './lib/supabase';

const { data: stats } = await supabase
  .from('dashboard_statistics')
  .select('*')
  .eq('stat_date', new Date().toISOString().split('T')[0])
  .single();
```

### Search & Filter
```javascript
// Search complaints
const { data: results } = await supabase
  .from('traffic_complaints')
  .select('*')
  .textSearch('incident_description', 'speeding')
  .order('complaint_date', { ascending: false });
```

---

## 🔄 Data Flow Diagrams

### Complaint Registration Flow
```
Driver/Police
    ↓
Create Complaint
    ↓
Generate complaint_number
    ↓
Insert to traffic_complaints
    ↓
Notify Police Station
    ↓
Log Audit
    ↓
Send Notification
```

### Fine  Payment Flow
```
Driver Pays
    ↓
Create Payment Record (pending)
    ↓
Process Payment Gateway
    ↓
Mark as Completed
    ↓
Update Fine Status (paid)
    ↓
Update Driver Statistics
    ↓
Send Notification
    ↓
Generate Receipt
    ↓
Log Audit
```

### Appeal Flow
```
Driver Disputes Fine
    ↓
Create Appeal Record (pending)
    ↓
Update Fine Status (disputed)
    ↓
Notify Admin
    ↓
Admin Reviews
    ↓
Accept/Reject Decision
    ↓
Update Fine Status (waived/active)
    ↓
Notify Driver
    ↓
Log Audit
```

---

## 📊 Key Database Functions

### Auto Calculate Driver Stats
```sql
-- Called when fine is issued/paid
SELECT update_driver_statistics($1);
```

### Log User Login
```sql
-- Called on signin
SELECT log_user_login($1);
```

### Update Timestamps
```sql
-- Automatic trigger on all tables
NEW.updated_at = CURRENT_TIMESTAMP;
```

---

## 🧪 Testing Examples

### Test Driver Login
```javascript
// Valid driver
Email: driver@example.com
Password: TestPassword123!

// Should create driver profile with:
- NIC: 123456789V
- License: DLN001
- License Expiry: 2027-12-31
```

### Test Police Login
```javascript
// Valid officer
Email: officer@example.com
Password: TestPassword123!

// Should create police profile with:
- Badge: POL-001
- Rank: Constable
- Station: Central Traffic Police Station
```

### Test Admin Login
```javascript
// Valid admin
Email: admin@example.com
Password: TestPassword123!

// Should create admin profile with:
- Admin Code: ADM001
- Role Level: manager
- Department: Administration
```

---

## 📈 Performance Optimization

### Indexes
- All foreign keys indexed
- Status fields indexed for filtering
- Date fields indexed for sorting
- Search fields indexed

### Query Optimization
```javascript
// Bad: No limit
const all = await supabase.from('complaints').select('*');

// Good: With pagination
const page1 = await supabase
  .from('complaints')
  .select('*')
  .range(0, 9)
  .order('created_at', { ascending: false });
```

### Caching Strategy
```javascript
// Cache user profile
const profile = JSON.parse(localStorage.getItem('userProfile')) 
  || await getProfile();
```

---

## 🚨 Error Handling

### Standardized Error Response
```javascript
{
  success: false,
  error: "Human readable error message",
  code: "ERROR_CODE"
}
```

### Common Errors
- `PGRST116` - No rows found (not critical)
- `42501` - Insufficient permissions (RLS)
- `23505` - Unique constraint violation
- `08006` - Connection failure

---

## 📝 Checklist Before Production

- [ ] All environment variables configured
- [ ] Database schema applied
- [ ] RLS policies reviewed
- [ ] Indexes created
- [ ] Sample data inserted
- [ ] All services tested
- [ ] Authentication flow tested
- [ ] Error handling implemented
- [ ] Audit logging working
- [ ] Notifications functional
- [ ] Rate limiting configured
- [ ] Backups enabled
- [ ] SSL certificate installed
- [ ] CORS configured
- [ ] Monitoring enabled

---

## 🎓 Learning Resources

- [Supabase Official Docs](https://supabase.com/docs)
- [PostrgreSQL Guide](https://www.postgresql.org/docs/)
- [React Authentication Patterns](https://reactjs.org/docs/hooks-intro.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated**: March 4, 2026
**Version**: 2.0
**Status**: Production Ready ✅
