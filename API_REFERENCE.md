# 🔧 Service API Quick Reference

## Authentication Service

### `authService.register(email, password, userData)`
Register new user with role
```javascript
const result = await authService.register('user@example.com', 'Pass123!', {
  role: 'driver',
  full_name: 'John Doe',
  phone: '+94712345678',
  // role-specific fields
});
// Returns: { success: true/false, user, error }
```

### `authService.login(email, password)`
Login existing user
```javascript
const result = await authService.login('user@example.com', 'Pass123!');
// Returns: { success: true/false, user, error }
```

### `authService.logout()`
Logout current user
```javascript
await authService.logout();
```

### `authService.getCurrentUser()`
Get logged-in user details
```javascript
const result = await authService.getCurrentUser();
// Returns: { success: true, user: {...}, profile: {...} }
```

---

## Complaint Service

### `complaintService.getDriverComplaints(driverId, limit=10)`
Get driver's complaints
```javascript
const result = await complaintService.getDriverComplaints('driver-uuid');
// Returns: { success: true, complaints: [...] }
// Fields: id, complaint_number, status, violation, fine, created_at
```

### `complaintService.getComplaintById(complaintId)`
Get complaint details
```javascript
const result = await complaintService.getComplaintById('complaint-uuid');
// Returns: { success: true, complaint: {...} }
```

### `complaintService.createComplaint(data)`
File new complaint (Police/Admin only)
```javascript
const result = await complaintService.createComplaint({
  driver_id: 'uuid',
  vehicle_id: 'uuid',
  station_id: 'uuid',
  violation_id: 'uuid',
  location: 'Main Street, Colombo',
  incident_description: 'Vehicle was speeding at 80km/h in 50km zone',
  weather_condition: 'clear',
  road_condition: 'wet'
});
// Returns: { success: true, complaint: {...} }
```

### `complaintService.updateComplaintStatus(complaintId, status, notes)`
Update complaint status: `pending` | `investigating` | `resolved`
```javascript
const result = await complaintService.updateComplaintStatus(
  'complaint-uuid',
  'resolved',
  'Fine issued'
);
```

### `complaintService.getAllComplaints(filters, limit=50)`
Get all complaints (Admin/Police)
```javascript
const result = await complaintService.getAllComplaints({
  status: 'pending',
  start_date: '2026-01-01',
  end_date: '2026-03-31',
  station_id: 'uuid'
});
```

### `complaintService.getViolations()`
Get list of violation types
```javascript
const result = await complaintService.getViolations();
// Returns: [{ id, violation_name, default_fine_amount, penalty_points }, ...]
```

---

## Fine Service

### `fineService.getDriverFines(driverId, status=null, limit=20)`
Get driver's fines, optionally filtered by status
```javascript
const result = await fineService.getDriverFines('driver-uuid', 'unpaid');
// Returns: { success: true, fines: [...] }
// Statuses: issued | overdue | paid | waived | disputed
// Fields: fine_number, amount, due_date, status, penalty_points, created_at
```

### `fineService.getFineById(fineId)`
Get fine details
```javascript
const result = await fineService.getFineById('fine-uuid');
// Returns: { success: true, fine: {...} }
```

### `fineService.issueFine(data)`
Issue new fine (Police only)
```javascript
const result = await fineService.issueFine({
  complaint_id: 'complaint-uuid',
  driver_id: 'driver-uuid',
  vehicle_id: 'vehicle-uuid',
  officer_id: 'officer-uuid',
  violation_id: 'violation-uuid',
  fine_amount: 5000,
  penalty_points: 12,
  due_date: '2026-04-04',
  notes: 'Speed exceeded by 30km/h'
});
// Returns: { success: true, fine: {...} }
```

### `fineService.disputeFine(fineId, reason, documentUrls=[])`
Dispute/appeal fine (Driver only)
```javascript
const result = await fineService.disputeFine(
  'fine-uuid',
  'I was not speeding. Radar must be faulty.',
  ['evidence-url-1', 'evidence-url-2']
);
// Returns: { success: true, appeal: {...} }
```

### `fineService.updateFineStatus(fineId, status, notes)`
Update fine status: `issued` | `unpaid` | `overdue` | `paid` | `waived` | `disputed`
```javascript
const result = await fineService.updateFineStatus(
  'fine-uuid',
  'paid',
  'Payment received'
);
```

### `fineService.getAllFines(filters, limit=50)`
Get all fines (Admin/Police)
```javascript
const result = await fineService.getAllFines({
  status: 'unpaid',
  start_date: '2026-01-01',
  officer_id: 'uuid'
});
```

### `fineService.getDriverStatistics(driverId)`
Get driver fine statistics
```javascript
const result = await fineService.getDriverStatistics('driver-uuid');
// Returns: {
//   total_fines_count,
//   total_fines_amount,
//   total_paid_amount,
//   pending_fines_count,
//   total_penalty_points,
//   avg_fine_amount
// }
```

### `fineService.getFineStatistics()`
Get system fine statistics (Admin)
```javascript
const result = await fineService.getFineStatistics();
// Returns: {
//   total_fines_count,
//   total_amount,
//   collected_amount,
//   pending_amount,
//   waived_amount,
//   disputed_count
// }
```

---

## Payment Service

### `paymentService.getDriverPayments(driverId, limit=20)`
Get driver's payments
```javascript
const result = await paymentService.getDriverPayments('driver-uuid');
// Returns: { success: true, payments: [...] }
// Fields: id, fine_number, amount_paid, payment_method, status, created_at
```

