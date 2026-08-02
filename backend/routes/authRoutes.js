import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import {
  findUserByEmail,
  findUserById,
  createInMemoryUser,
  matchInMemoryPassword,
} from '../utils/inMemoryStore.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dryway_jwt_secret_key_2026_dev', {
    expiresIn: '30d',
  });
};

// Check if MongoDB connection is active
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  try {
    if (isDbConnected()) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const isFirstUser = (await User.countDocuments({})) === 0;
      const finalIsAdmin = isFirstUser ? true : (isAdmin || false);

      const user = await User.create({
        name,
        email,
        password,
        isAdmin: finalIsAdmin,
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          loyaltyPoints: user.loyaltyPoints || 0,
          token: generateToken(user._id),
        });
      } else {
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } else {
      // Offline fallback mode
      const userExists = await findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await createInMemoryUser({ name, email, password, isAdmin });
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        loyaltyPoints: user.loyaltyPoints || 0,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    if (isDbConnected()) {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          loyaltyPoints: user.loyaltyPoints || 0,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // Offline fallback mode
      const user = await findUserByEmail(email);

      if (user && (await matchInMemoryPassword(user, password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          loyaltyPoints: user.loyaltyPoints || 0,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id);

      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          loyaltyPoints: user.loyaltyPoints || 0,
        });
      }
    } else {
      const user = await findUserById(req.user._id);
      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          loyaltyPoints: user.loyaltyPoints || 0,
        });
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
