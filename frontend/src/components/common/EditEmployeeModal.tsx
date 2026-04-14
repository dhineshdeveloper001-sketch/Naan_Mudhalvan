import React, { useState } from 'react';
import { X, Save, User, Briefcase, Layers } from 'lucide-react';
import { Employee } from '../../context/WorkflowContext';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updates: any) => void;
  employee: Employee | null;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, onSubmit, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
  });

  React.useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        role: employee.role,
        department: employee.department,
      });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(employee.id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '440px', padding: '28px',
        borderRadius: '24px', position: 'relative', border: '1px solid var(--border-color)',
        animation: 'modalSlideUp 0.3s ease-out'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Edit Profile</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Update employee details and department.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>FULL NAME</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--accent-primary)' }} />
              <input
                required type="text" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="modal-input" style={{ paddingLeft: '44px', width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>JOB ROLE</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--accent-primary)' }} />
              <input
                required type="text" value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="modal-input" style={{ paddingLeft: '44px', width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>DEPARTMENT</label>
            <div style={{ position: 'relative' }}>
              <Layers size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--accent-primary)' }} />
              <input
                required type="text" value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="modal-input" style={{ paddingLeft: '44px', width: '100%' }}
              />
            </div>
          </div>

          <button type="submit" style={{
            background: 'var(--accent-primary)', color: 'white', padding: '14px',
            borderRadius: '12px', fontSize: '14px', fontWeight: '600', marginTop: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <Save size={16} /> Save Changes
          </button>
        </form>
      </div>
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px 14px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .modal-input:focus {
          border-color: var(--accent-primary);
          background: rgba(99,102,241,0.08);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
      `}</style>
    </div>
  );
};
