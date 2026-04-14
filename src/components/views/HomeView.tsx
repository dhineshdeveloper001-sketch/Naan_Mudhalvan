import React from 'react';
import { Activity, Clock, CheckCircle2, AlertCircle, TrendingUp, Plus } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion } from 'framer-motion';
import { NewHireModal } from '../common/NewHireModal';

const StatCard: React.FC<{
  title: string; value: string; change: string;
  icon: any; color: string; delay: number;
}> = ({ title, value, change, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="glass-card"
    style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ padding: '3px 8px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)', fontSize: '11px', fontWeight: '600' }}>
        {change}
      </div>
    </div>
    <div>
      <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</h3>
      <p style={{ fontSize: '26px', fontWeight: '700', marginTop: '4px' }}>{value}</p>
    </div>
  </motion.div>
);

export const HomeView: React.FC = () => {
  const { employees, triggerOnboarding, setActiveView, currentPersona, can } = useWorkflow();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [timeRange, setTimeRange] = React.useState('Last 30 Days');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
      <NewHireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={triggerOnboarding} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            {currentPersona} Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>
            {currentPersona === 'HR Admin' 
              ? "Overseeing enterprise talent and lifecycle events." 
              : `Operational control center for ${currentPersona}.`}
          </p>
        </div>
        {can('trigger_lifecycle') && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'var(--accent-primary)', color: 'white',
              padding: isMobile ? '10px 16px' : '11px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: '600', fontSize: '14px',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              whiteSpace: 'nowrap', alignSelf: 'flex-start',
            }}
          >
            <Plus size={16} /> New Hire
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid-4">
        <StatCard title="Active Workflows"     value={employees.length.toString()} change="+12%" icon={Activity}     color="var(--accent-primary)"   delay={0.05} />
        <StatCard title="Avg. Time to Onboard" value="4.2 Days"                    change="-1.5d" icon={Clock}        color="var(--accent-secondary)" delay={0.10} />
        <StatCard title="Completion Rate"      value="98.4%"                       change="+2.1%" icon={CheckCircle2} color="var(--accent-success)"   delay={0.15} />
        <StatCard title="Bottlenecks"          value="2"                           change="0"     icon={AlertCircle}  color="var(--accent-danger)"    delay={0.20} />
      </div>

      {/* Charts + Recent Events */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* ROI Chart */}
        <div className="glass-card" style={{ flex: '2 1 280px', padding: '24px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Automation ROI</h3>
            <select
              value={timeRange} onChange={e => setTimeRange(e.target.value)}
              style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '5px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', outline: 'none' }}
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '8px' : '12px', height: '160px', paddingBottom: '16px' }}>
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                  style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    background: i === 5 ? 'var(--accent-primary)' : 'rgba(99,102,241,0.2)',
                    boxShadow: i === 5 ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
                  }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>W{i + 1}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.04)', border: '1px dashed rgba(16,185,129,0.2)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <TrendingUp size={18} color="var(--accent-success)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13px', lineHeight: '1.5' }}>
              Automation saved <strong style={{ color: 'var(--accent-success)' }}>124 hours</strong> of manual coordination this month.
            </p>
          </div>
        </div>

        {/* Recent Events */}
        <div className="glass-card" style={{ flex: '1 1 240px', padding: '24px', minWidth: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>Recent Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {employees.slice(0, 5).map((emp, i) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '14px', borderBottom: i !== Math.min(employees.length, 5) - 1 ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                  {emp.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{emp.stage === 'onboarding' ? 'Onboarding Started' : 'Role Transition'}</p>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: '600', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: '10px', flexShrink: 0 }}>
                  {emp.status}
                </div>
              </motion.div>
            ))}
            {employees.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No events yet</p>
            )}
          </div>
          <button onClick={() => setActiveView('employees')} style={{ width: '100%', padding: '10px', marginTop: '12px', fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>
            View All Activity →
          </button>
        </div>
      </div>
    </div>
  );
};
