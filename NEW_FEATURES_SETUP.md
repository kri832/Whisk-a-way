# New Features Setup Guide

## Overview

This guide explains the three major features added to Whisk-a-Way:
1. **Email Verification System**
2. **Payment Method Details Display**
3. **Auto-fill Checkout Name**

---

## 1. Email Verification System

### What It Does
- Sends a verification email to new users upon registration
- Users must verify their email before they can log in
- Verification links expire after 24 hours
- Users can resend verification emails

### Setup Instructions

#### Step 1: Configure Email Settings

**IMPORTANT**: You need to update the email configuration in `/backend/.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Whisk-a-Way <your-email@gmail.com>
FRONTEND_URL=http://localhost:3000
```

#### Step 2: Generate Gmail App Password

If using Gmail:
1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security** from the left menu
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App passwords** (search for it)
5. Select **Mail** and your device
6. Click **Generate**
7. Copy the 16-character password
8. Paste it in `EMAIL_PASSWORD` in `.env`

#### Step 3: Install Dependencies

The `nodemailer` package has been installed. If you need to reinstall:

```bash
cd backend
npm install nodemailer
```

#### Step 4: Update Existing Users (Optional)

Existing users in the database will have `isVerified: false` by default. You have two options:

**Option A: Mark all existing users as verified**

Run this in MongoDB:
```javascript
db.users.updateMany({}, { $set: { isVerified: true } })
```

**Option B: Re-register users**

Users can create new accounts with the verification flow.

### How It Works

1. **Registration Flow:**
   - User fills out registration form
   - System creates account with `isVerified: false`
   - Generates verification token (valid for 24 hours)
   - Sends verification email with link
   - Redirects user to "Check Your Email" page

2. **Verification Flow:**
   - User clicks link in email
   - System validates token
   - Marks user as verified (`isVerified: true`)
   - Auto-logs user in
   - Redirects to homepage

3. **Login Flow:**
   - User enters email and password
   - System checks if `isVerified: true`
   - If not verified, blocks login with option to resend email
   - If verified, proceeds with login

4. **Resend Verification:**
   - Available on login page if user is not verified
   - Generates new token
   - Sends new verification email

### Files Modified/Created

**Backend:**
- `/backend/.env` - Email configuration
- `/backend/models/User.js` - Added verification fields
- `/backend/routes/auth.js` - Verification endpoints
- `/backend/utils/email.js` - Email service (NEW)

**Frontend:**
- `/frontend/src/App.js` - Added verification routes
- `/frontend/src/pages/Auth/Register.js` - Updated redirect
- `/frontend/src/pages/Auth/Login.js` - Added verification error handling
- `/frontend/src/pages/Auth/EmailVerification.js` - Verification page (NEW)
- `/frontend/src/pages/Auth/EmailVerification.css` - Styles (NEW)
- `/frontend/src/pages/Auth/VerifyEmailPrompt.js` - Email prompt (NEW)
- `/frontend/src/pages/Auth/VerifyEmailPrompt.css` - Styles (NEW)
- `/frontend/src/pages/Auth/Login.css` - Added resend button styles

---

## 2. Payment Method Details Display

### What It Does
- Shows UPI ID and QR code placeholder when UPI is selected
- Shows card payment form when Card is selected
- No payment details shown for Cash option
- Demo mode - no real payment processing

### How It Works

1. User selects payment method (Cash/Card/UPI)
2. If Card or UPI is selected, payment details section appears
3. **UPI Payment:**
   - Displays UPI ID: `whiskaway@paytm`
   - Shows QR code placeholder
   - Instructions to scan or use UPI ID

4. **Card Payment:**
   - Shows form with fields:
     - Card Number
     - Expiry Date (MM/YY)
     - CVV
     - Cardholder Name
   - Form is UI only (no validation or processing)

5. **Cash Payment:**
   - No additional details shown
   - Simple selection only

### Customization

To change UPI details, edit `/frontend/src/pages/Checkout/Checkout.js`:

```javascript
// Find this section around line 148
<span className="payment-value">whiskaway@paytm</span>
// Change to your UPI ID
```

### Files Modified

- `/frontend/src/pages/Checkout/Checkout.js` - Added payment details display
- `/frontend/src/pages/Checkout/Checkout.css` - Added payment details styles

---

## 3. Auto-fill Checkout Name

### What It Does
- **Regular Users:** Name field auto-fills with their account name
- **Admin Users:** Name field is empty (for taking customer orders)
- **Guest Users:** Name field is empty (manual entry required)
- All users can edit the pre-filled name

### How It Works

1. When user navigates to checkout:
   - System checks if user is logged in
   - Checks if user is admin or regular user
   
2. **Regular User:**
   - `customerName` state initialized with `user.name`
   - Shows helper text: "Using your account name. You can edit if needed."
   
3. **Admin User:**
   - `customerName` state initialized with empty string
   - Admin must manually enter customer name
   
4. **Guest (Not Logged In):**
   - `customerName` state initialized with empty string
   - Must enter name manually

### Implementation Details

