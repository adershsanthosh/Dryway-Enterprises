import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import { findOrderById } from '../utils/inMemoryStore.js';

const router = express.Router();

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  const { orderId } = req.body;

  try {
    let order;
    if (mongoose.connection.readyState === 1) {
      order = await Order.findById(orderId);
    } else {
      order = await findOrderById(orderId);
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Gracefully handle unconfigured Stripe keys for local developer testing
    if (!stripeKey || stripeKey.startsWith('sk_test_placeholder') || stripeKey === '') {
      console.log(
        'Stripe API Key is not configured. Running in Mock Payment Mode.'
      );
      return res.json({
        id: 'mock_session_' + Date.now(),
        url: `${
          process.env.CLIENT_URL || 'http://localhost:5173'
        }/order/${orderId}?mockSuccess=true`,
        isMock: true,
      });
    }

    const stripe = new Stripe(stripeKey);

    // Map order items to Stripe line items structure
    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects paisa
      },
      quantity: item.qty,
    }));

    // Add shipping fee if applicable
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping & Handling',
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    // Add tax if applicable
    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Estimated Tax / GST',
          },
          unit_amount: Math.round(order.taxPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${
        process.env.CLIENT_URL || 'http://localhost:5173'
      }/order/${orderId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.CLIENT_URL || 'http://localhost:5173'
      }/order/${orderId}?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
