import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { useWorkflow, PersonaType } from '../../context/WorkflowContext';

export const PersonaSelector: React.FC = () => {
  const { currentPersona, switchPersona } = useWorkflow();
  const [isOpen, setIsOpen] = React.useState(false);

  const personas: PersonaType[] = ['HR Admin', 'IT Manager', 'Security Officer', 'Facilities Lead'];

  const getPersonaColor = (role: PersonaType) => {
    switch (role) {
      case 'HR Admin': return '#10b981';
      case 'IT Manager': return '#3b82f6';
      case 'Security Officer': return '#ef4444';
      case 'Facilities Lead': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${getPersonaColor(currentPersona)}40`,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: getPersonaColor(currentPersona),
          boxShadow: `0 0 10px ${getPersonaColor(currentPersona)}80`,
        }} />
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {currentPersona}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.5, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
            onClick={() => setIsOpen(false)} 
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '200px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            zIndex: 999,
            padding: '6px',
            backdropFilter: 'blur(10px)',
          }}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', padding: '8px 10px', letterSpacing: '0.05em' }}>SELECT PERSONA</p>
            {personas.map(p => (
              <button
                key={p}
                onClick={() => {
                  switchPersona(p);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: currentPersona === p ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: currentPersona === p ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getPersonaColor(p) }} />
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
