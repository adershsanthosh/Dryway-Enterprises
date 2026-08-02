import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load Env variables
dotenv.config();

// Ensure JWT Secret default
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dryway_jwt_secret_key_2026_dev';
}

// Disable Mongoose command buffering so queries immediately fallback when DB is offline
mongoose.set('bufferCommands', false);

const app = express();

// Standard middlewares with dynamic CORS support
const corsOptions = {
  origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'] : '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files statically
const uploadsFolder = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsFolder));

// Route mountings
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/upload', uploadRoutes);

// Root API Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dryway MERN API is healthy and active' });
});

// Serve frontend production build when in production mode
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Dryway E-commerce API is active and running...' });
  });
}

// Fallback 404 routing
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

// Resilient MongoDB connection handler
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection issue: ${error.message}`);
    console.log(
      'Proceeding to start Express server in Offline database mode (Ensure local MongoDB is active or config MONGO_URI in .env)'
    );
  }
};

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Dryway Server initialized on Port ${PORT} (http://localhost:${PORT})`
    );
  });
});
