# 🎯 Stripe Payment Integration Guide

Your e-commerce platform now has **Stripe payment integration** ready to use! This guide will walk you through the complete setup process.

---

## 📋 Table of Contents
1. [What's Included](#whats-included)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [Testing with Stripe](#testing-with-stripe)
5. [Going Live](#going-live)
6. [Troubleshooting](#troubleshooting)

---

## ✅ What's Included

### Frontend Components (Already Created)
- ✅ **Checkout Page** (`src/pages/Checkout.jsx`) - Secure payment form with Stripe Elements
- ✅ **Payment Success Page** (`src/pages/PaymentSuccess.jsx`) - Order confirmation
- ✅ **Payment Cancel Page** (`src/pages/PaymentCancel.jsx`) - Cancelled payment handling
- ✅ **Payment Service** (`src/services/payment.service.js`) - API calls for payments
- ✅ **Stripe Config** (`src/config/stripe.config.js`) - Stripe configuration
- ✅ **Cart Integration** - Checkout button links to payment flow

### What You Need to Add
- ⚠️ Backend API endpoints for Stripe (see [Backend Setup](#backend-setup))
- ⚠️ Stripe API keys (see [Frontend Setup](#frontend-setup))

---

## 🎨 Frontend Setup

### Step 1: Get Your Stripe API Keys

1. **Sign up for Stripe** (if you haven't already):
   - Go to: https://dashboard.stripe.com/register
   - Complete the registration process

2. **Get your test keys**:
   - Go to: https://dashboard.stripe.com/test/apikeys
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_...`) - Safe to use in frontend
     - **Secret key** (starts with `sk_test_...`) - **NEVER** expose in frontend!

### Step 2: Configure Frontend

1. **Open your `.env` file** in the project root
2. **Add your Stripe publishable key**:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

3. **Replace** `pk_test_your_actual_key_here` with your actual publishable key from Stripe dashboard

4. **Restart your development server**:
```bash
npm run dev
```

---

## 🖥️ Backend Setup

You need a backend server to handle Stripe payments securely. Here's how to set it up:

### Option 1: Use the Provided Sample Backend (Node.js/Express)

A complete sample backend server is included in `backend-example/stripe-server.js`.

#### Quick Setup:

1. **Create a `backend` folder** in your project:
```bash
mkdir backend
cd backend
```

2. **Initialize Node.js project**:
```bash
npm init -y
```

3. **Install required packages**:
```bash
npm install express cors stripe dotenv
```

4. **Copy the sample server**:
   - Copy `backend-example/stripe-server.js` to `backend/server.js`

5. **Create `.env` in backend folder**:
```env
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

6. **Replace** `sk_test_your_secret_key_here` with your actual Stripe secret key

7. **Start the backend server**:
```bash
node server.js
```

Your backend will be running on `http://localhost:5000`

---

### Option 2: Add to Your Existing Backend

If you already have a backend, add these endpoints:

#### Required Endpoints:

##### 1. Create Payment Intent
```javascript
POST /api/payments/create-intent

Request Body:
{
  "amount": 5000,        // Amount in cents ($50.00)
  "currency": "usd",
  "items": [...],        // Cart items
  "metadata": {...}      // Additional info
}

Response:
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

##### 2. Get Payment Status
```javascript
GET /api/payments/status/:paymentIntentId

Response:
{
  "status": "succeeded",
  "orderDetails": {...}
}
```

##### 3. Create Order (Optional)
```javascript
POST /api/orders

Request Body:
{
  "paymentIntentId": "pi_xxx",
  "items": [...],
  "total": 50.00,
  "status": "completed"
}

Response:
{
  "orderId": "ORDER-xxx",
  "status": "completed"
}
```

---

## 🧪 Testing with Stripe

### Test Card Numbers

Stripe provides test card numbers for testing different scenarios:

#### ✅ Successful Payment
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

#### ❌ Card Declined
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

#### ⚠️ Requires Authentication
```
Card Number: 4000 0025 0000 3155
Expiry: Any future date
CVC: Any 3 digits
```

More test cards: https://stripe.com/docs/testing

---

## 🚀 Testing the Integration

### Step-by-Step Test:

1. **Start both servers**:
   - Frontend: `npm run dev` (should be on `http://localhost:5173`)
   - Backend: `node server.js` (should be on `http://localhost:5000`)

2. **Add items to cart**:
   - Browse products on your site
   - Click "Add to Cart" on any product
   - Verify cart count updates in header

3. **Go to cart**:
   - Click cart icon in header
   - Or navigate to `/cart`
   - Verify items are displayed

4. **Proceed to checkout**:
   - Click "Proceed to Checkout" button
   - Should redirect to `/checkout`

5. **Enter payment details**:
   - Use test card: `4242 4242 4242 4242`
   - Enter any future expiry date
   - Enter any 3-digit CVC
   - Enter any ZIP code

6. **Complete payment**:
   - Click "Pay Now"
   - Should show processing indicator
   - Should redirect to `/payment-success`
   - Cart should be cleared

7. **Check Stripe Dashboard**:
   - Go to: https://dashboard.stripe.com/test/payments
   - Verify the payment appears

---

## 🌟 Going Live (Production)

### When you're ready to accept real payments:

1. **Complete Stripe account setup**:
   - Add business details
   - Add bank account for payouts
   - Verify your identity

2. **Get production API keys**:
   - Go to: https://dashboard.stripe.com/apikeys
   - Get your **live** publishable and secret keys

3. **Update environment variables**:

   **Frontend `.env`**:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

   **Backend `.env`**:
   ```env
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   FRONTEND_URL=https://yourdomain.com
   ```

4. **Enable live mode in Stripe dashboard**
5. **Test thoroughly with real (small amount) transactions**

---

## 🐛 Troubleshooting

### Error: "Failed to initialize checkout"

**Cause**: Backend is not running or not accessible

**Fix**:
1. Ensure backend server is running: `node server.js`
2. Check backend URL in `.env`: `VITE_API_BASE_URL=http://localhost:5000/api`
3. Check browser console for CORS errors

---

### Error: "Invalid API key"

**Cause**: Stripe keys are incorrect or not set

**Fix**:
1. Verify publishable key in frontend `.env`
2. Verify secret key in backend `.env`
3. Make sure you're using test keys for development (start with `pk_test_` and `sk_test_`)
4. Restart both servers after updating `.env` files

---

### Error: "CORS policy blocked"

**Cause**: Backend not allowing requests from frontend

**Fix**:
1. Check backend has CORS enabled
2. Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
3. In development, frontend should be `http://localhost:5173`

---

### Payment succeeds but cart doesn't clear

**Cause**: Cart clearing function not executing

**Fix**:
1. Check browser console for errors
2. Verify `clearCart` function is called in `Checkout.jsx`
3. Check backend `/orders` endpoint is responding correctly

---

### Stripe Elements not showing

**Cause**: Stripe publishable key not set or invalid

**Fix**:
1. Check `.env` file has `VITE_STRIPE_PUBLISHABLE_KEY`
2. Verify the key is correct (copy from Stripe dashboard)
3. Restart dev server: `npm run dev`
4. Check browser console for Stripe initialization errors

---

## 📚 Additional Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Stripe Elements**: https://stripe.com/docs/stripe-js
- **Stripe Testing Guide**: https://stripe.com/docs/testing
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## 🔐 Security Best Practices

1. **NEVER** commit API keys to version control
2. **NEVER** expose secret keys in frontend code
3. Always use HTTPS in production
4. Validate all payments on the backend
5. Use Stripe webhooks for critical order updates
6. Implement proper error handling
7. Log all payment activities
8. Set up fraud detection rules in Stripe dashboard

---

## 💡 Next Steps

1. ✅ Set up Stripe account
2. ✅ Add API keys to `.env`
3. ✅ Start backend server
4. ✅ Test with test cards
5. ⏭️ Customize payment success page
6. ⏭️ Add order tracking
7. ⏭️ Set up email notifications
8. ⏭️ Add shipping address collection
9. ⏭️ Implement Stripe webhooks
10. ⏭️ Go live!

---

## 🆘 Need Help?

- **Stripe Support**: https://support.stripe.com
- **Stripe Community**: https://discord.gg/stripe
- **GitHub Issues**: Create an issue in your repository

---

**Happy Selling! 🎉**

