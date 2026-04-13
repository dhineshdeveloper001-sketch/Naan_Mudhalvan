import React from 'react';
import { Users, UserPlus, Briefcase, Layers, Trash2, MoreVertical } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { NewHireModal } from '../common/NewHireModal';
import { motion } from 'framer-motion';

const StageBadge: React.FC<{ stage: string }> = ({ stage }) => {
  const cfg = {
    onboarding:  { color: 'var(--accent-primary)', bg: 'rgba(99,102,241,0.1)',  label: 'Onboarding' },
    active:      { color: 'var(--accent-success)', bg: 'rgba(16,185,129,0.1)', label: 'Active' },
    offboarding: { color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)', label: 'Offboarding' },
  }[stage] ?? { color: 'var(--text-muted)', bg: 'transparent', label: stage };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: cfg.bg, color: cfg.color, textTransform: 'uppercase',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color }} />
      {cfg.label}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    active: 'var(--accent-success)', hired: 'var(--accent-primary)',
    promoted: 'var(--accent-info)', terminated: 'var(--accent-danger)',
  };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
      background: `${colorMap[status] ?? 'var(--text-muted)'}15`,
      color: colorMap[status] ?? 'var(--text-muted)',
    }}>
      {status}
    </span>
  );
};

export const EmployeeList: React.FC = () => {
  const { employees, triggerOnboarding, deleteEmployee } = useWorkflow();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Offboard ${name}? This cannot be undone.`)) deleteEmployee(id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <NewHireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={triggerOnboarding} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700' }}>Employee Directory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            {employees.length} employee{employees.length !== 1 ? 's' : ''} · Manage lifecycle and department allocations
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--accent-primary)', color: 'white',
            padding: '10px 16px', borderRadius: '10px',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)', whiteSpace: 'nowrap', alignSelf: 'flex-start',
          }}
        >
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      {/* ── Desktop Table ── */}
      <div className="glass-panel mobile-table-hidden" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              {['EMPLOYEE', 'ROLE & DEPT', 'STATUS', 'STAGE', ''].map((h, i) => (
                <th key={i} style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', flexShrink: 0 }}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{emp.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {emp.id.length > 12 ? `EMP_${emp.id.slice(-6).toUpperCase()}` : emp.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', marginBottom: '3px' }}>
                    <Briefcase size={13} style={{ opacity: 0.5 }} /> {emp.role}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Layers size={13} style={{ opacity: 0.5 }} /> {emp.department}
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}><StatusBadge status={emp.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ width: '140px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                      <StageBadge stage={emp.stage} />
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                      <div style={{ width: emp.stage === 'onboarding' ? '60%' : emp.stage === 'offboarding' ? '85%' : '100%', height: '100%', background: 'var(--accent-primary)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleDelete(emp.id, emp.name)}
                      style={{ padding: '6px', borderRadius: '6px', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={15} />
                    </button>
                    <button style={{ padding: '6px', borderRadius: '6px', color: 'var(--text-muted)' }}>
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Users size={40} style={{ opacity: 0.1, marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No employees found. Add your first hire above.</p>
          </div>
        )}
      </div>

      {/* ── Mobile Cards ── */}
      <div className="mobile-cards-hidden" style={{ flexDirection: 'column', gap: '12px' }}>
        {employees.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <Users size={36} style={{ opacity: 0.12, marginBottom: '10px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No employees yet. Tap "Add Employee" above.</p>
          </div>
        )}
        {employees.map((emp, i) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--accent-primary)', flexShrink: 0 }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600' }}>{emp.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.role}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(emp.id, emp.name)}
                style={{ padding: '6px', borderRadius: '6px', color: 'var(--accent-danger)', background: 'rgba(239,68,68,0.08)' }}>
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              <StatusBadge status={emp.status} />
              <StageBadge stage={emp.stage} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
                {emp.department}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>{emp.tasks.length} task{emp.tasks.length !== 1 ? 's' : ''}</span>
              <span>{emp.tasks.filter(t => t.status === 'completed').length} completed</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--accent-primary)', borderRadius: '2px', width: emp.stage === 'onboarding' ? '60%' : emp.stage === 'offboarding' ? '85%' : '100%', transition: 'width 0.5s ease' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
