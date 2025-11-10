/**
 * Stripe Payment Backend Server
 * 
 * This is a simple Node.js/Express server that handles Stripe payments
 * for your e-commerce platform.
 * 
 * Setup Instructions:
 * 1. Create a 'backend' folder: mkdir backend && cd backend
 * 2. Initialize Node project: npm init -y
 * 3. Install dependencies: npm install express cors stripe dotenv
 * 4. Create .env file with your Stripe secret key
 * 5. Run server: node server.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// In-memory storage for orders (use a database in production)
const orders = new Map();

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Stripe payment server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Create Payment Intent
 * 
 * This endpoint creates a Stripe Payment Intent which generates
 * a client secret that the frontend uses to complete the payment.
 */
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, currency, items, metadata } = req.body;

    // Validate request
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Amount must be greater than 0' 
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        items: JSON.stringify(items),
        orderId: metadata?.orderId || `ORDER-${Date.now()}`,
      },
    });

    console.log(`✅ Payment Intent created: ${paymentIntent.id}`);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Payment intent creation failed',
      message: error.message 
    });
  }
});

/**
 * Get Payment Status
 * 
 * Retrieves the status of a payment intent to verify payment completion
 */
app.get('/api/payments/status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Get associated order if exists
    const order = orders.get(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert cents to dollars
      currency: paymentIntent.currency,
      paymentMethod: paymentIntent.payment_method,
      orderDetails: order || null,
    });

  } catch (error) {
    console.error('❌ Error retrieving payment status:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve payment status',
      message: error.message 
    });
  }
});

/**
 * Confirm Payment
 * 
 * Optional endpoint to manually confirm a payment intent
 */
app.post('/api/payments/confirm/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    console.log(`✅ Payment confirmed: ${paymentIntent.id}`);

    res.json({
      status: paymentIntent.status,
      message: 'Payment confirmed successfully',
    });

  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    res.status(500).json({ 
      error: 'Payment confirmation failed',
      message: error.message 
    });
  }
});

/**
 * Create Order
 * 
 * Creates an order record after successful payment
 */
app.post('/api/orders', async (req, res) => {
  try {
    const { paymentIntentId, items, total, status, customerInfo } = req.body;

    // Verify payment was successful
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          error: 'Payment not completed',
          message: 'Order can only be created after successful payment' 
        });
      }
    }

    // Create order object
    const order = {
      orderId: `ORDER-${Date.now()}`,
      paymentIntentId,
      items,
      total,
      status: status || 'completed',
      customerInfo,
      createdAt: new Date().toISOString(),
    };

    // Store order (use database in production)
    orders.set(paymentIntentId, order);

    console.log(`✅ Order created: ${order.orderId}`);

    res.json({
      success: true,
      order,
      message: 'Order created successfully',
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ 
      error: 'Order creation failed',
      message: error.message 
    });
  }
});

/**
 * Get Order by Payment Intent ID
 */
app.get('/api/orders/payment/:paymentIntentId', (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const order = orders.get(paymentIntentId);

    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found',
        message: 'No order found for this payment' 
      });
    }

    res.json(order);

  } catch (error) {
    console.error('❌ Error retrieving order:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve order',
      message: error.message 
    });
  }
});

/**
 * Get All Orders
 */
app.get('/api/orders', (req, res) => {
  try {
    const allOrders = Array.from(orders.values());
    
    res.json({
      orders: allOrders,
      count: allOrders.length,
    });

  } catch (error) {
    console.error('❌ Error retrieving orders:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve orders',
      message: error.message 
    });
  }
});

/**
 * Stripe Webhook Handler (Optional but recommended)
 * 
 * Handles events from Stripe like successful payments, refunds, etc.
 * Setup webhook in Stripe Dashboard: https://dashboard.stripe.com/webhooks
 */
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('⚠️ Stripe webhook secret not configured');
    return res.sendStatus(400);
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
        // Update order status, send confirmation email, etc.
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`❌ Payment failed: ${failedPayment.id}`);
        // Notify customer, log failure, etc.
        break;

      case 'charge.refunded':
        const refund = event.data.object;
        console.log(`💰 Refund processed: ${refund.id}`);
        // Update order status, notify customer, etc.
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested endpoint does not exist' 
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`\n🚀 Stripe Payment Server is running!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔐 Stripe Mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_test') ? 'TEST' : 'LIVE'}`);
  console.log(`\n✅ Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/payments/create-intent`);
  console.log(`   GET  /api/payments/status/:id`);
  console.log(`   POST /api/payments/confirm/:id`);
  console.log(`   POST /api/orders`);
  console.log(`   GET  /api/orders`);
  console.log(`   GET  /api/orders/payment/:id`);
  console.log(`   POST /api/webhooks/stripe\n`);
});

module.exports = app;

