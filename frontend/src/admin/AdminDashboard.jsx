import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  PlusCircle,
  FileText,
  TrendingUp,
  Tag,
  Users,
  Clock,
  ShieldCheck,
  Percent,
  Play,
  Square,
  Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  // Product Form Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [isOffer, setIsOffer] = useState(false);
  const [offerTag, setOfferTag] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Healthy Snacks & Dry Fruits');
  const [countInStock, setCountInStock] = useState('10');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  // File Upload Handler
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.image) {
        setImage(data.image);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      alert(`Image upload error: ${err.message}`);
    }
    setUploading(false);
  };

  // Worker Form Modal States
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');
  const [workerRole, setWorkerRole] = useState('Inventory & Kitchen Specialist');
  const [canEditPrices, setCanEditPrices] = useState(false);
  const [canManageInventory, setCanManageInventory] = useState(true);
  const [canProcessOrders, setCanProcessOrders] = useState(true);
  const [canManageOffers, setCanManageOffers] = useState(false);

  // Shift Session Clock-In/Out States
  const [taskDescription, setTaskDescription] = useState('');
  const [clockInLoading, setClockInLoading] = useState(false);

  const drywayCategories = [
    'Healthy Snacks & Dry Fruits',
    'Kitchen Revolution',
    'Ready to Cook Kits',
    'Wellness & Superfoods',
    'Chocolates & Healthy Bars'
  ];

  useEffect(() => {
    if (!userInfo || (!userInfo.isAdmin && !userInfo.isWorker)) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoadingProducts(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    if (!userInfo) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoadingOrders(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Workers & Sessions
  const fetchWorkersAndSessions = async () => {
    if (!userInfo) return;
    try {
      const workersRes = await fetch(`${API_BASE_URL}/api/workers`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (workersRes.ok) {
        const workersData = await workersRes.json();
        setWorkers(workersData);
      }

      const sessionsRes = await fetch(`${API_BASE_URL}/api/workers/sessions`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }
      setLoadingWorkers(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchWorkersAndSessions();
  }, [userInfo]);

  // Open Create Product Modal
  const openCreateModal = () => {
    setEditMode(false);
    setProductId('');
    setTitle('');
    setPrice('');
    setOfferPrice('');
    setIsOffer(false);
    setOfferTag('');
    setDescription('');
    setCategory('Healthy Snacks & Dry Fruits');
    setCountInStock('25');
    setImage('https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80');
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setEditMode(true);
    setProductId(product._id);
    setTitle(product.title);
    setPrice(product.price);
    setOfferPrice(product.offerPrice || product.price);
    setIsOffer(product.isOffer || false);
    setOfferTag(product.offerTag || '');
    setDescription(product.description);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setImage(product.images[0]);
    setShowProductModal(true);
  };

  // Handle Product Create/Update
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      price: parseFloat(price),
      offerPrice: offerPrice ? parseFloat(offerPrice) : parseFloat(price),
      isOffer: Boolean(isOffer),
      offerTag: offerTag || (isOffer ? 'SPECIAL OFFER' : ''),
      description,
      category,
      countInStock: parseInt(countInStock),
      images: [image],
    };

    try {
      const url = editMode
        ? `${API_BASE_URL}/api/products/${productId}`
        : `${API_BASE_URL}/api/products`;
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowProductModal(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      alert(`Request failed: ${err.message}`);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the catalog?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Toggle Offer State
  const handleQuickOfferToggle = async (product, isOfferStatus, discountPercent = 15) => {
    const calculatedOfferPrice = Math.round(product.price * (1 - discountPercent / 100));
    const payload = {
      isOffer: isOfferStatus,
      offerPrice: isOfferStatus ? calculatedOfferPrice : product.price,
      offerTag: isOfferStatus ? `${discountPercent}% OFF` : '',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Add Worker Account
  const handleAddWorkerSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: workerName,
      email: workerEmail,
      password: workerPassword,
      workerRole,
      permissions: {
        canEditPrices,
        canManageInventory,
        canProcessOrders,
        canManageOffers,
      },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowWorkerModal(false);
        setWorkerName('');
        setWorkerEmail('');
        setWorkerPassword('');
        fetchWorkersAndSessions();
      } else {
        const data = await res.json();
        alert(data.message || 'Worker creation failed');
      }
    } catch (err) {
      alert(`Worker creation failed: ${err.message}`);
    }
  };

  // Handle Worker Clock In (Start Shift Session)
  const handleClockIn = async () => {
    setClockInLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers/sessions/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ taskDescription: taskDescription || 'Active shift started' }),
      });
      if (res.ok) {
        setTaskDescription('');
        fetchWorkersAndSessions();
      } else {
        const data = await res.json();
        alert(data.message || 'Clock In failed');
      }
    } catch (err) {
      console.error(err);
    }
    setClockInLoading(false);
  };

  // Handle Worker Clock Out (End Shift Session)
  const handleClockOut = async () => {
    setClockInLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers/sessions/clock-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ tasksCompleted: 'Completed shift duties' }),
      });
      if (res.ok) {
        fetchWorkersAndSessions();
      } else {
        const data = await res.json();
        alert(data.message || 'Clock Out failed');
      }
    } catch (err) {
      console.error(err);
    }
    setClockInLoading(false);
  };

  // Active Session check for current user
  const currentActiveSession = sessions.find(
    (s) => s.workerId === userInfo?._id && s.isActive
  );

  // Metrics calculation
  const totalSales = orders
    .filter((o) => o.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const pendingOrders = orders.filter((o) => !o.isDelivered).length;
  const activeOffersCount = products.filter((p) => p.isOffer).length;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      {/* Title Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            Dryway <span style={{ color: '#d91d49' }}>Operations Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Product management, price edits, offer creation, worker staff access, and shift session tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          {userInfo?.isAdmin && (
            <button className="btn btn-secondary" onClick={() => setShowWorkerModal(true)}>
              <Users size={16} /> Add Worker Staff
            </button>
          )}
          <button className="btn btn-primary" onClick={openCreateModal}>
            <PlusCircle size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Clock-In / Shift Quick Action Bar */}
      <div 
        style={{ 
          background: currentActiveSession ? 'rgba(34, 197, 94, 0.1)' : 'rgba(217, 29, 73, 0.08)', 
          border: currentActiveSession ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(217, 29, 73, 0.2)',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: currentActiveSession ? '#16a34a' : '#e11d48', color: '#ffffff', padding: '0.6rem', borderRadius: '8px' }}>
            <Clock size={20} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>
              Worker Shift Session: {currentActiveSession ? '🟢 Active Shift Clocked-In' : '🔴 Shift Offline'}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {currentActiveSession 
                ? `Clocked in at ${new Date(currentActiveSession.clockInTime).toLocaleTimeString()} by ${currentActiveSession.workerName}`
                : 'Start your shift session to record daily inventory and order activities.'}
            </p>
          </div>
        </div>

        <div>
          {currentActiveSession ? (
            <button className="btn btn-danger" onClick={handleClockOut} disabled={clockInLoading} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
              <Square size={16} /> Clock Out (End Shift)
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Shift notes (e.g. Stocking & Offers)..."
                className="input-field"
                style={{ width: '220px', height: '38px', fontSize: '0.825rem', background: 'rgba(255,255,255,0.05)' }}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleClockIn} disabled={clockInLoading} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                <Play size={16} /> Clock In (Start Shift)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs list navigation */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
          { id: 'products', label: 'Products & Prices', icon: <Package size={16} /> },
          { id: 'offers', label: 'Offers & Discounts', icon: <Tag size={16} /> },
          { id: 'workers', label: 'Worker Staff Access', icon: <Users size={16} /> },
          { id: 'sessions', label: 'Shift Sessions Log', icon: <Clock size={16} /> },
          { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              background: activeTab === tab.id ? '#d91d49' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-primary)',
              border: activeTab === tab.id ? '1px solid #d91d49' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '1rem', borderRadius: '10px', color: '#22c55e' }}>
                <TrendingUp size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Sales Revenue</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '0.2rem' }}>₹{totalSales.toFixed(2)}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(43, 190, 249, 0.15)', padding: '1rem', borderRadius: '10px', color: '#2bbef9' }}>
                <ShoppingBag size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Store Orders</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '0.2rem' }}>{orders.length} Orders</h3>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(217, 29, 73, 0.15)', padding: '1rem', borderRadius: '10px', color: '#d91d49' }}>
                <Tag size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Offer Deals</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '0.2rem' }}>{activeOffersCount} Deals</h3>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '10px', color: '#fff' }}>
                <Users size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Worker Staff Accounts</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '0.2rem' }}>{workers.length} Staff</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & PRICES */}
      {activeTab === 'products' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff' }}>
              Product Inventory & Price Management ({products.length} Products)
            </h3>
            <button className="btn btn-primary" onClick={openCreateModal} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <PlusCircle size={16} /> Add Product
            </button>
          </div>

          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Image</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Regular Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Offer Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#fff' }}>{product.title}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#2bbef9', fontSize: '0.8rem' }}>{product.category}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>₹{product.price}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: product.isOffer ? '#d91d49' : 'var(--text-muted)' }}>
                        {product.isOffer ? (
                          <span>₹{product.offerPrice} <small style={{ background: '#d91d49', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem' }}>{product.offerTag || 'OFFER'}</small></span>
                        ) : (
                          'No Offer'
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ color: product.countInStock > 0 ? '#22c55e' : 'var(--error)', fontWeight: 600 }}>
                          {product.countInStock} Left
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                          <button
                            onClick={() => openEditModal(product)}
                            style={{ cursor: 'pointer', color: '#2bbef9', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem' }}
                            title="Edit Price & Details"
                          >
                            <Edit2 size={14} /> Edit Price
                          </button>
                          {userInfo?.isAdmin && (
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              style={{ cursor: 'pointer', color: 'var(--error)', fontSize: '0.8rem' }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OFFERS & DISCOUNTS */}
      {activeTab === 'offers' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '0.5rem', color: '#fff' }}>
            Offer & Discount Manager
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Instantly grant discount offers and special promotional prices on Dryway natural products.
          </p>

          <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map((product) => (
              <div 
                key={product._id}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: product.isOffer ? '1px solid #d91d49' : '1px solid rgba(255,255,255,0.08)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <img src={product.images[0]} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{product.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#2bbef9' }}>{product.category}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', textDecoration: product.isOffer ? 'line-through' : 'none' }}>Regular: ₹{product.price}</span>
                  </div>
                  {product.isOffer && (
                    <div style={{ color: '#d91d49', fontWeight: 800 }}>
                      Offer: ₹{product.offerPrice}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  {product.isOffer ? (
                    <button 
                      onClick={() => handleQuickOfferToggle(product, false)} 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.775rem' }}
                    >
                      Remove Offer
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleQuickOfferToggle(product, true, 15)} 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.775rem', background: '#d91d49' }}
                      >
                        15% OFF Offer
                      </button>
                      <button 
                        onClick={() => handleQuickOfferToggle(product, true, 25)} 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.775rem', background: '#2bbef9', color: '#000' }}
                      >
                        25% OFF Offer
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WORKER STAFF ACCESS */}
      {activeTab === 'workers' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff' }}>
                Worker Staff & Access Control
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Assign staff roles, grant price editing rights, and control worker permissions.
              </p>
            </div>
            {userInfo?.isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowWorkerModal(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Users size={16} /> Add Worker Staff
              </button>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Staff Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Permissions</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#fff' }}>{worker.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{worker.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ background: worker.isAdmin ? 'rgba(217,29,73,0.15)' : 'rgba(43,190,249,0.15)', color: worker.isAdmin ? '#d91d49' : '#2bbef9', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.775rem' }}>
                        {worker.workerRole || (worker.isAdmin ? 'Administrator' : 'Staff')}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {worker.permissions?.canEditPrices && <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>Price Edit</span>}
                        {worker.permissions?.canManageInventory && <span style={{ background: 'rgba(43,190,249,0.1)', color: '#2bbef9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>Inventory</span>}
                        {worker.permissions?.canProcessOrders && <span style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>Orders</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: WORKER SHIFT SESSIONS LOG */}
      {activeTab === 'sessions' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '0.5rem', color: '#fff' }}>
            Worker Shift Session Audit Log
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Real-time audit log of worker clock-ins, shift durations, and daily operational notes.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Session ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Worker Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Staff Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Clock In Time</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Clock Out Time</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Session Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Notes / Activity</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{session._id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#fff' }}>{session.workerName}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#2bbef9' }}>{session.workerRole}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{new Date(session.clockInTime).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {session.clockOutTime ? new Date(session.clockOutTime).toLocaleString() : '— Still Active —'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: session.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                          color: session.isActive ? '#22c55e' : 'var(--text-muted)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}
                      >
                        {session.isActive ? '🟢 Active' : 'Completed'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {session.tasksCompleted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ORDERS */}
      {activeTab === 'orders' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '1.5rem', color: '#fff' }}>
            Store Order Operations
          </h3>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Paid Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Shipping</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{order._id}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div>
                          <p style={{ fontWeight: 600, color: '#fff' }}>{order.user?.name || 'Customer'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.user?.email}</p>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#d91d49' }}>₹{order.totalPrice}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ color: order.isPaid ? '#22c55e' : 'var(--error)', fontWeight: 600 }}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ color: order.isDelivered ? '#22c55e' : '#2bbef9', fontWeight: 600 }}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                        >
                          <FileText size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD/EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={() => setShowProductModal(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <form
            onSubmit={handleProductSubmit}
            className="glass-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '540px',
              padding: '2.5rem',
              background: 'var(--bg-secondary)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-headings)', color: '#fff' }}>
                {editMode ? 'Edit Product & Change Price' : 'Add New Dryway Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Dehydrated Strawberry"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Regular Price (₹)</label>
                <input
                  type="number"
                  required
                  className="input-field"
                  placeholder="250"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Offer / Discount Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="199"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(217, 29, 73, 0.08)', padding: '0.8rem', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isOffer}
                  onChange={(e) => setIsOffer(e.target.checked)}
                />
                Activate Special Discount Offer
              </label>

              {isOffer && (
                <input
                  type="text"
                  placeholder="Offer Badge (e.g. 20% OFF)"
                  className="input-field"
                  style={{ width: '180px', height: '36px', fontSize: '0.8rem' }}
                  value={offerTag}
                  onChange={(e) => setOfferTag(e.target.value)}
                />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Dryway Category</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ appearance: 'none', background: 'var(--bg-tertiary)' }}
                >
                  {drywayCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stock Units</label>
                <input
                  type="number"
                  required
                  className="input-field"
                  placeholder="50"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Product Photo File from Computer</label>
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="input-field"
                style={{ padding: '0.5rem', cursor: 'pointer', background: 'rgba(217, 29, 73, 0.08)', border: '1px dashed #d91d49' }}
              />
              {uploading && <p style={{ fontSize: '0.8rem', color: '#2bbef9', marginTop: '0.3rem' }}>⏳ Uploading photo file to server...</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Or Image Web URL</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="https://images.unsplash.com/... or /uploads/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            {image && (
              <div style={{ marginBottom: '1.25rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  📷 Photo Preview:
                </span>
                <img
                  src={image}
                  alt="Product Preview"
                  style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #d91d49', display: 'block', margin: '0 auto' }}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                required
                className="input-field"
                rows="3"
                placeholder="Nutrient benefits, preparation instructions, 100% natural dehydrated ingredients..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            >
              <Check size={18} />
              {editMode ? 'Update Product & Price' : 'Publish New Product'}
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD WORKER STAFF MODAL */}
      {showWorkerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={() => setShowWorkerModal(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <form
            onSubmit={handleAddWorkerSubmit}
            className="glass-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              padding: '2.5rem',
              background: 'var(--bg-secondary)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-headings)', color: '#fff' }}>
                Add New Worker Staff Account
              </h3>
              <button
                type="button"
                onClick={() => setShowWorkerModal(false)}
                style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Worker Full Name</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Rahul Kumar"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Login ID)</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="rahul.staff@dryway.com"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Staff Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="Set worker password"
                value={workerPassword}
                onChange={(e) => setWorkerPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Staff Role Designation</label>
              <select
                className="input-field"
                value={workerRole}
                onChange={(e) => setWorkerRole(e.target.value)}
                style={{ appearance: 'none', background: 'var(--bg-tertiary)' }}
              >
                <option value="Inventory & Kitchen Specialist">Inventory & Kitchen Specialist</option>
                <option value="Order Fulfillment Staff">Order Fulfillment Staff</option>
                <option value="Pricing & Promotions Officer">Pricing & Promotions Officer</option>
                <option value="Shift Operations Supervisor">Shift Operations Supervisor</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, display: 'block', marginBottom: '0.8rem' }}>
                Assign Worker Access Permissions:
              </span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={canEditPrices} onChange={(e) => setCanEditPrices(e.target.checked)} />
                  Can Edit Prices
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={canManageInventory} onChange={(e) => setCanManageInventory(e.target.checked)} />
                  Manage Inventory
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={canProcessOrders} onChange={(e) => setCanProcessOrders(e.target.checked)} />
                  Process Orders
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={canManageOffers} onChange={(e) => setCanManageOffers(e.target.checked)} />
                  Manage Offers
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <Check size={18} /> Grant Worker Access
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
