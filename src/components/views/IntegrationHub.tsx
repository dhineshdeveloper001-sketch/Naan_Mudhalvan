import React from 'react';
import { 
  Cloud, 
  Terminal, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Link2,
  HardDrive
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { motion } from 'framer-motion';

const IntegrationCard: React.FC<{ 
  name: string; 
  status: 'connected' | 'error' | 'syncing'; 
  icon: any; 
  latency: string;
}> = ({ name, status, icon: Icon, latency }) => (
  <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ 
      width: '48px', 
      height: '48px', 
      borderRadius: '12px', 
      background: 'rgba(255,255,255,0.05)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Icon size={24} color={status === 'error' ? 'var(--accent-danger)' : 'var(--accent-primary)'} />
    </div>
    <div style={{ flex: 1 }}>
      <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{name}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: status === 'connected' ? 'var(--accent-success)' : status === 'syncing' ? 'var(--accent-warning)' : 'var(--accent-danger)' 
        }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{status}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>• {latency}</span>
      </div>
    </div>
    <button 
      onClick={() => window.dispatchEvent(new CustomEvent('integration-refresh', { detail: name }))}
      style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
    >
      <RefreshCw size={14} />
    </button>
  </div>
);

export const IntegrationHub: React.FC = () => {
  const { logs, addLog } = useWorkflow();

  React.useEffect(() => {
    const handleRefresh = (e: Event) => {
      const name = (e as CustomEvent).detail;
      addLog(`Manual sync triggered for ${name}`, 'info');
      setTimeout(() => {
        addLog(`Completed sync for ${name}`, 'success');
      }, 1500);
    };

    window.addEventListener('integration-refresh', handleRefresh);
    return () => window.removeEventListener('integration-refresh', handleRefresh);
  }, [addLog]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Integration Hub</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Live status of enterprise API connections and automation logs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <IntegrationCard name="Workday HRIS" status="connected" icon={Cloud} latency="14ms" />
        <IntegrationCard name="Active Directory" status="syncing" icon={HardDrive} latency="42ms" />
        <IntegrationCard name="Slack Bot" status="connected" icon={Activity} latency="8ms" />
        <IntegrationCard name="Azure Assets" status="error" icon={Link2} latency="--" />
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
        <div className="glass-panel" style={{ flex: 2, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Terminal size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Automation Logs</h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time stream</span>
          </div>
          <div style={{ 
            padding: '16px', 
            flex: 1, 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            background: 'rgba(0,0,0,0.2)',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {logs.map(log => (
              <div key={log.id} style={{ marginBottom: '8px', display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
                <span style={{ 
                  color: log.type === 'success' ? 'var(--accent-success)' : 
                         log.type === 'warning' ? 'var(--accent-warning)' : 
                         log.type === 'error' ? 'var(--accent-danger)' : 'var(--accent-info)'
                }}>
                  {log.type.toUpperCase()}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{log.message}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{new Date().toLocaleTimeString()}]</span>
                <span style={{ color: 'var(--accent-info)' }}>LISTEN</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>Awaiting new triggers...</span>
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ width: '8px', height: '14px', background: 'var(--accent-primary)', display: 'inline-block' }}
                />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ flex: 1, borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             {[
               { label: 'Uptime', value: '99.98%', icon: Activity, color: 'var(--accent-success)' },
               { label: 'Success Rate', value: '94.2%', icon: CheckCircle2, color: 'var(--accent-success)' },
               { label: 'Alerts (24h)', value: '12', icon: AlertTriangle, color: 'var(--accent-warning)' },
             ].map((stat, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <stat.icon size={18} color={stat.color} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.label}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{stat.value}</span>
               </div>
             ))}
          </div>
          
          <div style={{ marginTop: '32px' }}>
             <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-muted)' }}>API USAGE</h4>
             <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
               {Array.from({ length: 20 }).map((_, i) => (
                 <div key={i} style={{ 
                   flex: 1, 
                   background: 'var(--accent-primary)', 
                   opacity: 0.2 + (Math.random() * 0.8),
                   height: `${30 + Math.random() * 70}%`,
                   borderRadius: '2px'
                 }} />
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
