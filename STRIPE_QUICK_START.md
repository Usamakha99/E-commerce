# 🚀 Stripe Integration - Quick Start (5 Minutes)

Get your Stripe payments working in just 5 minutes!

---

## Step 1: Get Stripe Keys (2 minutes)

1. Go to https://dashboard.stripe.com/register
2. Sign up or log in
3. Go to https://dashboard.stripe.com/test/apikeys
4. Copy both keys:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

---

## Step 2: Setup Frontend (1 minute)

1. **Open `.env` file** in your project root (if it doesn't exist, create it)

2. **Add this line** (replace with your actual publishable key):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
```

3. **Restart your dev server**:
```bash
npm run dev
```

---

## Step 3: Setup Backend (2 minutes)

### Option A: Using the Sample Backend

1. **Open a new terminal** (keep frontend running in first terminal)

2. **Run these commands**:
```bash
mkdir backend
cd backend
npm init -y
npm install express cors stripe dotenv
```

3. **Copy the backend file**:
   - Copy `backend-example/stripe-server.js` to `backend/server.js`

4. **Create `.env` in backend folder**:
```env
PORT=5000
STRIPE_SECRET_KEY=sk_test_51abc123xyz...
FRONTEND_URL=http://localhost:5173
```

5. **Start backend**:
```bash
node server.js
```

You should see: `🚀 Stripe Payment Server is running!`

---

## Step 4: Test It! (30 seconds)

1. **Open your website**: http://localhost:5173
2. **Add a product to cart**
3. **Click cart icon** and click **"Checkout"**
4. **Enter test card**:
   - Number: `4242 4242 4242 4242`
   - Expiry: `12/34` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)
5. **Click "Pay Now"**
6. **Success!** 🎉

---

## ✅ You're Done!

Your Stripe integration is working! 

### Check Your Payment:
- Go to: https://dashboard.stripe.com/test/payments
- You'll see your test payment there!

---

## What's Next?

- Read **STRIPE_INTEGRATION_GUIDE.md** for detailed info
- Customize the checkout page design
- Add order confirmation emails
- Set up webhooks
- Go live with production keys!

---

## Need Help?

**Common Issues:**

1. **"Failed to initialize checkout"**
   - Make sure backend is running on port 5000
   - Check both terminals are running

2. **"Invalid API key"**
   - Double-check your Stripe keys
   - Make sure you copied them correctly
   - Restart both servers

3. **Can't see Stripe payment form**
   - Check frontend `.env` has VITE_STRIPE_PUBLISHABLE_KEY
   - Restart dev server: `npm run dev`

---

**Happy Selling! 💳✨**

