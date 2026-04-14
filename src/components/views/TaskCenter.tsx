import React, { useState } from 'react';
import { Monitor, ShieldAlert, Coffee, CheckCircle2, MoreHorizontal, Search, Filter } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { TaskStatus } from '../../context/WorkflowContext';

const STATUS_CFG: Record<TaskStatus, { bg: string; color: string; label: string }> = {
  pending:     { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', label: 'Pending' },
  'in-progress':{ bg: 'rgba(59,130,246,0.1)',  color: 'var(--accent-info)',    label: 'In Progress' },
  completed:   { bg: 'rgba(16,185,129,0.1)',   color: 'var(--accent-success)', label: 'Completed' },
  delayed:     { bg: 'rgba(239,68,68,0.1)',    color: 'var(--accent-danger)',  label: 'Delayed' },
};

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const s = STATUS_CFG[status];
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {status === 'completed' && <CheckCircle2 size={10} />}
      {status === 'in-progress' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', animation: 'pulse 2s infinite', display: 'inline-block' }} />}
      {s.label}
    </span>
  );
};

const DEPT_CFG = {
  IT:         { icon: Monitor,    color: 'var(--accent-info)' },
  Security:   { icon: ShieldAlert,color: 'var(--accent-danger)' },
  Facilities: { icon: Coffee,     color: 'var(--accent-warning)' },
} as const;

export const TaskCenter: React.FC = () => {
  const { employees, updateTaskStatus, currentPersona, can } = useWorkflow();
  const isMobile = useIsMobile();
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending'>('all');

  const allTasks = employees
    .flatMap(emp => emp.tasks.map(t => ({ ...t, employeeName: emp.name, employeeId: emp.id })))
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(t => activeFilter === 'all' || t.status === 'pending');

  const getDeptPermission = (dept: string) => {
    switch (dept) {
      case 'IT':         return 'manage_it_tasks';
      case 'Security':   return 'approve_badges';
      case 'Facilities': return 'allocate_desks';
      case 'HR':         return 'trigger_lifecycle';
      default:           return '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700' }}>Task Orchestration</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Centralized oversight of cross-departmental operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
          <div style={{ position: 'relative', flex: isMobile ? 1 : 'none' }}>
            <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Search tasks..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '9px 12px 9px 34px', color: 'white', fontSize: '13px', outline: 'none', width: isMobile ? '100%' : '200px' }}
            />
          </div>
          <button
            onClick={() => setActiveFilter(f => f === 'all' ? 'pending' : 'all')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px',
              background: activeFilter === 'pending' ? 'var(--accent-primary)' : 'transparent',
              color: activeFilter === 'pending' ? 'white' : 'inherit', whiteSpace: 'nowrap',
            }}
          >
            <Filter size={14} />
            {!isMobile && (activeFilter === 'pending' ? 'Pending Only' : 'All Tasks')}
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid-3">
        {(['IT', 'Security', 'Facilities', 'HR'] as const)
          .filter(dept => {
            if (currentPersona === 'HR Admin') return true;
            // Allow viewing if they can manage it OR if they can view all (HR Admin case handled above)
            return can(getDeptPermission(dept));
          })
          .map(dept => {
            const isTargetDept = can(getDeptPermission(dept)) && (
              (currentPersona === 'IT Manager' && dept === 'IT') ||
              (currentPersona === 'Security Officer' && dept === 'Security') ||
              (currentPersona === 'Facilities Lead' && dept === 'Facilities') ||
              (currentPersona === 'HR Admin' && dept === 'HR')
            );
            
            const cfg = dept === 'HR' ? { icon: Monitor, color: 'var(--accent-primary)' } : DEPT_CFG[dept as keyof typeof DEPT_CFG];
          const deptTasks = allTasks.filter(t => t.department === dept);
          const pending = deptTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;

          return (
            <div key={dept} className="glass-panel" style={{ 
              borderRadius: 'var(--radius-lg)', 
              display: 'flex', 
              flexDirection: 'column',
              border: isTargetDept ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: isTargetDept ? 'rgba(99,102,241,0.03)' : 'transparent'
            }}>
              <div style={{ padding: '18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <cfg.icon size={17} color={cfg.color} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{dept} Ops</h3>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: pending > 0 ? cfg.color : 'var(--text-muted)', background: pending > 0 ? `${cfg.color}15` : 'transparent', padding: '2px 8px', borderRadius: '10px' }}>
                  {pending} active
                </span>
              </div>

              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
                {deptTasks.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '32px 0' }}>No active tasks</p>
                ) : (
                  deptTasks.map(task => (
                    <div key={task.id} className="glass-card" style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '600' }}>{task.title}</h4>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.employeeName}
                          </p>
                        </div>
                        <MoreHorizontal size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--bg-tertiary)', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {task.assignee[0]}
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.assignee}</span>
                        </div>
                        <select
                          value={task.status}
                          onChange={e => updateTaskStatus(task.employeeId, task.id, e.target.value as TaskStatus)}
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '11px', padding: '3px 6px', borderRadius: '6px', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="delayed">Delayed</option>
                        </select>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
