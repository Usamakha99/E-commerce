# Stripe Payment Backend

This is a simple Node.js/Express server that handles Stripe payments for your e-commerce platform.

## Quick Setup

### 1. Create Backend Folder
```bash
mkdir backend
cd backend
```

### 2. Install Dependencies
```bash
npm init -y
npm install express cors stripe dotenv
```

### 3. Copy Server File
Copy `stripe-server.js` to your `backend` folder and rename it to `server.js`

### 4. Create `.env` File
Create a `.env` file in the `backend` folder:

```env
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

Get your Stripe secret key from: https://dashboard.stripe.com/test/apikeys

### 5. Start Server
```bash
node server.js
```

Your backend will be running on `http://localhost:5000`

## API Endpoints

### Create Payment Intent
```
POST /api/payments/create-intent
```

### Get Payment Status
```
GET /api/payments/status/:paymentIntentId
```

### Create Order
```
POST /api/orders
```

### Get All Orders
```
GET /api/orders
```

## Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

More test cards: https://stripe.com/docs/testing

## Production

1. Get live API keys from Stripe
2. Update `.env` with live keys
3. Deploy to your hosting provider
4. Update frontend `.env` with production API URL

## Need Help?

See `STRIPE_INTEGRATION_GUIDE.md` in the root folder for detailed instructions.

