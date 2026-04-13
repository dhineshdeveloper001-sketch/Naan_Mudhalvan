import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

const DEMO_USERS = [
  { label: 'Admin',      email: 'admin@gravityflow.com', password: 'admin123', color: '#6366f1' },
  { label: 'HR Manager', email: 'hr@gravityflow.com',    password: 'hr1234',   color: '#10b981' },
  { label: 'IT Manager', email: 'it@gravityflow.com',    password: 'it1234',   color: '#3b82f6' },
];

export const LoginPage: React.FC = () => {
  const { login } = useWorkflow();
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [activeDemoIdx, setActiveDemoIdx] = useState<number | null>(null);

  const fillDemo = (i: number) => {
    setActiveDemoIdx(i);
    setEmail(DEMO_USERS[i].email);
    setPassword(DEMO_USERS[i].password);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 50%), #0a0b14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Floating orbs */}
      {[
        { top: '10%', left: '5%', size: 300, color: 'rgba(99,102,241,0.06)' },
        { top: '60%', right: '5%', size: 400, color: 'rgba(6,182,212,0.05)' },
        { bottom: '5%', left: '30%', size: 250, color: 'rgba(99,102,241,0.07)' },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: orb.top, left: (orb as any).left, right: (orb as any).right, bottom: (orb as any).bottom,
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              borderRadius: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            <Zap size={32} color="white" />
          </motion.div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.03em', color: '#f8fafc' }}>GravityFlow</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>Enterprise Workflow Automation</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '36px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <Shield size={18} color="#6366f1" />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>Secure Sign In</h2>
          </div>

          {/* Demo credentials */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Quick Access — Demo Accounts
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {DEMO_USERS.map((u, i) => (
                <button
                  key={i}
                  onClick={() => fillDemo(i)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    border: activeDemoIdx === i ? `1px solid ${u.color}` : '1px solid rgba(255,255,255,0.08)',
                    background: activeDemoIdx === i ? `${u.color}18` : 'rgba(255,255,255,0.03)',
                    color: activeDemoIdx === i ? u.color : '#94a3b8',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Mail size={12} /> EMAIL ADDRESS
              </label>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(''); setActiveDemoIdx(null); }}
                placeholder="you@company.com"
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Lock size={12} /> PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); setActiveDemoIdx(null); }}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button
                  type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                marginTop: '8px', padding: '14px',
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', borderRadius: '10px', fontWeight: '700', fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Authenticating...</>
              ) : (
                <><Zap size={18} fill="white" /> Sign In to GravityFlow <ChevronRight size={16} /></>
              )}
            </motion.button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#334155', marginTop: '20px' }}>
          Enterprise Workflow Automation System v2.4.1
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #334155; }
      `}</style>
    </div>
  );
};
