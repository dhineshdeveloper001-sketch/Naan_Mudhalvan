import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Briefcase, Building2, ShieldCheck, Zap } from 'lucide-react';

interface NewHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, role: string, department: string) => void;
}

export const NewHireModal: React.FC<NewHireModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Engineering'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;
    
    setIsSubmitting(true);
    // Simulate a brief delay for enterprise feel
    setTimeout(() => {
      onSubmit(formData.name, formData.role, formData.department);
      setIsSubmitting(false);
      setFormData({ name: '', role: '', department: 'Engineering' });
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)'
                }}>
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Initiate Onboarding</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Launch workforce automation for a new team member.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} /> FULL NAME
                  </label>
                  <input
                    autoFocus
                    required
                    type="text"
                    placeholder="e.g. Johnathan Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 16px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={14} /> DESIGNATION
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 16px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} /> DEPARTMENT
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 16px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="Engineering" style={{ background: '#1e293b' }}>Engineering</option>
                    <option value="Product" style={{ background: '#1e293b' }}>Product</option>
                    <option value="Design" style={{ background: '#1e293b' }}>Design</option>
                    <option value="Marketing" style={{ background: '#1e293b' }}>Marketing</option>
                    <option value="HR" style={{ background: '#1e293b' }}>Human Resources</option>
                    <option value="Operations" style={{ background: '#1e293b' }}>Operations</option>
                  </select>
                </div>

                <div style={{ marginTop: '12px', padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Deploying this agent will trigger <strong style={{ color: 'var(--accent-primary)' }}>4 parallel provisioning tasks</strong> across IT, Security, and Facilities.
                  </p>
                </div>

                <button
                  disabled={isSubmitting || !formData.name || !formData.role}
                  type="submit"
                  style={{
                    background: 'var(--accent-primary)',
                    color: 'white',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '8px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    opacity: (isSubmitting || !formData.name || !formData.role) ? 0.6 : 1,
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Trigger Workflow
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
};
