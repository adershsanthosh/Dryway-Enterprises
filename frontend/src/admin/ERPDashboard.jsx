import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import {
  Factory,
  Truck,
  Layers,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  Package,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';

const ERPDashboard = () => {
  const { userInfo, changePassword } = useContext(AuthContext);

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  // Modal States
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Edit Modal States & Form Fields
  // Supplier Edit
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editSuppName, setEditSuppName] = useState('');
  const [editSuppCategory, setEditSuppCategory] = useState('Organic Produce Farm');
  const [editSuppContact, setEditSuppContact] = useState('');
  const [editSuppPhone, setEditSuppPhone] = useState('');
  const [editSuppLocation, setEditSuppLocation] = useState('');

  // Raw Material Edit
  const [showEditRMModal, setShowEditRMModal] = useState(false);
  const [selectedRM, setSelectedRM] = useState(null);
  const [editRMName, setEditRMName] = useState('');
  const [editRMCategory, setEditRMCategory] = useState('');
  const [editRMStock, setEditRMStock] = useState('');
  const [editRMUnit, setEditRMUnit] = useState('kg');
  const [editRMUnitCost, setEditRMUnitCost] = useState('');
  const [editRMReorder, setEditRMReorder] = useState('');

  // Expense Edit
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editExpCategory, setEditExpCategory] = useState('Raw Materials Procurement');
  const [editExpDesc, setEditExpDesc] = useState('');
  const [editExpAmount, setEditExpAmount] = useState('');
  const [editExpStatus, setEditExpStatus] = useState('Paid');

  // ERP Password Change States
  const [erpCurrentPassword, setErpCurrentPassword] = useState('');
  const [erpNewPassword, setErpNewPassword] = useState('');
  const [erpConfirmPassword, setErpConfirmPassword] = useState('');
  const [showErpCurrentPw, setShowErpCurrentPw] = useState(false);
  const [showErpNewPw, setShowErpNewPw] = useState(false);
  const [showErpConfirmPw, setShowErpConfirmPw] = useState(false);
  const [erpPwLoading, setErpPwLoading] = useState(false);
  const [erpPwSuccess, setErpPwSuccess] = useState(false);
  const [erpPwError, setErpPwError] = useState('');

  // Workers for Admin Password Reset in ERP
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [selectedStaffForReset, setSelectedStaffForReset] = useState(null);
  const [staffNewPassword, setStaffNewPassword] = useState('');
  const [staffResetMsg, setStaffResetMsg] = useState('');

  // Form inputs for Supplier
  const [suppName, setSuppName] = useState('');
  const [suppCategory, setSuppCategory] = useState('Organic Produce Farm');
  const [suppContact, setSuppContact] = useState('');
  const [suppPhone, setSuppPhone] = useState('');
  const [suppLocation, setSuppLocation] = useState('');

  // Form inputs for Purchase Order
  const [poSupplier, setPoSupplier] = useState('');
  const [poItemName, setPoItemName] = useState('');
  const [poItemQty, setPoItemQty] = useState('');
  const [poItemUnitPrice, setPoItemUnitPrice] = useState('');
  const [poNotes, setPoNotes] = useState('');

  // Form inputs for Production Batch
  const [batchProduct, setBatchProduct] = useState('Dehydrated Pineapple Slices');
  const [batchRawMaterial, setBatchRawMaterial] = useState('Fresh Grade-A Organic Pineapples');
  const [batchRawQty, setBatchRawQty] = useState('100');
  const [batchTargetYield, setBatchTargetYield] = useState('12');
  const [batchTemp, setBatchTemp] = useState('60');
  const [batchHours, setBatchHours] = useState('8');
  const [batchWorker, setBatchWorker] = useState('Rahul Sharma');

  // Form inputs for Expense
  const [expCategory, setExpCategory] = useState('Raw Materials Procurement');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');

  const fetchERPData = async () => {
    if (!userInfo) return;
    try {
      const headers = { Authorization: `Bearer ${userInfo.token}` };

      const [dashRes, suppRes, poRes, rmRes, batchRes, expRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/erp/dashboard`, { headers }),
        fetch(`${API_BASE_URL}/api/erp/suppliers`, { headers }),
        fetch(`${API_BASE_URL}/api/erp/purchase-orders`, { headers }),
        fetch(`${API_BASE_URL}/api/erp/raw-materials`, { headers }),
        fetch(`${API_BASE_URL}/api/erp/batches`, { headers }),
        fetch(`${API_BASE_URL}/api/erp/expenses`, { headers }),
      ]);

      if (dashRes.status === 401 || suppRes.status === 401) {
        localStorage.removeItem('userInfo');
        window.location.href = '/admin/login';
        return;
      }

      if (dashRes.ok) setMetrics(await dashRes.json());
      if (suppRes.ok) setSuppliers(await suppRes.json());
      if (poRes.ok) setPurchaseOrders(await poRes.json());
      if (rmRes.ok) setRawMaterials(await rmRes.json());
      if (batchRes.ok) setBatches(await batchRes.json());
      if (expRes.ok) setExpenses(await expRes.json());

      setLoading(false);
    } catch (err) {
      console.error('ERP fetch error:', err);
      setLoading(false);
    }
  };

  const fetchStaffAccounts = async () => {
    if (!userInfo || !userInfo.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStaffAccounts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Staff fetch error:', err);
    }
  };

  useEffect(() => {
    fetchERPData();
    if (userInfo?.isAdmin) {
      fetchStaffAccounts();
    }
  }, [userInfo]);

  // Handlers for Submissions
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name: suppName,
          category: suppCategory,
          contactPerson: suppContact,
          phone: suppPhone,
          location: suppLocation,
        }),
      });
      if (res.ok) {
        setShowSupplierModal(false);
        setSuppName('');
        setSuppContact('');
        setSuppPhone('');
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      const itemTotal = Number(poItemQty) * Number(poItemUnitPrice);
      const res = await fetch(`${API_BASE_URL}/api/erp/purchase-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          supplierName: poSupplier || (suppliers[0]?.name || 'Direct Farmers Collective'),
          items: [
            {
              rawMaterialName: poItemName,
              quantity: Number(poItemQty),
              unit: 'kg',
              unitPrice: Number(poItemUnitPrice),
              total: itemTotal,
            },
          ],
          totalCost: itemTotal,
          notes: poNotes,
        }),
      });
      if (res.ok) {
        setShowPOModal(false);
        setPoItemName('');
        setPoItemQty('');
        setPoItemUnitPrice('');
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReceivePO = async (poId) => {
    if (!window.confirm('Confirm receipt of PO shipment? This will automatically update Raw Material Inventory and log the expense.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/purchase-orders/${poId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status: 'Received' }),
      });
      if (res.ok) {
        fetchERPData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          productName: batchProduct,
          rawMaterialUsed: batchRawMaterial,
          rawMaterialQty: Number(batchRawQty),
          inputWeightKg: Number(batchRawQty),
          targetQuantity: Number(batchTargetYield),
          dehydrationTempCelsius: Number(batchTemp),
          dehydrationTimeHours: Number(batchHours),
          assignedWorker: batchWorker,
        }),
      });
      if (res.ok) {
        setShowBatchModal(false);
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateBatchStage = async (batchId, status, yieldKg = 0) => {
    try {
      const payload = { status };
      if (status === 'Completed') {
        payload.qcStatus = 'Passed QC (Grade A+)';
        payload.outputYieldKg = yieldKg || 12;
      }
      const res = await fetch(`${API_BASE_URL}/api/erp/batches/${batchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchERPData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          category: expCategory,
          description: expDesc,
          amount: Number(expAmount),
          status: 'Paid',
        }),
      });
      if (res.ok) {
        setShowExpenseModal(false);
        setExpDesc('');
        setExpAmount('');
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleErpPasswordChange = async (e) => {
    e.preventDefault();
    setErpPwError('');
    setErpPwSuccess(false);

    if (erpNewPassword.length < 6) {
      setErpPwError('New password must be at least 6 characters long.');
      return;
    }

    if (erpNewPassword !== erpConfirmPassword) {
      setErpPwError('New password and confirmation do not match.');
      return;
    }

    setErpPwLoading(true);
    try {
      await changePassword(erpCurrentPassword, erpNewPassword);
      setErpPwSuccess(true);
      setErpCurrentPassword('');
      setErpNewPassword('');
      setErpConfirmPassword('');
      setTimeout(() => setErpPwSuccess(false), 5000);
    } catch (err) {
      setErpPwError(err.message || 'Failed to update password. Verify current password.');
    } finally {
      setErpPwLoading(false);
    }
  };

  const handleResetStaffPassword = async (e) => {
    e.preventDefault();
    if (!selectedStaffForReset || staffNewPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers/${selectedStaffForReset._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ newPassword: staffNewPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStaffResetMsg(`Password updated for ${selectedStaffForReset.name}!`);
        setSelectedStaffForReset(null);
        setStaffNewPassword('');
        setTimeout(() => setStaffResetMsg(''), 4000);
      } else {
        alert(data.message || 'Failed to update staff password');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit & Delete Handlers for Suppliers
  const openEditSupplierModal = (s) => {
    setSelectedSupplier(s);
    setEditSuppName(s.name || '');
    setEditSuppCategory(s.category || 'Organic Produce Farm');
    setEditSuppContact(s.contactPerson || '');
    setEditSuppPhone(s.phone || '');
    setEditSuppLocation(s.location || '');
    setShowEditSupplierModal(true);
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/suppliers/${selectedSupplier._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name: editSuppName,
          category: editSuppCategory,
          contactPerson: editSuppContact,
          phone: editSuppPhone,
          location: editSuppLocation,
        }),
      });
      if (res.ok) {
        setShowEditSupplierModal(false);
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update supplier');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove supplier "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/suppliers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete supplier');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Handler for Purchase Orders
  const handleDeletePO = async (id, poNumber) => {
    if (!window.confirm(`Are you sure you want to delete Purchase Order ${poNumber}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/purchase-orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete purchase order');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Handler for Production Batches
  const handleDeleteBatch = async (id, batchNumber) => {
    if (!window.confirm(`Are you sure you want to delete batch ${batchNumber}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/batches/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete batch');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit & Delete Handlers for Raw Materials
  const openEditRMModal = (rm) => {
    setSelectedRM(rm);
    setEditRMName(rm.name || '');
    setEditRMCategory(rm.category || '');
    setEditRMStock(String(rm.stockQuantity || 0));
    setEditRMUnit(rm.unit || 'kg');
    setEditRMUnitCost(String(rm.unitCost || 0));
    setEditRMReorder(String(rm.reorderLevel || 0));
    setShowEditRMModal(true);
  };

  const handleUpdateRM = async (e) => {
    e.preventDefault();
    if (!selectedRM) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/raw-materials/${selectedRM._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name: editRMName,
          category: editRMCategory,
          stockQuantity: Number(editRMStock),
          unit: editRMUnit,
          unitCost: Number(editRMUnitCost),
          reorderLevel: Number(editRMReorder),
        }),
      });
      if (res.ok) {
        setShowEditRMModal(false);
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update raw material');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteRM = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete raw material "${name}" from warehouse records?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/raw-materials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete raw material');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit & Delete Handlers for Operating Expenses
  const openEditExpenseModal = (exp) => {
    setSelectedExpense(exp);
    setEditExpCategory(exp.category || 'Raw Materials Procurement');
    setEditExpDesc(exp.description || '');
    setEditExpAmount(String(exp.amount || 0));
    setEditExpStatus(exp.status || 'Paid');
    setShowEditExpenseModal(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    if (!selectedExpense) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/expenses/${selectedExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          category: editExpCategory,
          description: editExpDesc,
          amount: Number(editExpAmount),
          status: editExpStatus,
        }),
      });
      if (res.ok) {
        setShowEditExpenseModal(false);
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update expense');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteExpense = async (id, description) => {
    if (!window.confirm(`Are you sure you want to delete expense "${description}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/erp/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        fetchERPData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete expense');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Loading Dryway ERP System...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ERP Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(217,29,73,0.15) 0%, rgba(17,24,39,0.9) 100%)',
          border: '1px solid rgba(217, 29, 73, 0.3)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: '#d91d49',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '1px',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                textTransform: 'uppercase',
              }}
            >
              ERP Suite 2.0
            </span>
            <span style={{ color: '#22c55e', fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={14} /> Production & Supply Chain Connected
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-headings)', color: '#fff', margin: 0 }}>
            Dryway Enterprise Resource Planning (ERP)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.3rem', maxWidth: '650px' }}>
            Comprehensive management for farm procurement, raw fruit inventory, solar dehydration batch processing, finished yield tracking, and enterprise financials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setShowPOModal(true)} style={{ fontSize: '0.825rem' }}>
            <Truck size={16} /> New Purchase Order
          </button>
          <button className="btn btn-primary" onClick={() => setShowBatchModal(true)} style={{ fontSize: '0.825rem' }}>
            <Factory size={16} /> Start Dehydration Batch
          </button>
        </div>
      </div>

      {/* ERP Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'ERP Overview & Profit', icon: <TrendingUp size={16} /> },
          { id: 'procurement', label: 'Procurement & Farmers', icon: <Truck size={16} /> },
          { id: 'production', label: 'Dehydration & Batches', icon: <Factory size={16} /> },
          { id: 'materials', label: 'Raw Materials Inventory', icon: <Layers size={16} /> },
          { id: 'finance', label: 'Expense & COGS Accounting', icon: <DollarSign size={16} /> },
          { id: 'security', label: 'ERP Security & Password', icon: <KeyRound size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              background: activeSubTab === tab.id ? 'rgba(217, 29, 73, 0.2)' : 'transparent',
              color: activeSubTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: activeSubTab === tab.id ? '1px solid #d91d49' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: ERP OVERVIEW & NET PROFIT */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Key ERP Financial Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Net Enterprise Profit</span>
                <DollarSign size={20} color={metrics?.netEnterpriseProfit >= 0 ? '#22c55e' : '#ef4444'} />
              </div>
              <h3 style={{ fontSize: '1.75rem', color: metrics?.netEnterpriseProfit >= 0 ? '#22c55e' : '#ef4444', margin: 0 }}>
                ₹{(metrics?.netEnterpriseProfit || 0).toLocaleString('en-IN')}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
                Revenue minus Procurement & Opex
              </span>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Raw Material Stock Value</span>
                <Layers size={20} color="#2bbef9" />
              </div>
              <h3 style={{ fontSize: '1.75rem', color: '#fff', margin: 0 }}>
                ₹{(metrics?.totalRawMaterialValue || 0).toLocaleString('en-IN')}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#2bbef9', marginTop: '0.4rem', display: 'block' }}>
                {metrics?.rawMaterialsCount || 0} Material Categories
              </span>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Batches</span>
                <Factory size={20} color="#eab308" />
              </div>
              <h3 style={{ fontSize: '1.75rem', color: '#fff', margin: 0 }}>
                {metrics?.activeBatchesCount || 0} Active
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '0.4rem', display: 'block' }}>
                {metrics?.completedBatchesCount || 0} Batches Completed
              </span>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Procurement PO Spend</span>
                <Truck size={20} color="#d91d49" />
              </div>
              <h3 style={{ fontSize: '1.75rem', color: '#fff', margin: 0 }}>
                ₹{(metrics?.totalProcurementExpenses || 0).toLocaleString('en-IN')}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
                {metrics?.suppliersCount || 0} Verified Farm Suppliers
              </span>
            </div>
          </div>

          {/* Dehydration & Yield Performance Banner */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Factory size={18} color="#d91d49" /> Active Dehydration Batch Operations
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Batch #</th>
                    <th style={{ padding: '0.6rem' }}>Target Finished Item</th>
                    <th style={{ padding: '0.6rem' }}>Input Material</th>
                    <th style={{ padding: '0.6rem' }}>Input / Yield</th>
                    <th style={{ padding: '0.6rem' }}>Status Stage</th>
                    <th style={{ padding: '0.6rem' }}>Assigned Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#2bbef9' }}>{b.batchNumber}</td>
                      <td style={{ padding: '0.75rem 0.6rem', color: '#fff', fontWeight: 600 }}>{b.productName}</td>
                      <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>
                        {b.rawMaterialQty}kg {b.rawMaterialUsed}
                      </td>
                      <td style={{ padding: '0.75rem 0.6rem', color: '#22c55e', fontWeight: 600 }}>
                        {b.outputYieldKg > 0 ? `${b.outputYieldKg}kg Yield (${Math.round((b.outputYieldKg / b.inputWeightKg) * 100)}%)` : `Target ~${b.targetQuantity}kg`}
                      </td>
                      <td style={{ padding: '0.75rem 0.6rem' }}>
                        <span
                          style={{
                            background: b.status === 'Completed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                            color: b.status === 'Completed' ? '#22c55e' : '#eab308',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>{b.assignedWorker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PROCUREMENT & FARMERS */}
      {activeSubTab === 'procurement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Supplier Directory Section */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Farm & Raw Produce Suppliers</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                  Verified organic fruit plantations, spice farmers, and packaging manufacturers.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowSupplierModal(true)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                <Plus size={14} /> Add Supplier
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {suppliers.map((s) => (
                <div key={s._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>{s.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                        ★ {s.rating}
                      </span>
                      {userInfo?.isAdmin && (
                        <>
                          <button
                            onClick={() => openEditSupplierModal(s)}
                            style={{ background: 'none', border: 'none', color: '#2bbef9', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                            title="Edit Supplier"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(s._id, s.name)}
                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                            title="Delete Supplier"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p style={{ color: '#2bbef9', fontSize: '0.775rem', margin: '0 0 0.6rem 0' }}>{s.category}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span>👤 Contact: <strong>{s.contactPerson}</strong></span>
                    <span>📞 Phone: {s.phone}</span>
                    <span>📍 Location: {s.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Orders Section */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Procurement Purchase Orders (POs)</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                  Track incoming shipments and mark received produce to update raw inventory automatically.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowPOModal(true)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                <Plus size={14} /> Create Purchase Order
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>PO Number</th>
                    <th style={{ padding: '0.6rem' }}>Supplier</th>
                    <th style={{ padding: '0.6rem' }}>Raw Items</th>
                    <th style={{ padding: '0.6rem' }}>Total Cost</th>
                    <th style={{ padding: '0.6rem' }}>Status</th>
                    <th style={{ padding: '0.6rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#fff' }}>{po.poNumber}</td>
                      <td style={{ padding: '0.75rem 0.6rem', color: '#2bbef9' }}>{po.supplierName}</td>
                      <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>
                        {po.items.map((it) => `${it.quantity}${it.unit || 'kg'} ${it.rawMaterialName}`).join(', ')}
                      </td>
                      <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#fff' }}>₹{po.totalCost.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem 0.6rem' }}>
                        <span
                          style={{
                            background: po.status === 'Received' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(43, 190, 249, 0.15)',
                            color: po.status === 'Received' ? '#22c55e' : '#2bbef9',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.6rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {po.status !== 'Received' ? (
                            <button
                              onClick={() => handleReceivePO(po._id)}
                              style={{ background: '#22c55e', color: '#000', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}
                            >
                              Mark Received
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Stock Stocked</span>
                          )}
                          {userInfo?.isAdmin && (
                            <button
                              onClick={() => handleDeletePO(po._id, po.poNumber)}
                              style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                              title="Delete Purchase Order"
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
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DEHYDRATION & BATCH MANUFACTURING */}
      {activeSubTab === 'production' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Solar & Electric Dehydration Batches</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                  Manage raw fruit inputs, drying chamber temperature/duration, and final product yield ratios.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowBatchModal(true)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                <Plus size={14} /> Start New Batch
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {batches.map((b) => (
                <div key={b._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#2bbef9', fontSize: '0.75rem', fontWeight: 700 }}>{b.batchNumber}</span>
                      <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.2rem 0 0 0', fontWeight: 700 }}>{b.productName}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          background: b.status === 'Completed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: b.status === 'Completed' ? '#22c55e' : '#eab308',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {b.status}
                      </span>
                      {userInfo?.isAdmin && (
                        <button
                          onClick={() => handleDeleteBatch(b._id, b.batchNumber)}
                          style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                          title="Delete Batch Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Input Material:</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{b.rawMaterialQty}kg {b.rawMaterialUsed}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Dehydration Setting:</span>
                      <span style={{ color: '#eab308', fontWeight: 600 }}>{b.dehydrationTempCelsius}°C / {b.dehydrationTimeHours} Hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Quality Inspection:</span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>{b.qcStatus}</span>
                    </div>
                  </div>

                  {b.status !== 'Completed' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => handleUpdateBatchStage(b._id, 'Dehydrating')}
                        className="btn btn-secondary"
                        style={{ flex: 1, fontSize: '0.75rem', padding: '0.3rem' }}
                      >
                        Set Dehydrating
                      </button>
                      <button
                        onClick={() => handleUpdateBatchStage(b._id, 'Completed', Math.round(b.rawMaterialQty * 0.12))}
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '0.75rem', padding: '0.3rem', background: '#22c55e', color: '#000' }}
                      >
                        Complete Batch
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RAW MATERIALS INVENTORY */}
      {activeSubTab === 'materials' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Raw Materials Warehouse Inventory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem' }}>Material Item</th>
                  <th style={{ padding: '0.6rem' }}>Category</th>
                  <th style={{ padding: '0.6rem' }}>Stock Quantity</th>
                  <th style={{ padding: '0.6rem' }}>Unit Cost</th>
                  <th style={{ padding: '0.6rem' }}>Reorder Level</th>
                  <th style={{ padding: '0.75rem 0.6rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.6rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map((rm) => (
                  <tr key={rm._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#fff' }}>{rm.name}</td>
                    <td style={{ padding: '0.75rem 0.6rem', color: '#2bbef9' }}>{rm.category}</td>
                    <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: rm.stockQuantity <= rm.reorderLevel ? '#ef4444' : '#22c55e' }}>
                      {rm.stockQuantity} {rm.unit}
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem', color: '#fff' }}>₹{rm.unitCost} / {rm.unit}</td>
                    <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>{rm.reorderLevel} {rm.unit}</td>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      {rm.stockQuantity <= rm.reorderLevel ? (
                        <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Low Stock Alert
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Sufficient
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {userInfo?.isAdmin && (
                          <>
                            <button
                              onClick={() => openEditRMModal(rm)}
                              style={{ background: 'none', border: 'none', color: '#2bbef9', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                              title="Edit Material"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteRM(rm._id, rm.name)}
                              style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                              title="Delete Material"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ERP SECURITY & PASSWORD MANAGEMENT */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {staffResetMsg && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                color: '#22c55e',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={18} />
              <span>{staffResetMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* ERP User Password Change Card */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ background: 'rgba(217, 29, 73, 0.15)', color: '#d91d49', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontFamily: 'var(--font-headings)' }}>
                    Change ERP Account Password
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Signed in as: <strong style={{ color: '#38bdf8' }}>{userInfo?.email}</strong>
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '0.8rem' }}>
                Update your enterprise credentials for access to the ERP management system and store operations.
              </p>

              {erpPwSuccess && (
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid #22c55e',
                    color: '#22c55e',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>ERP Password updated successfully!</span>
                </div>
              )}

              {erpPwError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid var(--error)',
                    color: 'var(--error)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertTriangle size={18} />
                  <span>{erpPwError}</span>
                </div>
              )}

              <form onSubmit={handleErpPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Current ERP Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showErpCurrentPw ? 'text' : 'password'}
                      required
                      className="input-field"
                      style={{ paddingRight: '2.5rem' }}
                      placeholder="Enter current password"
                      value={erpCurrentPassword}
                      onChange={(e) => setErpCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowErpCurrentPw(!showErpCurrentPw)}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                      }}
                    >
                      {showErpCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>New ERP Password (min 6 chars)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showErpNewPw ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input-field"
                      style={{ paddingRight: '2.5rem' }}
                      placeholder="Enter new secure password"
                      value={erpNewPassword}
                      onChange={(e) => setErpNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowErpNewPw(!showErpNewPw)}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                      }}
                    >
                      {showErpNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showErpConfirmPw ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input-field"
                      style={{ paddingRight: '2.5rem' }}
                      placeholder="Re-enter new password"
                      value={erpConfirmPassword}
                      onChange={(e) => setErpConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowErpConfirmPw(!showErpConfirmPw)}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                      }}
                    >
                      {showErpConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={erpPwLoading || !erpCurrentPassword || !erpNewPassword || !erpConfirmPassword}
                  style={{ padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}
                >
                  {erpPwLoading ? 'Updating ERP Credentials...' : 'Save New ERP Password'}
                </button>
              </form>
            </div>

            {/* Enterprise Security Architecture Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Shield size={20} color="#22c55e" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>Enterprise Security Standards</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Encryption Protocol:</span>
                    <strong style={{ color: '#22c55e' }}>Bcrypt (10 Salt Rounds)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Session Token:</span>
                    <strong style={{ color: '#2bbef9' }}>JWT Signed (30-day Validity)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Unified Authentication:</span>
                    <strong style={{ color: '#f59e0b' }}>Role-Based Auto Redirection</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                    <span>Protected Endpoints:</span>
                    <strong style={{ color: '#fff' }}>Website, ERP, Procurement, Payroll</strong>
                  </div>
                </div>
              </div>

              {/* Workforce Password Management for Master Admin */}
              {userInfo?.isAdmin && staffAccounts.length > 0 && (
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={18} color="#f59e0b" />
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>Workforce Staff Credentials</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin Reset Capability</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {staffAccounts.map((worker) => (
                      <div
                        key={worker._id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.6rem 0.8rem',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{worker.name}</strong>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{worker.email} • {worker.workerRole}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStaffForReset(worker);
                            setStaffNewPassword('');
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', borderColor: '#f59e0b', color: '#f59e0b' }}
                        >
                          <KeyRound size={12} /> Reset Password
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {activeSubTab === 'finance' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Enterprise Operating Expense Ledger</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                Log electricity, dehydration grid costs, labor payroll, and procurement expenditures.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
              <Plus size={14} /> Log New Expense
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem' }}>Date</th>
                  <th style={{ padding: '0.6rem' }}>Expense Category</th>
                  <th style={{ padding: '0.6rem' }}>Description</th>
                  <th style={{ padding: '0.6rem' }}>Amount</th>
                  <th style={{ padding: '0.6rem' }}>Status</th>
                  <th style={{ padding: '0.6rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>{exp.date}</td>
                    <td style={{ padding: '0.75rem 0.6rem', color: '#2bbef9', fontWeight: 600 }}>{exp.category}</td>
                    <td style={{ padding: '0.75rem 0.6rem', color: '#fff' }}>{exp.description}</td>
                    <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#d91d49' }}>₹{exp.amount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {exp.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {userInfo?.isAdmin && (
                          <>
                            <button
                              onClick={() => openEditExpenseModal(exp)}
                              style={{ background: 'none', border: 'none', color: '#2bbef9', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                              title="Edit Expense"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(exp._id, exp.description)}
                              style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
                              title="Delete Expense"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD SUPPLIER */}
      {showSupplierModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Add Farm / Raw Supplier</h3>
            <form onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Supplier Organization Name</label>
                <input type="text" required className="input-field" value={suppName} onChange={(e) => setSuppName(e.target.value)} placeholder="e.g. Wayanad Organic Farmers" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                <select className="input-field" value={suppCategory} onChange={(e) => setSuppCategory(e.target.value)}>
                  <option value="Organic Produce Farm">Organic Produce Farm</option>
                  <option value="Spices & Herbs Plantation">Spices & Herbs Plantation</option>
                  <option value="Packaging & Glassware Manufacturer">Packaging & Glassware Manufacturer</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Contact Person</label>
                <input type="text" required className="input-field" value={suppContact} onChange={(e) => setSuppContact(e.target.value)} placeholder="e.g. Saji Varghese" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                <input type="text" required className="input-field" value={suppPhone} onChange={(e) => setSuppPhone(e.target.value)} placeholder="+91 98460 00000" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Location / Farm Address</label>
                <input type="text" className="input-field" value={suppLocation} onChange={(e) => setSuppLocation(e.target.value)} placeholder="Wayanad, Kerala" />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PURCHASE ORDER */}
      {showPOModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Create Raw Procurement PO</h3>
            <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Supplier</label>
                <select className="input-field" value={poSupplier} onChange={(e) => setPoSupplier(e.target.value)}>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s.name}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Raw Material Item Name</label>
                <input type="text" required className="input-field" value={poItemName} onChange={(e) => setPoItemName(e.target.value)} placeholder="e.g. Fresh Grade-A Organic Pineapples" />
              </div>
              <div className="form-row-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quantity (kg / pcs)</label>
                  <input type="number" required className="input-field" value={poItemQty} onChange={(e) => setPoItemQty(e.target.value)} placeholder="300" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unit Price (₹)</label>
                  <input type="number" required className="input-field" value={poItemUnitPrice} onChange={(e) => setPoItemUnitPrice(e.target.value)} placeholder="35" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Notes / Batch Reference</label>
                <input type="text" className="input-field" value={poNotes} onChange={(e) => setPoNotes(e.target.value)} placeholder="Seasonal fruit harvest PO" />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPOModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: START DEHYDRATION BATCH */}
      {showBatchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Start Dehydration Batch</h3>
            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Product Catalog Item</label>
                <input type="text" required className="input-field" value={batchProduct} onChange={(e) => setBatchProduct(e.target.value)} placeholder="Dehydrated Pineapple Slices" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Raw Material Input</label>
                <input type="text" required className="input-field" value={batchRawMaterial} onChange={(e) => setBatchRawMaterial(e.target.value)} placeholder="Fresh Grade-A Organic Pineapples" />
              </div>
              <div className="form-row-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Input Raw Weight (kg)</label>
                  <input type="number" required className="input-field" value={batchRawQty} onChange={(e) => setBatchRawQty(e.target.value)} placeholder="100" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expected Yield (kg)</label>
                  <input type="number" required className="input-field" value={batchTargetYield} onChange={(e) => setBatchTargetYield(e.target.value)} placeholder="12" />
                </div>
              </div>
              <div className="form-row-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Temp (°C)</label>
                  <input type="number" className="input-field" value={batchTemp} onChange={(e) => setBatchTemp(e.target.value)} placeholder="60" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration (Hours)</label>
                  <input type="number" className="input-field" value={batchHours} onChange={(e) => setBatchHours(e.target.value)} placeholder="8" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBatchModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Launch Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LOG EXPENSE */}
      {showExpenseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Log Operating Expense</h3>
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expense Category</label>
                <select className="input-field" value={expCategory} onChange={(e) => setExpCategory(e.target.value)}>
                  <option value="Raw Materials Procurement">Raw Materials Procurement</option>
                  <option value="Dehydration Energy & Power">Dehydration Energy & Power</option>
                  <option value="Workforce Payroll & Shifts">Workforce Payroll & Shifts</option>
                  <option value="Packaging & Warehousing">Packaging & Warehousing</option>
                  <option value="Logistics & Shipping">Logistics & Shipping</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Description</label>
                <input type="text" required className="input-field" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="e.g. Solar dehydrator grid utility payment" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
                <input type="number" required className="input-field" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder="4500" />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Record Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: RESET STAFF PASSWORD */}
      {selectedStaffForReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                <KeyRound size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Reset Staff Password</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  For: <strong style={{ color: '#fff' }}>{selectedStaffForReset.name}</strong> ({selectedStaffForReset.email})
                </span>
              </div>
            </div>

            <form onSubmit={handleResetStaffPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>New Temporary / Permanent Password</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  className="input-field"
                  value={staffNewPassword}
                  onChange={(e) => setStaffNewPassword(e.target.value)}
                  placeholder="Min 6 characters (e.g. worker2026)"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedStaffForReset(null);
                    setStaffNewPassword('');
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.2, background: '#f59e0b', borderColor: '#f59e0b', color: '#000', fontWeight: 700 }}
                >
                  Set New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT SUPPLIER */}
      {showEditSupplierModal && selectedSupplier && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Edit Supplier: {selectedSupplier.name}</h3>
              <button type="button" onClick={() => setShowEditSupplierModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Supplier Organization Name</label>
                <input type="text" required className="input-field" value={editSuppName} onChange={(e) => setEditSuppName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                <select className="input-field" value={editSuppCategory} onChange={(e) => setEditSuppCategory(e.target.value)}>
                  <option value="Organic Produce Farm">Organic Produce Farm</option>
                  <option value="Spices & Herbs Plantation">Spices & Herbs Plantation</option>
                  <option value="Packaging & Glassware Manufacturer">Packaging & Glassware Manufacturer</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Contact Person</label>
                <input type="text" required className="input-field" value={editSuppContact} onChange={(e) => setEditSuppContact(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                <input type="text" required className="input-field" value={editSuppPhone} onChange={(e) => setEditSuppPhone(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Location / Farm Address</label>
                <input type="text" className="input-field" value={editSuppLocation} onChange={(e) => setEditSuppLocation(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditSupplierModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Check size={16} /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT RAW MATERIAL */}
      {showEditRMModal && selectedRM && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Edit Raw Material: {selectedRM.name}</h3>
              <button type="button" onClick={() => setShowEditRMModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateRM} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Material Name</label>
                <input type="text" required className="input-field" value={editRMName} onChange={(e) => setEditRMName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                <input type="text" required className="input-field" value={editRMCategory} onChange={(e) => setEditRMCategory(e.target.value)} />
              </div>
              <div className="form-row-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stock Quantity</label>
                  <input type="number" required className="input-field" value={editRMStock} onChange={(e) => setEditRMStock(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unit</label>
                  <input type="text" required className="input-field" value={editRMUnit} onChange={(e) => setEditRMUnit(e.target.value)} />
                </div>
              </div>
              <div className="form-row-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unit Cost (₹)</label>
                  <input type="number" required className="input-field" value={editRMUnitCost} onChange={(e) => setEditRMUnitCost(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reorder Threshold</label>
                  <input type="number" required className="input-field" value={editRMReorder} onChange={(e) => setEditRMReorder(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditRMModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Check size={16} /> Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: EDIT EXPENSE */}
      {showEditExpenseModal && selectedExpense && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="glass-card animate-scale-up modal-responsive" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Edit Operating Expense</h3>
              <button type="button" onClick={() => setShowEditExpenseModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expense Category</label>
                <select className="input-field" value={editExpCategory} onChange={(e) => setEditExpCategory(e.target.value)}>
                  <option value="Raw Materials Procurement">Raw Materials Procurement</option>
                  <option value="Dehydration Energy & Power">Dehydration Energy & Power</option>
                  <option value="Workforce Payroll & Shifts">Workforce Payroll & Shifts</option>
                  <option value="Packaging & Warehousing">Packaging & Warehousing</option>
                  <option value="Logistics & Shipping">Logistics & Shipping</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Description</label>
                <input type="text" required className="input-field" value={editExpDesc} onChange={(e) => setEditExpDesc(e.target.value)} />
              </div>
              <div className="form-row-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
                  <input type="number" required className="input-field" value={editExpAmount} onChange={(e) => setEditExpAmount(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</label>
                  <select className="input-field" value={editExpStatus} onChange={(e) => setEditExpStatus(e.target.value)}>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditExpenseModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Check size={16} /> Update Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ERPDashboard;
