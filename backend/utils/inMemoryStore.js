import bcrypt from 'bcryptjs';

// In-memory collections for offline database fallback
export const inMemoryUsers = [
  {
    _id: 'user_admin_001',
    name: 'Dryway Master Admin',
    email: 'admin@dryway.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: true,
    isWorker: false,
    workerRole: 'Administrator',
    monthlySalary: 65000,
    hourlyRate: 400,
    joiningDate: '2025-06-01',
    shiftTiming: 'General Executive Shift (9:00 AM - 6:00 PM)',
    permissions: {
      canEditPrices: true,
      canManageInventory: true,
      canProcessOrders: true,
      canManageOffers: true,
    },
    loyaltyPoints: 100,
  },
  {
    _id: 'worker_001',
    name: 'Rahul Sharma',
    email: 'rahul.worker@dryway.com',
    password: bcrypt.hashSync('worker123', 10),
    isAdmin: false,
    isWorker: true,
    workerRole: 'Inventory & Kitchen Specialist',
    monthlySalary: 32000,
    hourlyRate: 200,
    joiningDate: '2026-01-15',
    shiftTiming: 'Morning Processing Shift (7:00 AM - 4:00 PM)',
    permissions: {
      canEditPrices: true,
      canManageInventory: true,
      canProcessOrders: true,
      canManageOffers: true,
    },
    loyaltyPoints: 50,
  },
  {
    _id: 'worker_002',
    name: 'Ananya Nair',
    email: 'ananya.worker@dryway.com',
    password: bcrypt.hashSync('worker123', 10),
    isAdmin: false,
    isWorker: true,
    workerRole: 'Order Fulfillment Staff',
    monthlySalary: 26000,
    hourlyRate: 165,
    joiningDate: '2026-02-10',
    shiftTiming: 'Fulfillment & Logistics Shift (10:00 AM - 7:00 PM)',
    permissions: {
      canEditPrices: false,
      canManageInventory: true,
      canProcessOrders: true,
      canManageOffers: false,
    },
    loyaltyPoints: 20,
  },
];

export const inMemoryPayrollRecords = [
  {
    _id: 'pay_001',
    workerId: 'worker_001',
    workerName: 'Rahul Sharma',
    workerRole: 'Inventory & Kitchen Specialist',
    monthYear: 'September 2026',
    baseSalary: 32000,
    hoursWorked: 168,
    overtimeHours: 8,
    overtimePay: 2400, // 8 * 200 * 1.5
    allowances: 1500, // Meal & shift allowance
    deductions: 500,
    netPayable: 35400,
    paymentStatus: 'Paid',
    paymentDate: '2026-09-24',
    transactionRef: 'TXN-DRY-99482',
  },
  {
    _id: 'pay_002',
    workerId: 'worker_002',
    workerName: 'Ananya Nair',
    workerRole: 'Order Fulfillment Staff',
    monthYear: 'September 2026',
    baseSalary: 26000,
    hoursWorked: 160,
    overtimeHours: 0,
    overtimePay: 0,
    allowances: 1000,
    deductions: 300,
    netPayable: 26700,
    paymentStatus: 'Approved',
    paymentDate: '2026-09-25',
    transactionRef: 'TXN-DRY-99483',
  },
];

export const inMemoryOrders = [];

// Worker Active Sessions Store
export const inMemoryWorkerSessions = [
  {
    _id: 'session_101',
    workerId: 'worker_001',
    workerName: 'Rahul Sharma',
    workerRole: 'Inventory & Kitchen Specialist',
    clockInTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    clockOutTime: null,
    isActive: true,
    tasksCompleted: 'Stock audit for Dehydrated Fruits & Powder section',
  },
  {
    _id: 'session_100',
    workerId: 'worker_002',
    workerName: 'Ananya Nair',
    workerRole: 'Order Fulfillment Staff',
    clockInTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    clockOutTime: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    isActive: false,
    tasksCompleted: 'Packed 15 Sambar & Avial Ready to Cook kits',
  },
];

// ==================== DRYWAY ERP COLLECTIONS ====================

