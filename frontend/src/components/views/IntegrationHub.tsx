import React from 'react';
import { Cloud, Terminal, RefreshCw, Activity, CheckCircle2, AlertTriangle, Link2, HardDrive } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion } from 'framer-motion';

type IntStatus = 'connected' | 'error' | 'syncing';

const IntegrationCard: React.FC<{ name: string; status: IntStatus; icon: any; latency: string; onRefresh: () => void }> = ({ name, status, icon: Icon, latency, onRefresh }) => (
  <div className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={status === 'error' ? 'var(--accent-danger)' : 'var(--accent-primary)'} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, background: status === 'connected' ? 'var(--accent-success)' : status === 'syncing' ? 'var(--accent-warning)' : 'var(--accent-danger)' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{status}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>· {latency}</span>
      </div>
    </div>
    <button onClick={onRefresh} style={{ padding: '7px', borderRadius: '7px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', flexShrink: 0 }}>
      <RefreshCw size={13} />
    </button>
  </div>
);

export const IntegrationHub: React.FC = () => {
  const { logs, addLog } = useWorkflow();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handler = (e: Event) => {
      const name = (e as CustomEvent).detail;
      addLog(`Manual sync triggered for ${name}`, 'info');
      setTimeout(() => addLog(`Completed sync for ${name}`, 'success'), 1500);
    };
    window.addEventListener('integration-refresh', handler);
    return () => window.removeEventListener('integration-refresh', handler);
  }, [addLog]);

  const refresh = (name: string) =>
    window.dispatchEvent(new CustomEvent('integration-refresh', { detail: name }));

  const integrations: Array<{ name: string; status: IntStatus; icon: any; latency: string }> = [
    { name: 'Workday HRIS',    status: 'connected', icon: Cloud,     latency: '14ms' },
    { name: 'Active Directory',status: 'syncing',   icon: HardDrive, latency: '42ms' },
    { name: 'Slack Bot',       status: 'connected', icon: Activity,  latency: '8ms'  },
    { name: 'Azure Assets',    status: 'error',     icon: Link2,     latency: '--'   },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700' }}>Integration Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Live status of enterprise API connections and automation logs.</p>
      </div>

      {/* Integration cards - 4→2→1 col */}
      <div className="grid-4">
        {integrations.map(i => (
          <IntegrationCard key={i.name} {...i} onRefresh={() => refresh(i.name)} />
        ))}
      </div>

      {/* Logs + Health */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Terminal log */}
        <div className="glass-panel" style={{ flex: '2 1 280px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Automation Logs</h3>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time stream</span>
          </div>
          <div style={{ padding: '14px', fontFamily: 'monospace', fontSize: '12px', background: 'rgba(0,0,0,0.25)', maxHeight: isMobile ? '260px' : '380px', overflowY: 'auto', flex: 1 }}>
            {logs.map(log => (
              <div key={log.id} style={{ marginBottom: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{log.timestamp}]</span>
                <span style={{ color: log.type === 'success' ? 'var(--accent-success)' : log.type === 'warning' ? 'var(--accent-warning)' : log.type === 'error' ? 'var(--accent-danger)' : 'var(--accent-info)', flexShrink: 0 }}>
                  {log.type.toUpperCase()}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)', wordBreak: 'break-word' }}>{log.message}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>[{new Date().toLocaleTimeString()}]</span>
              <span style={{ color: 'var(--accent-info)' }}>LISTEN</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>Awaiting triggers...</span>
              <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: '7px', height: '13px', background: 'var(--accent-primary)', display: 'inline-block' }} />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="glass-panel" style={{ flex: '1 1 200px', borderRadius: 'var(--radius-lg)', padding: '22px', minWidth: 0 }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
            {[
              { label: 'Uptime',       value: '99.98%', icon: Activity,      color: 'var(--accent-success)' },
              { label: 'Success Rate', value: '94.2%',  icon: CheckCircle2,  color: 'var(--accent-success)' },
              { label: 'Alerts (24h)', value: '12',     icon: AlertTriangle, color: 'var(--accent-warning)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <s.icon size={17} color={s.color} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>API USAGE</h4>
          <div style={{ height: '72px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ flex: 1, background: 'var(--accent-primary)', opacity: 0.15 + Math.random() * 0.7, height: `${30 + Math.random() * 70}%`, borderRadius: '2px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
