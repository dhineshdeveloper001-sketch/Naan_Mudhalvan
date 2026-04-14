import React from 'react';
import { Shield, Users, Settings2, AlertTriangle, Activity, Lock, UserCheck, Bell } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion } from 'framer-motion';

const ROLES = [
  { role: 'HR Admin',         permissions: ['View All Employees', 'Trigger Lifecycle Events', 'Edit Profiles'],    color: 'var(--accent-primary)' },
  { role: 'IT Manager',       permissions: ['Manage IT Tasks', 'View Device List', 'Update AD Records'],           color: 'var(--accent-info)' },
  { role: 'Security Officer', permissions: ['Approve Badge Requests', 'Revoke Access', 'View Security Logs'],      color: 'var(--accent-danger)' },
  { role: 'Facilities Lead',  permissions: ['Allocate Desks', 'Manage Equipment', 'View Floor Plans'],             color: 'var(--accent-warning)' },
];

import { AccessRestricted } from '../common/AccessRestricted';

export const AdminConsole: React.FC = () => {
  const { employees, logs, addLog, can } = useWorkflow();
  const isMobile = useIsMobile();

  if (!can('view_admin')) {
    return <AccessRestricted requiredPermission="view_admin" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700' }}>Admin Console</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Full system access — roles, security, and audit logs.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '12px', fontWeight: '600', color: 'var(--accent-success)' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-success)' }} />
          System Nominal
        </div>
      </div>

      {/* Stats grid - 4→2→1 col */}
      <div className="grid-4">
        {[
          { label: 'Total Employees', value: employees.length, icon: Users,         color: 'var(--accent-primary)' },
          { label: 'Active Workflows',value: employees.filter(e => e.stage === 'onboarding').length, icon: Activity, color: 'var(--accent-info)' },
          { label: 'Security Alerts', value: 2,                icon: AlertTriangle, color: 'var(--accent-warning)' },
          { label: 'Compliance Score',value: '97%',            icon: Shield,        color: 'var(--accent-success)' },
        ].map((s, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: '700' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RBAC + Audit section */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* RBAC */}
        <div className="glass-panel" style={{ flex: '2 1 280px', borderRadius: 'var(--radius-lg)', padding: '22px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Lock size={17} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Role-Based Access Control</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ROLES.map((r, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={15} color={r.color} />
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{r.role}</span>
                  </div>
                  <button style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: `1px solid ${r.color}40`, color: r.color, background: `${r.color}08`, cursor: 'pointer' }}>
                    Edit
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {r.permissions.map((p, j) => (
                    <span key={j} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-secondary)' }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="glass-panel" style={{ flex: '1 1 220px', borderRadius: 'var(--radius-lg)', padding: '22px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Bell size={17} color="var(--accent-warning)" />
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Audit Trail</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            {logs.slice(0, 20).map(log => (
              <div key={log.id} style={{
                padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${log.type === 'success' ? 'var(--accent-success)' : log.type === 'warning' ? 'var(--accent-warning)' : log.type === 'error' ? 'var(--accent-danger)' : 'var(--accent-info)'}`,
              }}>
                <p style={{ fontSize: '12px', lineHeight: 1.5 }}>{log.message}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{log.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System config */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings2 size={20} color="var(--accent-primary)" />
          <div>
            <p style={{ fontWeight: '600', fontSize: '14px' }}>System Configuration</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>GravityFlow v2.4.1 · ServiceNow API Rev. 2024</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ roles: ROLES, version: '2.4.1' }, null, 2))}`;
              const a = document.createElement('a');
              a.setAttribute('href', data);
              a.setAttribute('download', 'system-config.json');
              document.body.appendChild(a); a.click(); a.remove();
              addLog('Exported system configuration', 'info');
            }}
            style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            Export Config
          </button>
          <button
            onClick={() => addLog('Settings saved successfully', 'success')}
            style={{ padding: '9px 16px', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', cursor: 'pointer' }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