```javascript
// In Checkout.js
const { user, isAdmin } = useAuth();

const [customerName, setCustomerName] = useState(
  user && !isAdmin ? user.name : ''
);
```

### Files Modified

- `/frontend/src/pages/Checkout/Checkout.js` - Added auto-fill logic
- `/frontend/src/pages/Checkout/Checkout.css` - Added helper text styles

---

## Testing Guide

### Test Email Verification

1. **New Registration:**
   ```
   - Go to /register
   - Fill out form with real email
   - Click "Create account"
   - Should redirect to "Check Your Email" page
   - Check email inbox for verification link
   - Click link
   - Should verify and auto-login
   ```

2. **Login Before Verification:**
   ```
   - Register new account (don't verify)
   - Go to /login
   - Try to login
   - Should see error: "Please verify your email"
   - Should see "Resend Verification Email" button
   - Click resend button
   - Should receive new verification email
   ```

3. **Expired Token:**
   ```
   - Register account
   - Wait 24 hours (or change token expiry in code for testing)
   - Try to use old verification link
   - Should show error with resend option
   ```

### Test Payment Details

1. **UPI Payment:**
   ```
   - Add items to cart
   - Go to checkout
   - Click "UPI" payment card
   - Should show UPI ID and QR placeholder
   - Place order
   - Check admin dashboard - should show "UPI" tag
   ```

2. **Card Payment:**
   ```
   - Add items to cart
   - Go to checkout
   - Click "Card" payment card
   - Should show card form
   - Fill out form (demo only)
   - Place order
   - Check admin dashboard - should show "CARD" tag
   ```

3. **Cash Payment:**
   ```
   - Add items to cart
   - Go to checkout
   - Click "Cash" payment card
   - Should NOT show any payment details
   - Place order
   - Check admin dashboard - should show "CASH" tag (green)
   ```

### Test Auto-fill Name

1. **Regular User:**
   ```
   - Login as regular user
   - Add items to cart
   - Go to checkout
   - Name field should be pre-filled with user's name
   - Should see helper text below name field
   - Can edit name if needed
   ```

2. **Admin User:**
   ```
   - Login as admin (admin@whiskaway.com / admin123)
   - Add items to cart
   - Go to checkout
   - Name field should be EMPTY
   - Must enter customer name manually
   ```

3. **Guest User:**
   ```
   - Logout (or use incognito)
   - Add items to cart (guest checkout if enabled)
   - Go to checkout
   - Name field should be EMPTY
   - Must enter name manually
   ```

---

## Troubleshooting

### Email Not Sending

**Problem:** Verification email not received

**Solutions:**
1. Check spam/junk folder
2. Verify email credentials in `.env` are correct
3. For Gmail, ensure App Password is generated (not regular password)
4. Check backend terminal for email errors
5. Test email service manually:
   ```javascript
   // In backend console
   node
   const email = require('./utils/email');
   email.sendVerificationEmail('test@example.com', 'test-token');
   ```

### Verification Link Not Working

**Problem:** Clicking verification link shows error

**Solutions:**
1. Check if link expired (24 hours)
2. Check if token was already used
3. Verify frontend URL in `.env` matches your setup
4. Check browser console for errors

### Payment Details Not Showing

**Problem:** Payment details section doesn't appear

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify `showPaymentDetails` state is updating
3. Check if payment method is 'card' or 'upi' (not 'cash')
4. Verify CSS is loaded (check for style errors)

### Name Not Auto-filling

**Problem:** Name field empty for logged-in user

**Solutions:**
1. Check if user is actually logged in (check localStorage)
2. Verify `user` object has `name` property
3. Check if user is admin (admin sees empty field by design)
4. Check browser console for errors

---

## Security Notes

### Email Verification
- Verification tokens are randomly generated (32 bytes)
- Tokens expire after 24 hours
- Tokens are single-use (cleared after verification)
- Password is hashed with bcrypt before storage

### Payment Details
- **DEMO MODE ONLY** - No real payment processing
- Card form does not validate or store card data
- No payment gateway integration
- For production, integrate with Stripe, Razorpay, or similar

### Best Practices
- Never commit `.env` file with real credentials
- Use environment variables for sensitive data
- Enable HTTPS in production
- Use proper payment gateway for real transactions
- Implement rate limiting for verification email requests

---

## Next Steps (Optional Enhancements)

1. **Email Templates:**
   - Create more professional email templates
   - Add company logo and branding
   - Include support contact information

2. **Payment Integration:**
   - Integrate Stripe for card payments
   - Integrate Razorpay for Indian payments
   - Add real QR code generation for UPI
   - Implement payment confirmation webhooks

3. **User Experience:**
   - Add email verification status badge in profile
   - Show verification expiry countdown
   - Add payment method icons
   - Implement form validation for card details

4. **Admin Features:**
   - View user verification status in admin dashboard
   - Manually verify users
   - Bulk verify existing users
   - Track payment methods in order analytics

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for server errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Check that all dependencies are installed

For email issues:
- Test with a different email provider
- Verify SMTP settings
- Check email service provider logs

---

**Last Updated:** April 11, 2026  
**Version:** 1.0.0
