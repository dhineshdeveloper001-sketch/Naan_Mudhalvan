import React, { useState } from 'react';
import {
  Database,
  Cpu,
  Zap,
  ShieldCheck,
  Monitor,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Download,
  Trash2,
  Key,
  Unlock,
  Archive,
  RefreshCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';

type NodeStatus = 'success' | 'active' | 'pending';

interface FlowNode {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  status: NodeStatus;
  department?: string;
}

const NODE_W = 180;
const NODE_H = 100;

const NODE_COLORS: Record<NodeStatus, { bg: string; border: string; glow: string; icon: string }> = {
  success: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.5)',
    glow: '0 0 18px rgba(16,185,129,0.2)',
    icon: '#10b981',
  },
  active: {
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.7)',
    glow: '0 0 24px rgba(99,102,241,0.3)',
    icon: '#6366f1',
  },
  pending: {
    bg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.12)',
    glow: 'none',
    icon: '#64748b',
  },
};

const FlowNodeCard: React.FC<FlowNode & { delay: number }> = ({
  icon: Icon, title, description, status, delay,
}) => {
  const c = NODE_COLORS[status];
  return (
    <motion.foreignObject
      width={NODE_W}
      height={NODE_H}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: '14px',
          boxShadow: c.glow,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px',
          boxSizing: 'border-box',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer line at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
        }} />

        <div style={{
          width: '36px', height: '36px', flexShrink: 0,
          borderRadius: '10px',
          background: `${c.icon}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={c.icon} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', lineHeight: 1.3, marginBottom: '3px' }}>
            {title}
          </p>
          <p style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4, wordBreak: 'break-word' }}>
            {description}
          </p>
        </div>

        {status === 'active' && (
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#6366f1',
            }}
          />
        )}
        {status === 'success' && (
          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
            <CheckCircle2 size={14} color="#10b981" />
          </div>
        )}
        {status === 'pending' && (
          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
            <Clock size={14} color="#64748b" />
          </div>
        )}
      </div>
    </motion.foreignObject>
  );
};

// ---------------- Layout geometry ----------------
// Canvas size
const CW = 960;
const CH = 580;

// Node positions (top-left corner)
const POS = {
  trigger: { x: (CW - NODE_W) / 2, y: 20 },
  engine:  { x: (CW - NODE_W) / 2, y: 160 },
  it:      { x: 60,                 y: 320 },
  sec:     { x: (CW - NODE_W) / 2, y: 320 },
  fac:     { x: CW - NODE_W - 60,  y: 320 },
  hub:     { x: (CW - NODE_W) / 2, y: 460 },
};

// Center of a node box
const cx = (p: { x: number; y: number }) => p.x + NODE_W / 2;

const Arrow: React.FC<{ d: string; delay: number }> = ({ d, delay }) => (
  <motion.path
    d={d}
    stroke="url(#arrowGrad)"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeDasharray="6 4"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ delay, duration: 0.8, ease: 'easeInOut' }}
  />
);

export const FlowDesigner: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'onboarding' | 'offboarding'>('onboarding');
  const { runSimulation } = useWorkflow();

  const onboardingNodes: (FlowNode & { posKey: keyof typeof POS; delay: number })[] = [
    { id: 'trigger', icon: Zap,       title: 'HRIS Trigger',     description: "Workday: Status = 'Hired'",      status: 'success', posKey: 'trigger', delay: 0.1 },
    { id: 'engine',  icon: Cpu,        title: 'Workflow Engine',   description: 'Parallel task orchestration',   status: 'active',  posKey: 'engine',  delay: 0.35 },
    { id: 'it',      icon: Monitor,    title: 'IT Provisioning',   description: 'Email · Laptop · AD Account',   status: 'active',  posKey: 'it',      delay: 0.65 },
    { id: 'sec',     icon: ShieldCheck,title: 'Security Access',   description: 'Badge · Keycard · VPN',         status: 'active',  posKey: 'sec',     delay: 0.7 },
    { id: 'fac',     icon: Home,       title: 'Facilities Setup',  description: 'Desk · Equipment · Welcome Kit', status: 'pending', posKey: 'fac',     delay: 0.75 },
    { id: 'hub',     icon: Database,   title: 'Integration Hub',   description: 'AD · Slack · Email · Assets',   status: 'pending', posKey: 'hub',     delay: 1.0 },
  ];

  const offboardingNodes: (FlowNode & { posKey: keyof typeof POS; delay: number })[] = [
    { id: 'trigger', icon: Archive,    title: 'HRIS Trigger',     description: "Workday: Status = 'Terminated'", status: 'success', posKey: 'trigger', delay: 0.1 },
    { id: 'engine',  icon: RefreshCcw, title: 'Workflow Engine',   description: 'Parallel termination tasks',    status: 'active',  posKey: 'engine',  delay: 0.35 },
    { id: 'it',      icon: Unlock,     title: 'IT Revocation',     description: 'Revoke Email, VPN, Access',      status: 'active',  posKey: 'it',      delay: 0.65 },
    { id: 'sec',     icon: Key,        title: 'Security Disable',  description: 'Deactivate Badge & Keycard',     status: 'pending', posKey: 'sec',     delay: 0.7 },
    { id: 'fac',     icon: Trash2,     title: 'Asset Recovery',    description: 'Collect Laptop & Equipment',     status: 'pending', posKey: 'fac',     delay: 0.75 },
    { id: 'hub',     icon: Database,   title: 'Integration Hub',   description: 'Sync to IdP & Payroll',         status: 'pending', posKey: 'hub',     delay: 1.0 },
  ];

  const nodes = activeFlow === 'onboarding' ? onboardingNodes : offboardingNodes;

  const handleExportFlow = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nodes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `enterprise-${activeFlow}-flow.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Vertical connector: trigger -> engine
  const pathTriggerEngine = `M${cx(POS.trigger)},${POS.trigger.y + NODE_H} L${cx(POS.engine)},${POS.engine.y}`;

  // Engine -> IT (curves left)
  const pathEngineIT = `M${cx(POS.engine)},${POS.engine.y + NODE_H} C${cx(POS.engine)},${POS.engine.y + NODE_H + 40} ${cx(POS.it)},${POS.it.y - 40} ${cx(POS.it)},${POS.it.y}`;

  // Engine -> Security (straight down)
  const pathEngineSec = `M${cx(POS.engine)},${POS.engine.y + NODE_H} L${cx(POS.sec)},${POS.sec.y}`;

  // Engine -> Facilities (curves right)
  const pathEngineFac = `M${cx(POS.engine)},${POS.engine.y + NODE_H} C${cx(POS.engine)},${POS.engine.y + NODE_H + 40} ${cx(POS.fac)},${POS.fac.y - 40} ${cx(POS.fac)},${POS.fac.y}`;

  // IT -> Hub
  const pathITHub = `M${cx(POS.it)},${POS.it.y + NODE_H} C${cx(POS.it)},${POS.it.y + NODE_H + 40} ${cx(POS.hub)},${POS.hub.y - 40} ${cx(POS.hub)},${POS.hub.y}`;

  // Sec -> Hub  
  const pathSecHub = `M${cx(POS.sec)},${POS.sec.y + NODE_H} L${cx(POS.hub)},${POS.hub.y}`;

  // Fac -> Hub
  const pathFacHub = `M${cx(POS.fac)},${POS.fac.y + NODE_H} C${cx(POS.fac)},${POS.fac.y + NODE_H + 40} ${cx(POS.hub)},${POS.hub.y - 40} ${cx(POS.hub)},${POS.hub.y}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>ServiceNow Flow Designer</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Lifecycle Event: Enterprise <strong style={{ color: 'var(--accent-primary)', textTransform: 'capitalize' }}>{activeFlow}</strong> Flow v2.4
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['onboarding', 'offboarding'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFlow(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                border: activeFlow === f ? 'none' : '1px solid var(--border-color)',
                background: activeFlow === f ? 'var(--accent-primary)' : 'transparent',
                color: activeFlow === f ? 'white' : 'var(--text-secondary)',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{
          flex: 1,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          overflow: 'auto',
          position: 'relative',
          minHeight: '600px',
        }}
      >
        {/* Dot-grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <svg
          width={CW}
          height={CH}
          viewBox={`0 0 ${CW} ${CH}`}
          style={{ display: 'block', margin: '0 auto', position: 'relative', zIndex: 1, overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" opacity="0.7" />
            </marker>
          </defs>

          {/* Arrows */}
          {[
            { d: pathTriggerEngine, delay: 0.3 },
            { d: pathEngineIT,      delay: 0.6 },
            { d: pathEngineSec,     delay: 0.65 },
            { d: pathEngineFac,     delay: 0.7 },
            { d: pathITHub,         delay: 0.95 },
            { d: pathSecHub,        delay: 1.0 },
            { d: pathFacHub,        delay: 1.05 },
          ].map((a, i) => (
            <Arrow key={i} d={a.d} delay={a.delay} />
          ))}

          {/* Nodes */}
          {nodes.map(n => (
            <g key={n.id} transform={`translate(${POS[n.posKey].x},${POS[n.posKey].y})`}>
              <FlowNodeCard {...n} />
            </g>
          ))}

          {/* Parallel bracket label */}
          <motion.text
            x={CW / 2}
            y={POS.it.y + NODE_H / 2}
            textAnchor="middle"
            fill="rgba(99,102,241,0.5)"
            fontSize="10"
            fontFamily="Inter, sans-serif"
            fontWeight="700"
            letterSpacing="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            — PARALLEL EXECUTION —
          </motion.text>
        </svg>
      </div>

      {/* Footer controls */}
      <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Completed',   color: '#10b981', icon: CheckCircle2 },
              { label: 'In Progress', color: '#6366f1', icon: AlertCircle },
              { label: 'Pending',     color: '#64748b', icon: Clock },
            ].map(({ label, color, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Icon size={14} color={color} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExportFlow} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '13px', fontWeight: '500',
              cursor: 'pointer'
            }}>
              <Download size={14} /> Export Flow
            </button>
            <button 
              onClick={runSimulation}
              style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: 'var(--accent-primary)', color: 'white',
              fontSize: '13px', fontWeight: '600',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}>
              <Play size={14} /> Run Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
