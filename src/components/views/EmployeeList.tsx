import React from 'react';
import { 
  Users, 
  MoreVertical, 
  UserPlus, 
  Briefcase,
  Layers
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

import { NewHireModal } from '../common/NewHireModal';

export const EmployeeList: React.FC = () => {
  const { employees, triggerOnboarding } = useWorkflow();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <NewHireModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={triggerOnboarding} 
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Employee Directory</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage employee lifecycle and department allocations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
          background: 'var(--accent-primary)',
          color: 'white',
          padding: '10px 18px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>EMPLOYEE</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>ROLE & DEPT</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>WORKFLOW STAGE</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--accent-primary)20, var(--accent-secondary)20)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'var(--accent-primary)'
                    }}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{emp.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {emp.id}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}>
                       <Briefcase size={14} style={{ opacity: 0.6 }} />
                       {emp.role}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                       <Layers size={14} style={{ opacity: 0.6 }} />
                       {emp.department}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                   <div style={{ 
                     display: 'inline-flex', 
                     padding: '4px 12px', 
                     borderRadius: '20px', 
                     fontSize: '11px', 
                     fontWeight: '700',
                     background: emp.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                     color: emp.status === 'active' ? 'var(--accent-success)' : 'var(--accent-primary)',
                     textTransform: 'uppercase'
                   }}>
                     {emp.status}
                   </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                   <div style={{ width: '100%', maxWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>{emp.stage === 'onboarding' ? 'Onboarding' : 'Complete'}</span>
                         <span>{emp.stage === 'onboarding' ? '65%' : '100%'}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                         <div style={{ 
                           width: emp.stage === 'onboarding' ? '65%' : '100%', 
                           height: '100%', 
                           background: 'var(--accent-primary)', 
                           borderRadius: '3px' 
                         }} />
                      </div>
                   </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', opacity: 0.6 }}>
                    <button><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div style={{ padding: '80px', textAlign: 'center' }}>
             <Users size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
             <p style={{ color: 'var(--text-muted)' }}>No employees found</p>
          </div>
        )}
      </div>

      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.03);
          transform: scale(1.002);
        }
      `}</style>
    </div>
  );
};
