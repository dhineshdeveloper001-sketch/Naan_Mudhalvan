import React from 'react';
import { 
  Activity,
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Plus
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { motion } from 'framer-motion';

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  icon: any; 
  color: string;
  delay: number;
}> = ({ title, value, change, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card" 
    style={{ padding: '24px', flex: 1, minWidth: '180px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '12px', 
        background: `${color}15`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Icon size={24} color={color} />
      </div>
      <div style={{ 
        padding: '4px 8px', 
        borderRadius: '20px', 
        background: 'rgba(16, 185, 129, 0.1)', 
        color: 'var(--accent-success)', 
        fontSize: '12px', 
        fontWeight: '600' 
      }}>
        {change}
      </div>
    </div>
    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</h3>
    <p style={{ fontSize: '28px', fontWeight: '700', marginTop: '4px' }}>{value}</p>
  </motion.div>
);

import { NewHireModal } from '../common/NewHireModal';

export const HomeView: React.FC = () => {
  const { employees, triggerOnboarding, setActiveView } = useWorkflow();
  const [timeRange, setTimeRange] = React.useState('Last 30 Days');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOnboardingSubmit = (name: string, role: string, department: string) => {
    triggerOnboarding(name, role, department);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <NewHireModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleOnboardingSubmit} 
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Enterprise Overview</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back. Here's what's happening across your workflows today.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--accent-primary)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            transition: 'var(--transition-fast)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} />
          New Hire Event
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <StatCard 
          title="Active Workflows" 
          value={employees.length.toString()} 
          change="+12%" 
          icon={Activity} 
          color="var(--accent-primary)"
          delay={0.1}
        />
        <StatCard 
          title="Avg. Time to Onboard" 
          value="4.2 Days" 
          change="-1.5d" 
          icon={Clock} 
          color="var(--accent-secondary)"
          delay={0.2}
        />
        <StatCard 
          title="Completion Rate" 
          value="98.4%" 
          change="+2.1%" 
          icon={CheckCircle2} 
          color="var(--accent-success)"
          delay={0.3}
        />
        <StatCard 
          title="Bottlenecks Detected" 
          value="2" 
          change="No change" 
          icon={AlertCircle} 
          color="var(--accent-danger)"
          delay={0.4}
        />
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: 2, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Automation ROI</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ 
              background: 'transparent', 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px'
            }}>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', paddingBottom: '20px' }}>
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                  style={{ 
                    width: '100%', 
                    maxWidth: '40px',
                    borderRadius: '4px 4px 0 0',
                    background: i === 5 ? 'var(--accent-primary)' : 'rgba(99, 102, 241, 0.2)',
                  }} 
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>W{i+1}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <TrendingUp size={20} color="var(--accent-success)" />
              <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Automation has saved <strong style={{ color: 'var(--accent-success)' }}>124 hours</strong> of manual coordination this month.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ flex: 1, padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Recent Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {employees.map((emp, i) => (
              <motion.div 
                key={emp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: i !== employees.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>{emp.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600' }}>{emp.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{emp.stage === 'onboarding' ? 'Onboarding Started' : 'Role Transition'}</p>
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: 'var(--accent-primary)',
                  fontWeight: '600',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {emp.id}
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={() => setActiveView('employees')} style={{ 
            width: '100%', 
            padding: '10px', 
            marginTop: '12px', 
            fontSize: '13px', 
            color: 'var(--accent-primary)', 
            fontWeight: '600' 
          }}>View All Activity</button>
        </div>
      </div>
    </div>
  );
};
