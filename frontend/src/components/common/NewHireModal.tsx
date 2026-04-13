import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Briefcase, Building2, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, role: string, department: string) => void;
}

const DEPTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Human Resources', 'Operations'];

export const NewHireModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [form,        setForm]        = useState({ name: '', role: '', department: 'Engineering' });
  const [isSubmitting,setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(form.name, form.role, form.department);
      setIsSubmitting(false);
      setForm({ name: '', role: '', department: 'Engineering' });
      onClose();
    }, 600);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{   scale: 0.92, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="glass-panel"
            style={{
              width: '100%', maxWidth: '460px',
              borderRadius: '20px', padding: '28px',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
              maxHeight: '90dvh', overflowY: 'auto',
            }}
          >
            {/* Close */}
            <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', color: 'var(--text-muted)', transition: 'color 0.2s', padding: '4px' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <UserPlus size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Initiate Onboarding</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Launch workforce automation for a new team member.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px', letterSpacing: '0.06em' }}>
                  <ShieldCheck size={12} /> FULL NAME
                </label>
                <input
                  autoFocus required type="text" placeholder="e.g. Johnathan Smith"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Role */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px', letterSpacing: '0.06em' }}>
                  <Briefcase size={12} /> DESIGNATION
                </label>
                <input
                  required type="text" placeholder="e.g. Senior Backend Engineer"
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Department */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px', letterSpacing: '0.06em' }}>
                  <Building2 size={12} /> DEPARTMENT
                </label>
                <select
                  value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  {DEPTS.map(d => <option key={d} value={d} style={{ background: '#1e293b' }}>{d}</option>)}
                </select>
              </div>

              {/* Info box */}
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.05)', border: '1px dashed rgba(99,102,241,0.2)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Deploying this agent will trigger <strong style={{ color: 'var(--accent-primary)' }}>4 parallel provisioning tasks</strong> across IT, Security, and Facilities.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !form.name || !form.role}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)',
                  color: 'white', padding: '14px', borderRadius: '10px',
                  fontWeight: '700', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                  opacity: (isSubmitting || !form.name || !form.role) ? 0.55 : 1,
                  cursor: (isSubmitting || !form.name || !form.role) ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                {isSubmitting ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Deploying...</>
                ) : (
                  <><Zap size={17} /> Trigger Onboarding Workflow</>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder, textarea::placeholder { color: #334155; }`}</style>
    </AnimatePresence>
  );
};