export const inMemorySuppliers = [
  {
    _id: 'supp_001',
    name: 'Wayanad Organic Farmers Collective',
    category: 'Fresh Organic Produce & Fruits',
    contactPerson: 'Saji Varghese',
    phone: '+91 94471 28930',
    email: 'saji.wwayanad@organicfarm.org',
    location: 'Wayanad, Kerala',
    rating: 4.9,
    status: 'Active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    _id: 'supp_002',
    name: 'High Range Spice Plantation Cooperative',
    category: 'Spices, Ginger & Turmeric Roots',
    contactPerson: 'Mani Kandan',
    phone: '+91 98462 10492',
    email: 'manikandan@highrangespices.in',
    location: 'Idukki, Kerala',
    rating: 4.8,
    status: 'Active',
    createdAt: '2026-02-15T11:30:00.000Z',
  },
  {
    _id: 'supp_003',
    name: 'EcoPack Green Solutions Ltd',
    category: 'Biodegradable Pouches & Glass Packaging',
    contactPerson: 'Priya Sharma',
    phone: '+91 98950 44321',
    email: 'priya@ecopacksolutions.com',
    location: 'Kochi, Kerala',
    rating: 4.7,
    status: 'Active',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
];

export const inMemoryRawMaterials = [
  {
    _id: 'rm_001',
    name: 'Fresh Grade-A Organic Pineapples',
    category: 'Fresh Fruits',
    stockQuantity: 450,
    unit: 'kg',
    reorderLevel: 100,
    unitCost: 35,
    lastUpdated: '2026-09-24T10:00:00.000Z',
  },
  {
    _id: 'rm_002',
    name: 'Raw Alphonso Mangoes',
    category: 'Fresh Fruits',
    stockQuantity: 280,
    unit: 'kg',
    reorderLevel: 80,
    unitCost: 45,
    lastUpdated: '2026-09-23T14:20:00.000Z',
  },
  {
    _id: 'rm_003',
    name: 'Curcuma Longa High-Curcumin Turmeric',
    category: 'Spices & Herbs',
    stockQuantity: 120,
    unit: 'kg',
    reorderLevel: 30,
    unitCost: 180,
    lastUpdated: '2026-09-22T09:15:00.000Z',
  },
  {
    _id: 'rm_004',
    name: 'Stand-up Moisture Proof Zip Pouches (200g)',
    category: 'Packaging Materials',
    stockQuantity: 1800,
    unit: 'pcs',
    reorderLevel: 500,
    unitCost: 4.5,
    lastUpdated: '2026-09-20T16:00:00.000Z',
  },
];

export const inMemoryPurchaseOrders = [
  {
    _id: 'po_001',
    poNumber: 'PO-DRY-2026-801',
    supplierName: 'Wayanad Organic Farmers Collective',
    items: [
      { rawMaterialName: 'Fresh Grade-A Organic Pineapples', quantity: 500, unit: 'kg', unitPrice: 35, total: 17500 },
      { rawMaterialName: 'Raw Alphonso Mangoes', quantity: 300, unit: 'kg', unitPrice: 45, total: 13500 },
    ],
    totalCost: 31000,
    status: 'Received',
    orderDate: '2026-09-18',
    expectedDeliveryDate: '2026-09-20',
    notes: 'Seasonal harvest batch purchase for Q3 dehydration operations',
    createdByName: 'Dryway Master Admin',
  },
  {
    _id: 'po_002',
    poNumber: 'PO-DRY-2026-802',
    supplierName: 'EcoPack Green Solutions Ltd',
    items: [
      { rawMaterialName: 'Stand-up Moisture Proof Zip Pouches (200g)', quantity: 2000, unit: 'pcs', unitPrice: 4.5, total: 9000 },
    ],
    totalCost: 9000,
    status: 'Approved',
    orderDate: '2026-09-24',
    expectedDeliveryDate: '2026-09-27',
    notes: 'Eco zip lock pouch procurement for snack packaging',
    createdByName: 'Rahul Sharma',
  },
];

export const inMemoryProductionBatches = [
  {
    _id: 'batch_001',
    batchNumber: 'BATCH-DRY-2026-101',
    productName: 'Dehydrated Pineapple Slices',
    targetQuantity: 40, // kg finished product
    rawMaterialUsed: 'Fresh Grade-A Organic Pineapples',
    rawMaterialQty: 320, // kg raw input
    inputWeightKg: 320,
    outputYieldKg: 38.5,
    status: 'Completed',
    qcStatus: 'Passed QC (Grade A+)',
    dehydrationTempCelsius: 62,
    dehydrationTimeHours: 9,
    assignedWorker: 'Rahul Sharma',
    startDate: '2026-09-21',
    completionDate: '2026-09-22',
    notes: 'Zero sugar added, moisture level tested at 4.2%. Yield ratio 12%.',
  },
  {
    _id: 'batch_002',
    batchNumber: 'BATCH-DRY-2026-102',
    productName: 'Sun-Dried Alphonso Mango Strips',
    targetQuantity: 30,
    rawMaterialUsed: 'Raw Alphonso Mangoes',
    rawMaterialQty: 250,
    inputWeightKg: 250,
    outputYieldKg: 0,
    status: 'Dehydrating',
    qcStatus: 'In Dehydrator Chamber #2',
    dehydrationTempCelsius: 58,
    dehydrationTimeHours: 8,
    assignedWorker: 'Rahul Sharma',
    startDate: '2026-09-25',
    completionDate: null,
    notes: 'Solar thermal drying cycle running. Target moisture 5%.',
  },
];

export const inMemoryExpenses = [
  {
    _id: 'exp_001',
    date: '2026-09-20',
    category: 'Raw Materials Procurement',
    description: 'PO-DRY-2026-801 Organic Produce Batch',
    amount: 31000,
    status: 'Paid',
    loggedBy: 'Dryway Master Admin',
  },
  {
    _id: 'exp_002',
    date: '2026-09-22',
    category: 'Dehydration Energy & Solar Power',
    description: 'Dehydrator Chamber Electric & Solar Grid Utility Fee',
    amount: 4200,
    status: 'Paid',
    loggedBy: 'Rahul Sharma',
  },
  {
    _id: 'exp_003',
    date: '2026-09-24',
    category: 'Workforce Payroll & Staff Shifts',
    description: 'Bi-weekly labor allowance & shift bonus',
    amount: 18500,
    status: 'Paid',
    loggedBy: 'Dryway Master Admin',
  },
];


// Helper functions for Users
export const findUserByEmail = async (email) => {
  return inMemoryUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
};

export const findUserById = async (id) => {
  return inMemoryUsers.find((u) => u._id.toString() === id.toString());
};

export const updateInMemoryUserPoints = async (id, deltaPoints) => {
  const user = inMemoryUsers.find((u) => u._id.toString() === id.toString());
  if (user) {
    user.loyaltyPoints = Math.max(0, (user.loyaltyPoints || 0) + deltaPoints);
    return user.loyaltyPoints;
  }
  return 0;
};

export const createInMemoryUser = async ({ name, email, password, isAdmin, isWorker, workerRole, permissions }) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const isFirstUser = inMemoryUsers.length === 0;
  const newUser = {
    _id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdmin: isFirstUser ? true : Boolean(isAdmin),
    isWorker: Boolean(isWorker),
    workerRole: workerRole || 'General Staff',
    permissions: permissions || {
      canEditPrices: false,
      canManageInventory: true,
      canProcessOrders: true,
      canManageOffers: false,
    },
    loyaltyPoints: 0,
  };
  inMemoryUsers.push(newUser);
  return newUser;
};

export const matchInMemoryPassword = async (user, enteredPassword) => {
  return bcrypt.compareSync(enteredPassword, user.password);
};

// Helper functions for Orders
export const createInMemoryOrder = async (orderData) => {
  const newOrder = {
    _id: `order_${Date.now()}`,
    ...orderData,
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString(),
  };
  inMemoryOrders.push(newOrder);
  return newOrder;
};

export const findOrderById = async (id) => {
  return inMemoryOrders.find((o) => o._id === id);
};

export const findOrdersByUser = async (userId) => {
  return inMemoryOrders.filter((o) => o.user.toString() === userId.toString());
};
