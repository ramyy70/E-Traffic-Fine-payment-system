# ✅ File Consolidation Checklist

## Current Status: Need to Clean Up Temporary Files

During implementation, the following temporary files were created. You need to consolidate them by moving content to the original files.

---

## Step 1: Update `AuthContext.jsx`

### Option A: Using Terminal (Recommended if rename works)

```powershell
# Windows PowerShell
Move-Item -Path "src/context/AuthContext.new.jsx" -Destination "src/context/AuthContext.jsx" -Force
```

### Option B: Manual Copy/Paste

1. **Open** `src/context/AuthContext.new.jsx`
2. **Select All** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Open** `src/context/AuthContext.jsx`
5. **Select All** (Ctrl+A)
6. **Paste** (Ctrl+V)
7. **Save** (Ctrl+S)
8. **Delete** `src/context/AuthContext.new.jsx`

✅ **Result:** `src/context/AuthContext.jsx` is now the production version

---

## Step 2: Update `fineService.js`

### Option A: Using Terminal

```powershell
# Windows PowerShell
$content = Get-Content "src/services/fineService2.js" -Raw
Set-Content "src/services/fineService.js" -Value $content
Remove-Item "src/services/fineService2.js"
```

### Option B: Manual Copy/Paste

1. **Open** `src/services/fineService2.js`
2. **Select All** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Open** `src/services/fineService.js`
5. **Select All** (Ctrl+A)
6. **Paste** (Ctrl+V)
7. **Save** (Ctrl+S)
8. **Delete** `src/services/fineService2.js`

✅ **Result:** `src/services/fineService.js` has all new methods

---

## Step 3: Update `paymentService.js`

### Option A: Using Terminal

```powershell
# Windows PowerShell
$content = Get-Content "src/services/paymentService2.js" -Raw
Set-Content "src/services/paymentService.js" -Value $content
Remove-Item "src/services/paymentService2.js"
```

### Option B: Manual Copy/Paste

1. **Open** `src/services/paymentService2.js`
2. **Select All** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Open** `src/services/paymentService.js`
5. **Select All** (Ctrl+A)
6. **Paste** (Ctrl+V)
7. **Save** (Ctrl+S)
8. **Delete** `src/services/paymentService2.js`

✅ **Result:** `src/services/paymentService.js` has all new methods

---

## Step 4: Verify Cleanup

After consolidation, you should **NOT** have these files anymore:
- ❌ `src/context/AuthContext.new.jsx`
- ❌ `src/services/fineService2.js`
- ❌ `src/services/paymentService2.js`

You should have these files instead:
- ✅ `src/context/AuthContext.jsx` (updated with new content)
- ✅ `src/services/fineService.js` (updated with new content)
- ✅ `src/services/paymentService.js` (updated with new content)

---

## Step 5: Verify No Imports Break

After consolidation, check that all imports still work:

```javascript
// These should work without errors:
import { AuthProvider, useAuth } from './context/AuthContext'
import { fineService } from './services/fineService'
import { paymentService } from './services/paymentService'
```

If you see import errors in VS Code:
1. Close VS Code
2. Delete `node_modules/.vite` folder
3. Reopen VS Code
4. Run `npm run dev`

---

## Step 6: Test Application

After consolidation, run tests:

```bash
npm run dev
```

Visit `http://localhost:5173` and verify:
- ✅ Signup page loads
- ✅ Can create new account
- ✅ Can login with new account
- ✅ Dashboard page loads (with 'Welcome' message)

---

## File Status Tracking

| File | Status | Action | Priority |
|------|--------|--------|----------|
| `src/context/AuthContext.jsx` | Update needed | Replace with AuthContext.new.jsx | 🔴 HIGH |
| `src/context/AuthContext.new.jsx` | Delete after | Move to AuthContext.jsx | 🔴 HIGH |
| `src/services/fineService.js` | Update needed | Replace with fineService2.js | 🔴 HIGH |
| `src/services/fineService2.js` | Delete after | Move to fineService.js | 🔴 HIGH |
| `src/services/paymentService.js` | Update needed | Replace with paymentService2.js | 🔴 HIGH |
| `src/services/paymentService2.js` | Delete after | Move to paymentService.js | 🔴 HIGH |

---

## Automated Cleanup Script (Windows PowerShell)

Run this in your project root folder to do all consolidation at once:

```powershell
# Consolidate AuthContext
Write-Host "Updating AuthContext.jsx..."
$authContent = Get-Content "src/context/AuthContext.new.jsx" -Raw
Set-Content "src/context/AuthContext.jsx" -Value $authContent
Remove-Item "src/context/AuthContext.new.jsx" -Force
Write-Host "✓ AuthContext consolidated"

# Consolidate fineService
Write-Host "Updating fineService.js..."
$fineContent = Get-Content "src/services/fineService2.js" -Raw
Set-Content "src/services/fineService.js" -Value $fineContent
Remove-Item "src/services/fineService2.js" -Force
Write-Host "✓ fineService consolidated"

# Consolidate paymentService
Write-Host "Updating paymentService.js..."
$paymentContent = Get-Content "src/services/paymentService2.js" -Raw
Set-Content "src/services/paymentService.js" -Value $paymentContent
Remove-Item "src/services/paymentService2.js" -Force
Write-Host "✓ paymentService consolidated"

Write-Host ""
Write-Host "✅ All files consolidated successfully!"
Write-Host "Next: Run 'npm run dev' to test"
```

**How to use:**
1. Open PowerShell in your project root
2. Copy-paste the script above
3. Press Enter
4. Run `npm run dev`

---

## What Each File Does After Consolidation

### `src/context/AuthContext.jsx`
- Manages global authentication state
- Provides `useAuth()` hook
- Handles JWT token lifecycle
- Provides role-checking utilities

**Usage:**
```jsx
import { useAuth } from './context/AuthContext'
const { user, userProfile, isDriver } = useAuth()
```

### `src/services/fineService.js`
- Get driver fines with filtering
- Issue new fines (police)
- Dispute/appeal fines (driver)
- Track fine statistics
- Update fine status

**Usage:**
```jsx
import { fineService } from './services/fineService'
const fines = await fineService.getDriverFines(driverId)
```

### `src/services/paymentService.js`
- Create payment records
- Process payments
- Handle refunds
- Generate receipts
- Payment statistics

**Usage:**
```jsx
import { paymentService } from './services/paymentService'
const payment = await paymentService.createPayment({...})
```

---

## Troubleshooting

### "File not found" error after consolidation
- Check file path is correct
- Run `npm run dev` again
- Clear browser cache (Ctrl+Shift+Delete)

### "Import not working" error
- Verify file was copied completely
- Check file has all `export` statements
- Restart dev server

### "Still seeing old code"
- Make sure temp file (e.g., fineService2.js) was deleted
- Check you edited the right file
- Close and reopen VS Code

---

## Next Steps After Consolidation

1. ✅ Consolidate files (this checklist)
2. ⏭️ Build DriverDashboard.jsx
3. ⏭️ Build PoliceDashboard.jsx
4. ⏭️ Build AdminDashboard.jsx
5. ⏭️ Add payment processing
6. ⏭️ Add email notifications

---

**Estimated Time**: 5 minutes
**Difficulty**: Easy
**Risk**: Low (just moving files around)

Ready to start? Follow the steps above! 🚀
