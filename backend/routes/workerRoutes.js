import express from 'express';
import bcrypt from 'bcryptjs';
import { protect, admin } from '../middleware/auth.js';
import {
  inMemoryUsers,
  inMemoryWorkerSessions,
  inMemoryPayrollRecords,
  inMemoryExpenses,
  createInMemoryUser,
} from '../utils/inMemoryStore.js';

const router = express.Router();

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private/Admin or Worker
router.get('/', protect, async (req, res) => {
  const workers = inMemoryUsers.filter((u) => u.isWorker || u.isAdmin);
  const sanitizedWorkers = workers.map(({ password, ...rest }) => rest);
  res.json(sanitizedWorkers);
});

// @desc    Create / Add a new worker account with Salary & Shift details
// @route   POST /api/workers
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, email, password, workerRole, permissions, monthlySalary, hourlyRate, shiftTiming } = req.body;

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

  newWorker.monthlySalary = Number(monthlySalary) || 28000;
  newWorker.hourlyRate = Number(hourlyRate) || 175;
  newWorker.shiftTiming = shiftTiming || 'Regular Shift (9:00 AM - 6:00 PM)';
  newWorker.joiningDate = new Date().toISOString().split('T')[0];

  const { password: pw, ...sanitized } = newWorker;
  res.status(201).json(sanitized);
});

// @desc    Update worker salary, hourly rate, and shift timing
// @route   PUT /api/workers/:id/salary
// @access  Private/Admin
router.put('/:id/salary', protect, admin, async (req, res) => {
  const { workerRole, monthlySalary, hourlyRate, shiftTiming, permissions } = req.body;
  const worker = inMemoryUsers.find((u) => u._id === req.params.id);

  if (!worker) {
    return res.status(404).json({ message: 'Worker account not found' });
  }

  if (workerRole !== undefined) worker.workerRole = workerRole;
  if (monthlySalary !== undefined) worker.monthlySalary = Number(monthlySalary);
  if (hourlyRate !== undefined) worker.hourlyRate = Number(hourlyRate);
  if (shiftTiming !== undefined) worker.shiftTiming = shiftTiming;
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

// ==================== WORKER SESSIONS & ATTENDANCE TRACKING ====================

// @desc    Get all worker sessions (shift logs)
// @route   GET /api/workers/sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  res.json(inMemoryWorkerSessions);
});

// @desc    Get attendance audit summary (hours worked, shifts, status)
// @route   GET /api/workers/attendance
// @access  Private
router.get('/attendance', protect, async (req, res) => {
  const sessions = inMemoryWorkerSessions;
  
  const attendanceMap = sessions.map((s) => {
    let durationHours = 0;
    if (s.clockInTime && s.clockOutTime) {
      const diffMs = new Date(s.clockOutTime) - new Date(s.clockInTime);
      durationHours = Math.round((diffMs / (1000 * 3600)) * 10) / 10;
    } else if (s.clockInTime && s.isActive) {
      const diffMs = Date.now() - new Date(s.clockInTime);
      durationHours = Math.round((diffMs / (1000 * 3600)) * 10) / 10;
    }

    return {
      _id: s._id,
      workerId: s.workerId,
      workerName: s.workerName,
      workerRole: s.workerRole,
      clockInTime: s.clockInTime,
      clockOutTime: s.clockOutTime,
      durationHours,
      isActive: s.isActive,
      status: s.isActive ? 'Present (Active Shift)' : 'Completed Shift',
      tasksCompleted: s.tasksCompleted,
    };
  });

  res.json(attendanceMap);
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

// ==================== PAYROLL & SALARY ACCOUNTS ====================

// @desc    Get Payroll Records
// @route   GET /api/workers/payroll
// @access  Private
router.get('/payroll', protect, async (req, res) => {
  if (req.user.isAdmin) {
    return res.json(inMemoryPayrollRecords);
  }
  // If staff worker, filter to their payroll records only
  const workerPayroll = inMemoryPayrollRecords.filter(
    (p) => p.workerId === req.user._id || p.workerName.toLowerCase() === req.user.name.toLowerCase()
  );
  res.json(workerPayroll);
});

// @desc    Process / Pay Salary Payout
// @route   POST /api/workers/payroll/payout
// @access  Private/Admin
router.post('/payroll/payout', protect, admin, (req, res) => {
  const { workerId, monthYear, baseSalary, overtimeHours, allowances, deductions } = req.body;
  const worker = inMemoryUsers.find((u) => u._id === workerId);

  if (!worker) {
    return res.status(404).json({ message: 'Worker not found' });
  }

  const base = Number(baseSalary) || worker.monthlySalary || 28000;
  const rate = worker.hourlyRate || 175;
  const otHours = Number(overtimeHours) || 0;
  const otPay = Math.round(otHours * rate * 1.5);
  const allow = Number(allowances) || 1000;
  const deduct = Number(deductions) || 0;

  const netPayable = base + otPay + allow - deduct;

  const newPayroll = {
    _id: `pay_${Date.now()}`,
    workerId: worker._id,
    workerName: worker.name,
    workerRole: worker.workerRole || 'Staff',
    monthYear: monthYear || `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
    baseSalary: base,
    hoursWorked: 160 + otHours,
    overtimeHours: otHours,
    overtimePay: otPay,
    allowances: allow,
    deductions: deduct,
    netPayable,
    paymentStatus: 'Paid',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionRef: `TXN-DRY-${Math.floor(10000 + Math.random() * 90000)}`,
  };

  inMemoryPayrollRecords.unshift(newPayroll);

  // Log expense into ERP Expenses automatically
  inMemoryExpenses.unshift({
    _id: `exp_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    category: 'Workforce Payroll & Shifts',
    description: `Salary Payout for ${worker.name} (${newPayroll.monthYear}) - Ref: ${newPayroll.transactionRef}`,
    amount: netPayable,
    status: 'Paid',
    loggedBy: req.user.name,
  });

  res.status(201).json(newPayroll);
});

export default router;
