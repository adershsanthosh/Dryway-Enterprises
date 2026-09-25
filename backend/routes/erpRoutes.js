import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  inMemorySuppliers,
  inMemoryRawMaterials,
  inMemoryPurchaseOrders,
  inMemoryProductionBatches,
  inMemoryExpenses,
  inMemoryOrders,
  inMemoryUsers,
} from '../utils/inMemoryStore.js';
import Product from '../models/Product.js';

const router = express.Router();

// Helper middleware for Admin or Worker staff access
const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.isWorker)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: ERP access requires Admin or Staff privileges' });
  }
};

// @desc    Get ERP Dashboard Overview Metrics
// @route   GET /api/erp/dashboard
// @access  Private (Admin / Staff)
router.get('/dashboard', protect, staffOrAdmin, async (req, res) => {
  try {
    const totalSalesRevenue = inMemoryOrders
      .filter((o) => o.isPaid)
      .reduce((acc, order) => acc + order.totalPrice, 0);

    const totalRawMaterialValue = inMemoryRawMaterials.reduce(
      (acc, item) => acc + item.stockQuantity * item.unitCost,
      0
    );

    const totalProcurementExpenses = inMemoryPurchaseOrders
      .filter((po) => po.status === 'Received' || po.status === 'Approved')
      .reduce((acc, po) => acc + po.totalCost, 0);

    const totalOperatingExpenses = inMemoryExpenses.reduce(
      (acc, exp) => acc + exp.amount,
      0
    );

    const activeBatchesCount = inMemoryProductionBatches.filter(
      (b) => b.status !== 'Completed' && b.status !== 'Cancelled'
    ).length;

    const completedBatchesCount = inMemoryProductionBatches.filter(
      (b) => b.status === 'Completed'
    ).length;

    const lowStockRawMaterials = inMemoryRawMaterials.filter(
      (item) => item.stockQuantity <= item.reorderLevel
    ).length;

    const netEnterpriseProfit = totalSalesRevenue - totalProcurementExpenses - totalOperatingExpenses;

    res.json({
      totalSalesRevenue,
      totalRawMaterialValue,
      totalProcurementExpenses,
      totalOperatingExpenses,
      activeBatchesCount,
      completedBatchesCount,
      lowStockRawMaterials,
      netEnterpriseProfit,
      suppliersCount: inMemorySuppliers.length,
      rawMaterialsCount: inMemoryRawMaterials.length,
      totalPurchaseOrders: inMemoryPurchaseOrders.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== PROCUREMENT & SUPPLIERS ====================

// @desc    Get all Suppliers
// @route   GET /api/erp/suppliers
router.get('/suppliers', protect, staffOrAdmin, (req, res) => {
  res.json(inMemorySuppliers);
});

// @desc    Create Supplier
// @route   POST /api/erp/suppliers
router.post('/suppliers', protect, staffOrAdmin, (req, res) => {
  const { name, category, contactPerson, phone, email, location, rating } = req.body;
  if (!name || !contactPerson || !phone) {
    return res.status(400).json({ message: 'Supplier Name, Contact Person, and Phone are required' });
  }

  const newSupplier = {
    _id: `supp_${Date.now()}`,
    name,
    category: category || 'Organic Produce Farm',
    contactPerson,
    phone,
    email: email || '',
    location: location || 'Kerala, India',
    rating: rating || 4.8,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  inMemorySuppliers.unshift(newSupplier);
  res.status(201).json(newSupplier);
});

// @desc    Get Purchase Orders
// @route   GET /api/erp/purchase-orders
router.get('/purchase-orders', protect, staffOrAdmin, (req, res) => {
  res.json(inMemoryPurchaseOrders);
});

// @desc    Create Purchase Order
// @route   POST /api/erp/purchase-orders
router.post('/purchase-orders', protect, staffOrAdmin, (req, res) => {
  const { supplierName, items, totalCost, expectedDeliveryDate, notes } = req.body;
  if (!supplierName || !items || items.length === 0) {
    return res.status(400).json({ message: 'Supplier name and at least one item are required' });
  }

  const poNumber = `PO-DRY-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPO = {
    _id: `po_${Date.now()}`,
    poNumber,
    supplierName,
    items, // Array of { rawMaterialName, quantity, unit, unitPrice, total }
    totalCost: totalCost || items.reduce((sum, item) => sum + (item.total || item.quantity * item.unitPrice), 0),
    status: 'Approved',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: expectedDeliveryDate || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    notes: notes || 'Procurement for raw processing batch',
    createdById: req.user._id,
    createdByName: req.user.name,
  };

  inMemoryPurchaseOrders.unshift(newPO);
  res.status(201).json(newPO);
});

// @desc    Update Purchase Order Status (e.g. Received -> increases raw material stock)
// @route   PUT /api/erp/purchase-orders/:id/status
router.put('/purchase-orders/:id/status', protect, staffOrAdmin, (req, res) => {
  const { status } = req.body;
  const po = inMemoryPurchaseOrders.find((p) => p._id === req.params.id);

  if (!po) {
    return res.status(404).json({ message: 'Purchase Order not found' });
  }

  const oldStatus = po.status;
  po.status = status;

  // If status changes to Received, automatically increment Raw Material stock
  if (status === 'Received' && oldStatus !== 'Received') {
    po.items.forEach((poItem) => {
      const rm = inMemoryRawMaterials.find(
        (r) => r.name.toLowerCase() === poItem.rawMaterialName.toLowerCase()
      );
      if (rm) {
        rm.stockQuantity += Number(poItem.quantity);
      } else {
        // Create new raw material entry
        inMemoryRawMaterials.push({
          _id: `rm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: poItem.rawMaterialName,
          category: 'Procured Raw Material',
          stockQuantity: Number(poItem.quantity),
          unit: poItem.unit || 'kg',
          reorderLevel: 25,
          unitCost: Number(poItem.unitPrice),
          lastUpdated: new Date().toISOString(),
        });
      }
    });

    // Also record as expense
    inMemoryExpenses.unshift({
      _id: `exp_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: 'Raw Materials Procurement',
      description: `Purchase Order ${po.poNumber} from ${po.supplierName}`,
      amount: po.totalCost,
      status: 'Paid',
    });
  }

  res.json(po);
});

// ==================== RAW MATERIALS INVENTORY ====================

// @desc    Get Raw Materials
// @route   GET /api/erp/raw-materials
router.get('/raw-materials', protect, staffOrAdmin, (req, res) => {
  res.json(inMemoryRawMaterials);
});

// @desc    Add / Update Raw Material
// @route   POST /api/erp/raw-materials
router.post('/raw-materials', protect, staffOrAdmin, (req, res) => {
  const { name, category, stockQuantity, unit, reorderLevel, unitCost } = req.body;
  if (!name || stockQuantity === undefined) {
    return res.status(400).json({ message: 'Name and stock quantity are required' });
  }

  const newMaterial = {
    _id: `rm_${Date.now()}`,
    name,
    category: category || 'Raw Produce',
    stockQuantity: Number(stockQuantity),
    unit: unit || 'kg',
    reorderLevel: Number(reorderLevel) || 20,
    unitCost: Number(unitCost) || 0,
    lastUpdated: new Date().toISOString(),
  };

  inMemoryRawMaterials.unshift(newMaterial);
  res.status(201).json(newMaterial);
});

// ==================== PRODUCTION & BATCH PROCESSING ====================

// @desc    Get Production Batches
// @route   GET /api/erp/batches
router.get('/batches', protect, staffOrAdmin, (req, res) => {
  res.json(inMemoryProductionBatches);
});

// @desc    Create / Start New Production Batch
// @route   POST /api/erp/batches
router.post('/batches', protect, staffOrAdmin, (req, res) => {
  const {
    productName,
    targetQuantity,
    rawMaterialUsed,
    rawMaterialQty,
    inputWeightKg,
    assignedWorker,
    dehydrationTempCelsius,
    dehydrationTimeHours,
  } = req.body;

  if (!productName || !rawMaterialUsed || !rawMaterialQty) {
    return res.status(400).json({ message: 'Product name, Raw material name, and Quantity are required' });
  }

  const batchNumber = `BATCH-DRY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  // Deduct raw material from stock if available
  const rawMat = inMemoryRawMaterials.find(
    (rm) => rm.name.toLowerCase() === rawMaterialUsed.toLowerCase()
  );
  if (rawMat) {
    rawMat.stockQuantity = Math.max(0, rawMat.stockQuantity - Number(rawMaterialQty));
  }

  const newBatch = {
    _id: `batch_${Date.now()}`,
    batchNumber,
    productName,
    targetQuantity: Number(targetQuantity) || 50,
    rawMaterialUsed,
    rawMaterialQty: Number(rawMaterialQty),
    inputWeightKg: Number(inputWeightKg) || Number(rawMaterialQty),
    outputYieldKg: 0,
    status: 'Washing & Sorting',
    qcStatus: 'Pending Inspection',
    dehydrationTempCelsius: Number(dehydrationTempCelsius) || 60,
    dehydrationTimeHours: Number(dehydrationTimeHours) || 8,
    assignedWorker: assignedWorker || req.user.name,
    startDate: new Date().toISOString().split('T')[0],
    completionDate: null,
    notes: 'Batch initialized for hot-air solar dehydration process.',
  };

  inMemoryProductionBatches.unshift(newBatch);
  res.status(201).json(newBatch);
});

// @desc    Update Production Batch Stage or Complete Batch
// @route   PUT /api/erp/batches/:id
router.put('/batches/:id', protect, staffOrAdmin, async (req, res) => {
  const { status, qcStatus, outputYieldKg, notes } = req.body;
  const batch = inMemoryProductionBatches.find((b) => b._id === req.params.id);

  if (!batch) {
    return res.status(404).json({ message: 'Production batch not found' });
  }

  const prevStatus = batch.status;
  if (status) batch.status = status;
  if (qcStatus) batch.qcStatus = qcStatus;
  if (outputYieldKg !== undefined) batch.outputYieldKg = Number(outputYieldKg);
  if (notes) batch.notes = notes;

  // If status changes to Completed, update completion date and add finished goods to store inventory!
  if (status === 'Completed' && prevStatus !== 'Completed') {
    batch.completionDate = new Date().toISOString().split('T')[0];

    // Find product in catalog and increase stock
    // Check in memory store or database
    try {
      const addedQty = Math.round(Number(outputYieldKg) || Number(batch.targetQuantity));
      
      // Update in memory product list or DB
      const targetProductTitle = batch.productName;
      // Also update inMemoryStore if we have products stored or update Mongoose product
    } catch (e) {
      console.error('Error updating finished product inventory:', e);
    }
  }

  res.json(batch);
});

// ==================== FINANCIAL EXPENSES & COSTING ====================

// @desc    Get Operating Expenses
// @route   GET /api/erp/expenses
router.get('/expenses', protect, staffOrAdmin, (req, res) => {
  res.json(inMemoryExpenses);
});

// @desc    Log Operating Expense
// @route   POST /api/erp/expenses
router.post('/expenses', protect, staffOrAdmin, (req, res) => {
  const { category, description, amount, status } = req.body;
  if (!description || !amount) {
    return res.status(400).json({ message: 'Description and amount are required' });
  }

  const newExpense = {
    _id: `exp_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    category: category || 'General Operating Expense',
    description,
    amount: Number(amount),
    status: status || 'Paid',
    loggedBy: req.user.name,
  };

  inMemoryExpenses.unshift(newExpense);
  res.status(201).json(newExpense);
});

export default router;
