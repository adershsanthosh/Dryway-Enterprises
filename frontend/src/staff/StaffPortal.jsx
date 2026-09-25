import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import AdminNavbar from '../admin/AdminNavbar';
import {
  Clock,
  Play,
  Square,
  Calendar,
  DollarSign,
  FileText,
  User,
  ShieldCheck,
  Award,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Factory,
  ShoppingBag,
} from 'lucide-react';

const StaffPortal = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('shift');
  const [sessions, setSessions] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Shift action states
  const [taskNote, setTaskNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!userInfo || (!userInfo.isWorker && !userInfo.isAdmin)) {
      navigate('/admin/login');
    }
  }, [userInfo, navigate]);

  const fetchStaffData = async () => {
    if (!userInfo) return;
    try {
      const headers = { Authorization: `Bearer ${userInfo.token}` };

      const [sessRes, payRes, batchRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/workers/attendance`, { headers }),
        fetch(`${API_BASE_URL}/api/workers/payroll`, { headers }),
        fetch(`${API_BASE_URL}/api/erp/batches`, { headers }),
      ]);

      if (sessRes.ok) setSessions(await sessRes.json());
      if (payRes.ok) setPayroll(await payRes.json());
      if (batchRes.ok) setBatches(await batchRes.json());

      setLoading(false);
    } catch (err) {
      console.error('Staff portal fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [userInfo]);

  const currentActiveSession = sessions.find(
    (s) => s.workerId === userInfo?._id && s.isActive
  );

  // Filter sessions for logged-in staff worker
  const mySessions = sessions.filter((s) => s.workerId === userInfo?._id);

  // Filter batches assigned to this worker
  const myBatches = batches.filter(
    (b) => b.assignedWorker?.toLowerCase() === userInfo?.name?.toLowerCase()
  );

  const handleClockIn = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers/sessions/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ taskDescription: taskNote || 'Active shift duty started' }),
      });
      if (res.ok) {
        setTaskNote('');
        fetchStaffData();
      } else {
        const data = await res.json();
        alert(data.message || 'Clock in failed');
      }
    } catch (err) {
      alert(err.message);
    }
    setActionLoading(false);
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers/sessions/clock-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ tasksCompleted: taskNote || 'Completed assigned shift duties' }),
      });
      if (res.ok) {
        setTaskNote('');
        fetchStaffData();
      } else {
        const data = await res.json();
        alert(data.message || 'Clock out failed');
      }
    } catch (err) {
      alert(err.message);
    }
    setActionLoading(false);
  };

  if (!userInfo) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <AdminNavbar />

      <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
        {/* Staff Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(43,190,249,0.15) 0%, rgba(15,23,42,0.9) 100%)',
            border: '1px solid rgba(43, 190, 249, 0.3)',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
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
                  background: '#2bbef9',
                  color: '#000',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                }}
              >
                Staff Portal
              </span>
              <span style={{ color: '#38bdf8', fontSize: '0.825rem', fontWeight: 600 }}>
                {userInfo.shiftTiming || 'Morning Shift (8:00 AM - 5:00 PM)'}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-headings)', color: '#fff', margin: 0 }}>
              Welcome back, <span style={{ color: '#2bbef9' }}>{userInfo.name}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
              Role: <strong>{userInfo.workerRole || 'Staff Member'}</strong> • Joined: {userInfo.joiningDate || '2026-01-15'}
            </p>
          </div>

          {/* Clock In / Out Quick Widget */}
          <div
            style={{
              background: currentActiveSession ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: currentActiveSession ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: currentActiveSession ? '#22c55e' : '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>
                {currentActiveSession ? '🟢 Shift Status: Clocked In' : '🔴 Shift Status: Offline'}
              </span>
              <div style={{ fontSize: '0.825rem', color: '#fff', marginTop: '0.2rem' }}>
                {currentActiveSession
                  ? `Clocked in at ${new Date(currentActiveSession.clockInTime).toLocaleTimeString()}`
                  : 'Ready to start your daily shift duty'}
              </div>
            </div>

            {currentActiveSession ? (
              <button
                className="btn btn-danger"
                onClick={handleClockOut}
                disabled={actionLoading}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Square size={14} /> Clock Out
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleClockIn}
                disabled={actionLoading}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#22c55e', color: '#000' }}
              >
                <Play size={14} /> Clock In
              </button>
            )}
          </div>
        </div>

        {/* Staff Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '2rem', overflowX: 'auto' }}>
          {[
            { id: 'shift', label: 'My Shift & Attendance', icon: <Clock size={16} /> },
            { id: 'payroll', label: 'My Salary & Payslips', icon: <DollarSign size={16} /> },
            { id: 'duties', label: 'Assigned Dehydration Duties', icon: <Factory size={16} /> },
            { id: 'profile', label: 'Staff Profile & Permissions', icon: <User size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                background: activeTab === tab.id ? 'rgba(43, 190, 249, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid #2bbef9' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SHIFT & ATTENDANCE */}
        {activeTab === 'shift' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Clock-in action box */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.8rem' }}>Daily Shift Check-In & Task Logger</h3>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Task notes (e.g. Washing pineapples for Batch #102)..."
                  className="input-field"
                  style={{ flex: 1, minWidth: '260px' }}
                  value={taskNote}
                  onChange={(e) => setTaskNote(e.target.value)}
                />
                {currentActiveSession ? (
                  <button className="btn btn-danger" onClick={handleClockOut} disabled={actionLoading}>
                    <Square size={16} /> Complete Shift & Clock Out
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleClockIn} disabled={actionLoading} style={{ background: '#22c55e', color: '#000' }}>
                    <Play size={16} /> Clock In (Start Shift)
                  </button>
                )}
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>My Attendance & Shift Duration Logs</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem' }}>Clock In Time</th>
                      <th style={{ padding: '0.6rem' }}>Clock Out Time</th>
                      <th style={{ padding: '0.6rem' }}>Duration</th>
                      <th style={{ padding: '0.6rem' }}>Status</th>
                      <th style={{ padding: '0.6rem' }}>Shift Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySessions.map((s) => (
                      <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 0.6rem', color: '#fff', fontWeight: 600 }}>
                          {new Date(s.clockInTime).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>
                          {s.clockOutTime ? new Date(s.clockOutTime).toLocaleString() : 'Active Shift'}
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#2bbef9' }}>
                          {s.durationHours ? `${s.durationHours} Hours` : 'In Progress'}
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem' }}>
                          <span
                            style={{
                              background: s.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: s.isActive ? '#22c55e' : 'var(--text-muted)',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                            }}
                          >
                            {s.status || (s.isActive ? 'Present' : 'Completed')}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>{s.tasksCompleted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYROLL & SALARY */}
        {activeTab === 'payroll' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Salary Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Base Monthly Salary</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', margin: '0.3rem 0 0 0' }}>
                  ₹{(userInfo.monthlySalary || 28000).toLocaleString('en-IN')}
                </h3>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hourly Wage Rate</span>
                <h3 style={{ fontSize: '1.6rem', color: '#2bbef9', margin: '0.3rem 0 0 0' }}>
                  ₹{userInfo.hourlyRate || 175} / hr
                </h3>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latest Net Pay</span>
                <h3 style={{ fontSize: '1.6rem', color: '#22c55e', margin: '0.3rem 0 0 0' }}>
                  ₹{(payroll[0]?.netPayable || userInfo.monthlySalary || 28000).toLocaleString('en-IN')}
                </h3>
              </div>
            </div>

            {/* Payslips History */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>Monthly Payslip Breakdown & Salary Accounts</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem' }}>Month Period</th>
                      <th style={{ padding: '0.6rem' }}>Base Salary</th>
                      <th style={{ padding: '0.6rem' }}>Overtime Pay</th>
                      <th style={{ padding: '0.6rem' }}>Allowances</th>
                      <th style={{ padding: '0.6rem' }}>Net Earnings</th>
                      <th style={{ padding: '0.6rem' }}>Status</th>
                      <th style={{ padding: '0.6rem' }}>Txn Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.map((p) => (
                      <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 0.6rem', fontWeight: 700, color: '#fff' }}>{p.monthYear}</td>
                        <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-secondary)' }}>₹{p.baseSalary.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '0.75rem 0.6rem', color: '#2bbef9' }}>
                          +₹{p.overtimePay.toLocaleString('en-IN')} <small>({p.overtimeHours} hrs)</small>
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', color: '#22c55e' }}>+₹{(p.allowances || 0).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '0.75rem 0.6rem', fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                          ₹{p.netPayable.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem' }}>
                          <span
                            style={{
                              background: p.paymentStatus === 'Paid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                              color: p.paymentStatus === 'Paid' ? '#22c55e' : '#eab308',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                            }}
                          >
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.transactionRef}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED DEHYDRATION DUTIES */}
        {activeTab === 'duties' && (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>My Assigned Solar & Electric Dehydration Batches</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {myBatches.map((b) => (
                <div key={b._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem' }}>
                  <span style={{ color: '#2bbef9', fontSize: '0.75rem', fontWeight: 700 }}>{b.batchNumber}</span>
                  <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.2rem 0 0.5rem 0' }}>{b.productName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span>🍊 Input: {b.rawMaterialQty}kg {b.rawMaterialUsed}</span>
                    <span>🌡️ Setting: {b.dehydrationTempCelsius}°C for {b.dehydrationTimeHours} Hours</span>
                    <span>Status: <strong style={{ color: '#eab308' }}>{b.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF PROFILE & PERMISSIONS */}
        {activeTab === 'profile' && (
          <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Staff Account Details & Permissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <div><strong>Staff Name:</strong> {userInfo.name}</div>
              <div><strong>Email:</strong> {userInfo.email}</div>
              <div><strong>Role Title:</strong> {userInfo.workerRole}</div>
              <div><strong>Monthly Base Salary:</strong> ₹{(userInfo.monthlySalary || 28000).toLocaleString('en-IN')}</div>
              <div><strong>Hourly Rate:</strong> ₹{userInfo.hourlyRate || 175} / hr</div>
              <div><strong>Shift Schedule:</strong> {userInfo.shiftTiming || 'Morning Shift'}</div>
              <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
              <div>
                <strong>Granted Permissions:</strong>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  {userInfo.permissions?.canEditPrices && <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Edit Product Prices</span>}
                  {userInfo.permissions?.canManageInventory && <span style={{ background: 'rgba(43,190,249,0.15)', color: '#2bbef9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Manage Warehouse Inventory</span>}
                  {userInfo.permissions?.canProcessOrders && <span style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Process Customer Orders</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPortal;
