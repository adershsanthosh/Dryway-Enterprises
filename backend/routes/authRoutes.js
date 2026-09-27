import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import {
  findUserByEmail,
  findUserById,
  createInMemoryUser,
  matchInMemoryPassword,
  updateInMemoryUserPassword,
  inMemoryUsers,
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
          isWorker: user.isWorker || false,
          workerRole: user.workerRole || '',
          permissions: user.permissions || {},
          monthlySalary: user.monthlySalary || 0,
          hourlyRate: user.hourlyRate || 0,
          shiftTiming: user.shiftTiming || '',
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
          isWorker: user.isWorker || false,
          workerRole: user.workerRole || '',
          permissions: user.permissions || {},
          monthlySalary: user.monthlySalary || 0,
          hourlyRate: user.hourlyRate || 0,
          shiftTiming: user.shiftTiming || '',
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

// @desc    Change user password (for website & ERP)
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide both current and new password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      return res.json({ message: 'Password updated successfully' });
    } else {
      // In-Memory store fallback
      const user = await findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await matchInMemoryPassword(user, currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await updateInMemoryUserPassword(req.user._id, hashedPassword);

      return res.json({ message: 'Password updated successfully' });
    }
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile & optional password
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password;
      }
      const updatedUser = await user.save();

      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        loyaltyPoints: updatedUser.loyaltyPoints || 0,
        token: generateToken(updatedUser._id),
      });
    } else {
      const user = await findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        loyaltyPoints: user.loyaltyPoints || 0,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    if (isDbConnected()) {
      const users = await User.find({}).select('-password');
      return res.json(users);
    } else {
      const sanitized = inMemoryUsers.map(({ password, ...u }) => u);
      return res.json(sanitized);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user by ID (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
  const { name, email, isAdmin, isWorker, workerRole, loyaltyPoints } = req.body;
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.params.id);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        if (isAdmin !== undefined) user.isAdmin = Boolean(isAdmin);
        if (isWorker !== undefined) user.isWorker = Boolean(isWorker);
        if (workerRole !== undefined) user.workerRole = workerRole;
        if (loyaltyPoints !== undefined) user.loyaltyPoints = Number(loyaltyPoints);

        const updatedUser = await user.save();
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          isWorker: updatedUser.isWorker,
          workerRole: updatedUser.workerRole,
          loyaltyPoints: updatedUser.loyaltyPoints,
        });
      }
    } else {
      const user = inMemoryUsers.find((u) => u._id === req.params.id);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        if (isAdmin !== undefined) user.isAdmin = Boolean(isAdmin);
        if (isWorker !== undefined) user.isWorker = Boolean(isWorker);
        if (workerRole !== undefined) user.workerRole = workerRole;
        if (loyaltyPoints !== undefined) user.loyaltyPoints = Number(loyaltyPoints);

        const { password, ...sanitized } = user;
        return res.json(sanitized);
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user by ID (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete logged in admin account' });
    }

    if (isDbConnected()) {
      const user = await User.findById(req.params.id);
      if (user) {
        await user.deleteOne();
        return res.json({ message: 'User account removed successfully' });
      }
    } else {
      const index = inMemoryUsers.findIndex((u) => u._id === req.params.id);
      if (index !== -1) {
        inMemoryUsers.splice(index, 1);
        return res.json({ message: 'User account removed successfully' });
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
