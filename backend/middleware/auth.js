import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { findUserById } from '../utils/inMemoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'dryway_jwt_secret_key_2026_dev';
      const decoded = jwt.verify(token, secret);

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const memUser = await findUserById(decoded.id);
        if (memUser) {
          const { password, ...userWithoutPassword } = memUser;
          req.user = userWithoutPassword;
        }
      }

      if (req.user) {
        return next();
      } else {
        return res.status(401).json({ message: 'User not found for this token' });
      }
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
