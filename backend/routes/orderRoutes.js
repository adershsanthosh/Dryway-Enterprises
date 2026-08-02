import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import {
  createInMemoryOrder,
  findOrderById,
  findOrdersByUser,
  inMemoryOrders,
  findUserById,
  updateInMemoryUserPoints,
} from '../utils/inMemoryStore.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get logged-in user's orders (must be placed before /:id)
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
      });
      return res.json(orders);
    } else {
      const orders = await findOrdersByUser(req.user._id);
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find({})
        .populate('user', 'id name')
        .sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      return res.json(inMemoryOrders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    pointsToRedeem = 0,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    let availablePoints = 0;
    let dbUser = null;

    if (isDbConnected()) {
      dbUser = await User.findById(req.user._id);
      if (dbUser) availablePoints = dbUser.loyaltyPoints || 0;
    } else {
      const memUser = await findUserById(req.user._id);
      if (memUser) availablePoints = memUser.loyaltyPoints || 0;
    }

    // 1. Determine points redeemed & discount (1 point = 1 rupee)
    const requestedRedeem = Math.max(0, Number(pointsToRedeem) || 0);
    const actualRedeemed = Math.min(requestedRedeem, availablePoints);
    const grossTotal = Number(totalPrice) || ((Number(itemsPrice) || 0) + (Number(shippingPrice) || 0) + (Number(taxPrice) || 0));
    const pointsDiscount = Math.min(actualRedeemed, grossTotal);
    const finalTotalPrice = Math.max(0, grossTotal - pointsDiscount);

    // 2. Calculate earned points (1 point for every 100 rupees spent on net total)
    const pointsEarned = Math.floor(finalTotalPrice / 100);

    // 3. Update user points balance
    const netPointChange = pointsEarned - actualRedeemed;
    let newLoyaltyPoints = availablePoints;

    if (isDbConnected()) {
      if (dbUser) {
        dbUser.loyaltyPoints = Math.max(0, (dbUser.loyaltyPoints || 0) + netPointChange);
        await dbUser.save();
        newLoyaltyPoints = dbUser.loyaltyPoints;
      }
    } else {
      newLoyaltyPoints = await updateInMemoryUserPoints(req.user._id, netPointChange);
    }

    if (isDbConnected()) {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice: finalTotalPrice,
        pointsEarned,
        pointsRedeemed: actualRedeemed,
        pointsDiscount,
      });

      const createdOrder = await order.save();
      const orderObj = createdOrder.toObject();
      orderObj.userLoyaltyPoints = newLoyaltyPoints;
      return res.status(201).json(orderObj);
    } else {
      const createdOrder = await createInMemoryOrder({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice: finalTotalPrice,
        pointsEarned,
        pointsRedeemed: actualRedeemed,
        pointsDiscount,
      });
      createdOrder.userLoyaltyPoints = newLoyaltyPoints;
      return res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    let order;

    if (isDbConnected()) {
      order = await Order.findById(req.params.id).populate('user', 'name email');
    } else {
      order = await findOrderById(req.params.id);
    }

    if (order) {
      return res.json(order);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    } else {
      const order = await findOrderById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date().toISOString();
        return res.json(order);
      }
    }
    return res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
