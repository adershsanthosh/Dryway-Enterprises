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
    permissions: {
      canEditPrices: false,
      canManageInventory: true,
      canProcessOrders: true,
      canManageOffers: false,
    },
    loyaltyPoints: 20,
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
