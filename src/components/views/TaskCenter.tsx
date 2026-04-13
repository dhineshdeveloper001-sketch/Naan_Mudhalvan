import React, { useState } from 'react';
import { 
  Monitor, 
  ShieldAlert, 
  Coffee, 
  CheckCircle2, 
  MoreHorizontal,
  Search,
  Filter
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import type { TaskStatus } from '../../context/WorkflowContext';

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles = {
    pending: { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', label: 'Pending' },
    'in-progress': { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-info)', label: 'In Progress' },
    completed: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', label: 'Completed' },
    delayed: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', label: 'Delayed' },
  };

  const style = styles[status];

  return (
    <div style={{ 
      background: style.bg, 
      color: style.color, 
      padding: '4px 10px', 
      borderRadius: '20px', 
      fontSize: '11px', 
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      {status === 'completed' && <CheckCircle2 size={10} />}
      {status === 'in-progress' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', animation: 'pulse 2s infinite' }} />}
      {style.label}
    </div>
  );
};

export const TaskCenter: React.FC = () => {
  const { employees, updateTaskStatus } = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending'>('all');

  const allTasks = employees
    .flatMap(emp => emp.tasks.map(t => ({ ...t, employeeName: emp.name, employeeId: emp.id })))
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(t => activeFilter === 'all' || t.status === 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Task Orchestration</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Centralized oversight of cross-departmental operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input 
               type="text" 
               placeholder="Search tasks..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px 8px 36px', color: 'white', fontSize: '13px' }} 
             />
          </div>
          <button 
            onClick={() => setActiveFilter(f => f === 'all' ? 'pending' : 'all')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              fontSize: '13px',
              background: activeFilter === 'pending' ? 'var(--accent-primary)' : 'transparent',
              color: activeFilter === 'pending' ? 'white' : 'inherit'
            }}
          >
            <Filter size={16} />
            {activeFilter === 'pending' ? 'Pending Only' : 'All Tasks'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {['IT', 'Security', 'Facilities'].map(dept => (
           <div key={dept} className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', height: 'max-content' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                       {dept === 'IT' && <Monitor size={18} color="var(--accent-info)" />}
                       {dept === 'Security' && <ShieldAlert size={18} color="var(--accent-danger)" />}
                       {dept === 'Facilities' && <Coffee size={18} color="var(--accent-warning)" />}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{dept} Operations</h3>
                 </div>
                 <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{allTasks.filter(t => t.department === dept).length} Pending</span>
              </div>
              
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                 {allTasks.filter(t => t.department === dept).length === 0 ? (
                   <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>No active tasks</p>
                 ) : (
                   allTasks.filter(t => t.department === dept).map(task => (
                      <div key={task.id} className="glass-card" style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                               <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{task.title}</h4>
                               <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>For: {task.employeeName} ({task.employeeId})</p>
                            </div>
                            <MoreHorizontal size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-tertiary)', fontSize: '10px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>{task.assignee[0]}</div>
                               <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.assignee}</span>
                            </div>
                            <select 
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.employeeId, task.id, e.target.value as TaskStatus)}
                              style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: '11px', outline: 'none' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="delayed">Delayed</option>
                            </select>
                            <StatusBadge status={task.status} />
                         </div>
                      </div>
                   ))
                 )}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};
