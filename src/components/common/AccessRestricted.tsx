import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

interface AccessRestrictedProps {
  requiredPermission?: string;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({ requiredPermission }) => {
  const { setActiveView, currentPersona } = useWorkflow();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 160px)',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: 'rgba(239, 68, 68, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)'
      }}>
        <ShieldAlert size={40} color="var(--accent-danger)" />
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
        Access Restricted
      </h2>
      
      <p style={{ 
        fontSize: '15px', 
        color: 'var(--text-secondary)', 
        maxWidth: '400px', 
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        Your current persona (<strong>{currentPersona}</strong>) does not have the necessary clearance level to access this secure terminal.
        {requiredPermission && (
          <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
            Missing Clearance: <code>{requiredPermission}</code>
          </span>
        )}
      </p>

      <button
        onClick={() => setActiveView('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
      >
        <ArrowLeft size={16} />
        Return to Dashboard
      </button>
    </div>
  );
};
