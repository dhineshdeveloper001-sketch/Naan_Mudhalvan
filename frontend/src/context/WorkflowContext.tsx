import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'delayed';

export interface Task {
  id: string;
  title: string;
  department: 'IT' | 'Security' | 'Facilities' | 'HR';
  status: TaskStatus;
  assignee: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'hired' | 'active' | 'promoted' | 'terminated';
  department: string;
  stage: 'onboarding' | 'active' | 'offboarding';
  tasks: Task[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'hr' | 'it' | 'admin';
}

interface WorkflowContextType {
  employees: Employee[];
  logs: SystemLog[];
  activeView: string;
  setActiveView: (view: string) => void;
  triggerOnboarding: (name: string, role: string, department: string) => void;
  updateTaskStatus: (employeeId: string, taskId: string, status: TaskStatus) => void;
  addLog: (message: string, type: SystemLog['type']) => void;
  deleteEmployee: (id: string) => void;
  runSimulation: () => void;
  // Auth
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isApiMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// ─── API base URL ─────────────────────────────────────────────────────────────
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '';
const IS_API_MODE = Boolean(API_BASE);

// ─── Seed Data (localStorage fallback) ───────────────────────────────────────
const SEED_EMPLOYEES: Employee[] = [
  { id: 'EMP_001', name: 'Sarah Chen', role: 'Senior Software Engineer', status: 'active', department: 'Engineering', stage: 'active', tasks: [{ id: 'T1', title: 'Asset Provisioning', status: 'completed', department: 'IT', assignee: 'IT Support' }] },
  { id: 'EMP_002', name: 'Marcus Johnson', role: 'Product Manager', status: 'active', department: 'Product', stage: 'active', tasks: [{ id: 'T2', title: 'Email Account Setup', status: 'completed', department: 'IT', assignee: 'SysAdmin' }] },
  { id: 'EMP_003', name: 'Priya Patel', role: 'UX Designer', status: 'hired', department: 'Design', stage: 'onboarding', tasks: [{ id: 'T3a', title: 'Laptop Provisioning', status: 'in-progress', department: 'IT', assignee: 'IT Fleet' }, { id: 'T3b', title: 'Access Badge Creation', status: 'pending', department: 'Security', assignee: 'Security Desk' }, { id: 'T3c', title: 'Desk Allocation', status: 'pending', department: 'Facilities', assignee: 'Ops Team' }] },
];

const SEED_LOGS: SystemLog[] = [
  { id: 'L1', timestamp: '09:00:00 AM', message: 'System initialized. Enterprise backbone online.', type: 'success' },
  { id: 'L2', timestamp: '09:01:10 AM', message: 'New Hire Detected: Priya Patel (UX Designer)', type: 'info' },
  { id: 'L3', timestamp: '09:01:11 AM', message: 'Onboarding Workflow Triggered for EMP_003', type: 'success' },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_EMP  = 'gf_employees';
const LS_LOGS = 'gf_logs';
const LS_TOK  = 'gf_token';

const loadLS = <T,>(key: string, fallback: T): T => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : fallback; } catch { return fallback; } };
const saveLS = <T,>(key: string, v: T) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* noop */ } };
const genId  = (p = 'ID') => `${p}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

// ─── API data normalizers ─────────────────────────────────────────────────────
function normEmp(raw: any): Employee {
  return {
    id:         raw._id  || raw.id,
    name:       raw.name,
    role:       raw.role,
    status:     raw.status,
    department: raw.department,
    stage:      raw.stage,
    tasks: (raw.tasks || []).map((t: any) => ({
      id:         t._id || t.id,
      title:      t.title,
      department: t.department,
      status:     t.status,
      assignee:   t.assignee,
    })),
  };
}

function normLog(raw: any): SystemLog {
  const ts = raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString() : raw.timestamp || '';
  return { id: raw._id || raw.id, timestamp: ts, message: raw.message, type: raw.type };
}

// ─── Context ──────────────────────────────────────────────────────────────────
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs,      setLogs]      = useState<SystemLog[]>([]);
  const [activeView, setActiveView] = useState('home');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Use ref so callbacks always access the latest token without re-recreating
  const tokenRef = useRef<string | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────
  const apiHeaders = () => ({
    'Content-Type': 'application/json',
    ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
  });

  const fetchData = useCallback(async (tok: string) => {
    try {
      const h = { Authorization: `Bearer ${tok}` };
      const [empR, logR] = await Promise.all([
        fetch(`${API_BASE}/api/employees`, { headers: h }),
        fetch(`${API_BASE}/api/logs?limit=100`, { headers: h }),
      ]);
      if (empR.ok && logR.ok) {
        setEmployees((await empR.json()).map(normEmp));
        setLogs((await logR.json()).map(normLog));
        return;
      }
    } catch { /* fall through */ }
    // Fallback
    setEmployees(loadLS(LS_EMP, SEED_EMPLOYEES));
    setLogs(loadLS(LS_LOGS, SEED_LOGS));
  }, []);

  // ── Mount: restore session ──────────────────────────────────────
  useEffect(() => {
    if (!IS_API_MODE) {
      setEmployees(loadLS(LS_EMP, SEED_EMPLOYEES));
      setLogs(loadLS(LS_LOGS, SEED_LOGS));
      setLoading(false);
      return;
    }
    const tok = localStorage.getItem(LS_TOK);
    if (tok) {
      try {
        const payload = JSON.parse(atob(tok.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          tokenRef.current = tok;
          setCurrentUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
          fetchData(tok).finally(() => setLoading(false));
          return;
        }
      } catch { /* bad token */ }
      localStorage.removeItem(LS_TOK);
    }
    setLoading(false);
  }, [fetchData]);

  // ── localStorage persistence (fallback mode) ────────────────────
  useEffect(() => { if (!IS_API_MODE) saveLS(LS_EMP, employees); }, [employees]);
  useEffect(() => { if (!IS_API_MODE) saveLS(LS_LOGS, logs); }, [logs]);

  // ── Auth ────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    if (!IS_API_MODE) return { success: true }; // no-op in localStorage mode
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const { token, user } = await res.json();
        tokenRef.current = token;
        localStorage.setItem(LS_TOK, token);
        setCurrentUser(user);
        setLoading(true);
        await fetchData(token);
        setLoading(false);
        return { success: true };
      }
      const { error } = await res.json();
      return { success: false, error: error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, [fetchData]);

  const logout = useCallback(() => {
    tokenRef.current = null;
    localStorage.removeItem(LS_TOK);
    setCurrentUser(null);
    setEmployees([]);
    setLogs([]);
  }, []);

  // ── addLog ──────────────────────────────────────────────────────
  const addLog = useCallback(async (message: string, type: SystemLog['type']) => {
    const localLog: SystemLog = { id: genId('L'), timestamp: new Date().toLocaleTimeString(), message, type };
    setLogs(prev => [localLog, ...prev].slice(0, 100));
    if (IS_API_MODE && tokenRef.current) {
      try { await fetch(`${API_BASE}/api/logs`, { method: 'POST', headers: apiHeaders(), body: JSON.stringify({ message, type }) }); }
      catch { /* silent */ }
    }
  }, []);

  // ── triggerOnboarding ───────────────────────────────────────────
  const triggerOnboarding = useCallback(async (name: string, role: string, department: string) => {
    if (IS_API_MODE && tokenRef.current) {
      try {
        const res = await fetch(`${API_BASE}/api/employees`, {
          method: 'POST', headers: apiHeaders(),
          body: JSON.stringify({ name, role, department, status: 'hired' }),
        });
        if (res.ok) {
          const saved = await res.json();
          setEmployees(prev => [normEmp(saved), ...prev]);
          // Refresh logs
          const logRes = await fetch(`${API_BASE}/api/logs?limit=100`, { headers: apiHeaders() });
          if (logRes.ok) setLogs((await logRes.json()).map(normLog));
          return;
        }
      } catch { /* fall through */ }
    }
    // localStorage fallback
    const ts = Date.now();
    const emp: Employee = {
      id: genId('EMP'), name, role, department, status: 'hired', stage: 'onboarding',
      tasks: [
        { id: `T_IT_${ts}`,  title: 'Laptop Provisioning',   department: 'IT',         status: 'pending', assignee: 'IT Fleet' },
        { id: `T_IT2_${ts}`, title: 'Email Account Setup',   department: 'IT',         status: 'pending', assignee: 'SysAdmin' },
        { id: `T_SEC_${ts}`, title: 'Access Badge Creation', department: 'Security',   status: 'pending', assignee: 'Security Desk' },
        { id: `T_FAC_${ts}`, title: 'Desk Allocation',       department: 'Facilities', status: 'pending', assignee: 'Ops Team' },
      ],
    };
    setEmployees(prev => [emp, ...prev]);
    addLog(`New Hire Detected: ${name} (${role})`, 'info');
    addLog(`Onboarding Workflow Triggered for ${emp.id}`, 'success');
  }, [addLog]);

  // ── updateTaskStatus ────────────────────────────────────────────
  const updateTaskStatus = useCallback(async (employeeId: string, taskId: string, status: TaskStatus) => {
    if (IS_API_MODE && tokenRef.current) {
      try {
        const res = await fetch(`${API_BASE}/api/employees/${employeeId}/tasks/${taskId}`, {
          method: 'PATCH', headers: apiHeaders(),
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          const updated = await res.json();
          setEmployees(prev => prev.map(e => e.id === employeeId ? normEmp(updated) : e));
          addLog(`Task Updated → ${status}`, 'info');
          return;
        }
      } catch { /* fall through */ }
    }
    // localStorage fallback
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employeeId) return emp;
      return { ...emp, tasks: emp.tasks.map(t => t.id === taskId ? { ...t, status } : t) };
    }));
    addLog(`Task Updated: ${taskId} → ${status}`, 'info');
  }, [addLog]);

  // ── deleteEmployee ──────────────────────────────────────────────
  const deleteEmployee = useCallback(async (id: string) => {
    if (IS_API_MODE && tokenRef.current) {
      try {
        const res = await fetch(`${API_BASE}/api/employees/${id}`, {
          method: 'DELETE', headers: apiHeaders(),
        });
        if (res.ok) {
          setEmployees(prev => prev.filter(e => e.id !== id));
          addLog(`Employee Offboarded: ${id}`, 'warning');
          return;
        }
      } catch { /* fall through */ }
    }
    setEmployees(prev => {
      const emp = prev.find(e => e.id === id);
      if (emp) addLog(`Employee Offboarded: ${emp.name}`, 'warning');
      return prev.filter(e => e.id !== id);
    });
  }, [addLog]);

  // ── runSimulation ───────────────────────────────────────────────
  const runSimulation = useCallback(() => {
    addLog('Manual Simulation Triggered', 'warning');
    setTimeout(() => { triggerOnboarding('Simulation User', 'Automated Agent', 'System'); }, 500);
    setTimeout(() => { addLog('Active Directory: Provisions started for Simulation User', 'info'); }, 2000);
    setTimeout(() => { addLog('Slack: Notification sent to #general', 'success'); }, 3500);
  }, [addLog, triggerOnboarding]);

  // ── Loading spinner ─────────────────────────────────────────────
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0b14', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Connecting to Enterprise Backend...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <WorkflowContext.Provider value={{
      employees, logs, activeView, setActiveView,
      triggerOnboarding, updateTaskStatus, addLog, deleteEmployee, runSimulation,
      currentUser, isAuthenticated: !!currentUser || !IS_API_MODE,
      isApiMode: IS_API_MODE, login, logout,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within a WorkflowProvider');
  return ctx;
};
