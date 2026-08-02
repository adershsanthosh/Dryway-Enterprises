import express from 'express';
import bcrypt from 'bcryptjs';
import { protect, admin } from '../middleware/auth.js';
import {
  inMemoryUsers,
  inMemoryWorkerSessions,
  createInMemoryUser,
} from '../utils/inMemoryStore.js';

const router = express.Router();

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  const workers = inMemoryUsers.filter((u) => u.isWorker || u.isAdmin);
  const sanitizedWorkers = workers.map(({ password, ...rest }) => rest);
  res.json(sanitizedWorkers);
});

// @desc    Create / Add a new worker account
// @route   POST /api/workers
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, email, password, workerRole, permissions } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const userExists = inMemoryUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const newWorker = await createInMemoryUser({
    name,
    email,
    password,
    isAdmin: false,
    isWorker: true,
    workerRole: workerRole || 'Inventory & Operations Staff',
    permissions: permissions || {
      canEditPrices: false,
      canManageInventory: true,
      canProcessOrders: true,
      canManageOffers: false,
    },
  });

  const { password: pw, ...sanitized } = newWorker;
  res.status(201).json(sanitized);
});

// @desc    Update worker permissions & role
// @route   PUT /api/workers/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { workerRole, permissions } = req.body;
  const worker = inMemoryUsers.find((u) => u._id === req.params.id);

  if (!worker) {
    return res.status(404).json({ message: 'Worker account not found' });
  }

  if (workerRole !== undefined) worker.workerRole = workerRole;
  if (permissions !== undefined) worker.permissions = permissions;

  const { password, ...sanitized } = worker;
  res.json(sanitized);
});

// @desc    Remove worker access
// @route   DELETE /api/workers/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  const index = inMemoryUsers.findIndex((u) => u._id === req.params.id);
  if (index !== -1) {
    inMemoryUsers.splice(index, 1);
    return res.json({ message: 'Worker account removed' });
  }
  res.status(404).json({ message: 'Worker account not found' });
});

// ==================== WORKER SESSIONS & SHIFT TRACKING ====================

// @desc    Get all worker sessions (shift logs)
// @route   GET /api/workers/sessions
// @access  Private/Admin or Worker
router.get('/sessions', protect, async (req, res) => {
  res.json(inMemoryWorkerSessions);
});

// @desc    Start Worker Session (Clock In)
// @route   POST /api/workers/sessions/clock-in
// @access  Private
router.post('/sessions/clock-in', protect, async (req, res) => {
  const activeSession = inMemoryWorkerSessions.find(
    (s) => s.workerId === req.user._id && s.isActive
  );

  if (activeSession) {
    return res.status(400).json({ message: 'Worker already has an active session!' });
  }

  const newSession = {
    _id: `session_${Date.now()}`,
    workerId: req.user._id,
    workerName: req.user.name,
    workerRole: req.user.workerRole || (req.user.isAdmin ? 'Admin' : 'Staff'),
    clockInTime: new Date().toISOString(),
    clockOutTime: null,
    isActive: true,
    tasksCompleted: req.body.taskDescription || 'Shift started',
  };

  inMemoryWorkerSessions.unshift(newSession);
  res.status(201).json(newSession);
});

// @desc    End Worker Session (Clock Out)
// @route   POST /api/workers/sessions/clock-out
// @access  Private
router.post('/sessions/clock-out', protect, async (req, res) => {
  const activeSession = inMemoryWorkerSessions.find(
    (s) => s.workerId === req.user._id && s.isActive
  );

  if (!activeSession) {
    return res.status(400).json({ message: 'No active session found to clock out.' });
  }

  activeSession.clockOutTime = new Date().toISOString();
  activeSession.isActive = false;
  if (req.body.tasksCompleted) {
    activeSession.tasksCompleted = req.body.tasksCompleted;
  }

  res.json(activeSession);
});

export default router;