### `paymentService.getPaymentById(paymentId)`
Get payment details
```javascript
const result = await paymentService.getPaymentById('payment-uuid');
```

### `paymentService.createPayment(data)`
Create payment record (before processing)
```javascript
const result = await paymentService.createPayment({
  fine_id: 'fine-uuid',
  driver_id: 'driver-uuid',
  amount_paid: 5000,
  payment_method: 'card' // 'card' | 'bank_transfer' | 'cash'
});
// Returns: { success: true, payment: {...} }
// Payment starts in 'pending' status
```

### `paymentService.completePayment(paymentId, transactionId, receiptUrl)`
Mark payment as completed (after gateway confirms)
```javascript
const result = await paymentService.completePayment(
  'payment-uuid',
  'TXN-123456789',
  'receipt-url'
);
// Returns: { success: true, payment: {...} }
// Automatically updates fine status to 'paid'
```

### `paymentService.failPayment(paymentId, reason)`
Mark payment as failed
```javascript
const result = await paymentService.failPayment(
  'payment-uuid',
  'Card declined'
);
```

### `paymentService.refundPayment(paymentId, reason)`
Refund payment (Admin only)
```javascript
const result = await paymentService.refundPayment(
  'payment-uuid',
  'Duplicate payment'
);
// Returns fine status to 'unpaid'
```

### `paymentService.getAllPayments(filters, limit=50)`
Get all payments (Admin/Police)
```javascript
const result = await paymentService.getAllPayments({
  status: 'completed',
  payment_method: 'card',
  start_date: '2026-01-01'
});
```

### `paymentService.getPaymentStatistics()`
Get system payment statistics
```javascript
const result = await paymentService.getPaymentStatistics();
// Returns: {
//   total_payments,
//   total_amount,
//   pending_amount,
//   by_method: { card: ..., bank_transfer: ..., cash: ... }
// }
```

### `paymentService.generateReceipt(paymentId)`
Generate payment receipt
```javascript
const result = await paymentService.generateReceipt('payment-uuid');
// Returns: {
//   receipt_number,
//   fine_number,
//   driver_name,
//   amount,
//   payment_method,
//   transaction_id,
//   date,
//   payment_status
// }
```

---

## Using with React Components

### Setup useAuth Hook
```jsx
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { user, userProfile, isDriver, isPolice, isAdmin } = useAuth()

  if (!user) return <p>Not logged in</p>

  return (
    <div>
      <p>Name: {userProfile.full_name}</p>
      <p>Role: {userProfile.user_type}</p>
      {isDriver && <p>License: {userProfile.license_number}</p>}
    </div>
  )
}
```

### Fetch Data on Mount
```jsx
import { useEffect, useState } from 'react'
import { complaintService } from './services/complaintService'
import { useAuth } from './context/AuthContext'

function ComplaintList() {
  const { userProfile } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const result = await complaintService.getDriverComplaints(userProfile.id)
        if (result.success) {
          setComplaints(result.complaints)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userProfile?.id) {
      fetchComplaints()
    }
  }, [userProfile?.id])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      {complaints.map(complaint => (
        <div key={complaint.id}>
          <h3>{complaint.complaint_number}</h3>
          <p>{complaint.violation.violation_name}</p>
          <p>Status: {complaint.status}</p>
        </div>
      ))}
    </div>
  )
}
```

### Handle Async Actions
```jsx
async function handleDispute() {
  setLoading(true)
  setError(null)

  try {
    const result = await fineService.disputeFine(
      fineId,
      reason,
      documentUrls
    )

    if (result.success) {
      setSuccess('Appeal submitted successfully!')
      // Refresh data
      setFines(prev => prev.map(f => 
        f.id === fineId ? {...f, status: 'disputed'} : f
      ))
    } else {
      setError(result.error)
    }
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

---

## Error Handling Pattern

```javascript
// Generic error handler
const handleServiceCall = async (serviceCall, setError, setSuccess) => {
  try {
    const result = await serviceCall()
    
    if (result.success) {
      setSuccess('Operation completed')
      return result
    } else {
      setError(result.error || 'Unknown error occurred')
      return null
    }
  } catch (err) {
    console.error('Service error:', err)
    setError(err.message || 'Connection error')
    return null
  }
}

// Usage
const result = await handleServiceCall(
  () => fineService.getDriverFines(driverId),
  setError,
  setSuccess
)
```

---

## Response Format

All service methods return:
```javascript
{
  success: boolean,
  data: object | array | null,
  error: string | null,
  code: string | null,
  timestamp: string
}
```

Example:
```javascript
{
  success: true,
  data: {
    id: 'uuid',
    fine_number: 'FINE-2026-001',
    amount: 5000,
    due_date: '2026-04-04'
  },
  error: null,
  code: null,
  timestamp: '2026-03-04T10:30:00Z'
}
```

---

## Filtering Patterns

### Date Filtering
```javascript
const result = await complaintService.getAllComplaints({
  start_date: '2026-01-01',
  end_date: '2026-03-31'
})
```

### Status Filtering
```javascript
const result = await fineService.getDriverFines(driverId, 'unpaid')
// Valid statuses: issued, unpaid, overdue, paid, waived, disputed
```

### Multiple Filters
```javascript
const result = await fineService.getAllFines({
  status: 'unpaid',
  officer_id: 'uuid',
  start_date: '2026-01-01',
  limit: 50
})
```

---

**Last Updated**: March 4, 2026
**Version**: 2.0
