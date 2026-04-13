import React from 'react';
import { 
  LayoutDashboard, 
  GitBranch, 
  CheckSquare, 
  Settings, 
  Bell, 
  Search, 
  Users, 
  Activity,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useWorkflow();

  const navItems = [
    { id: 'home', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'visualizer', name: 'Workflow Visualizer', icon: GitBranch },
    { id: 'tasks', name: 'Task Orchestration', icon: CheckSquare },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'integrations', name: 'Integration Hub', icon: Activity },
    { id: 'admin', name: 'Admin Console', icon: Settings },
  ];

  return (
    <aside className="glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      <div className="logo" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 12px 32px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          color: 'white'
        }}>G</div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>GravityFlow</h2>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '4px',
              borderRadius: 'var(--radius-md)',
              color: activeView === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeView === item.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              transition: 'var(--transition-fast)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <item.icon size={20} color={activeView === item.id ? 'var(--accent-primary)' : 'currentColor'} />
            <span style={{ fontWeight: activeView === item.id ? '600' : '400', fontSize: '14px' }}>{item.name}</span>
            {activeView === item.id && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: '25%',
                bottom: '25%',
                width: '3px',
                background: 'var(--accent-primary)',
                borderRadius: '0 4px 4px 0'
              }} />
            )}
            {activeView === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
          </button>
        ))}
      </nav>

      <div className="logout" style={{ marginTop: 'auto', padding: '16px 12px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const TopBar: React.FC = () => {
  return (
    <header className="glass-panel" style={{
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input 
            type="text" 
            placeholder="Search workflows, tasks, or users..." 
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '10px 16px 10px 40px',
              color: 'var(--text-primary)',
              width: '320px',
              fontSize: '14px',
              outline: 'none',
              transition: 'var(--transition-fast)'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Bell size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            background: 'var(--accent-danger)',
            borderRadius: '50%',
            border: '2px solid var(--bg-primary)'
          }} />
        </div>
        
        <div style={{ 
          width: '1px', 
          height: '24px', 
          background: 'var(--border-color)' 
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: '600' }}>Admin User</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enterprise Admin</p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-info))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white'
          }}>A</div>
        </div>
      </div>
    </header>
  );
};

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />

      {/* Right column — offset by sidebar width */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: '100vh',
      }}>
        <TopBar />
        <main style={{
          padding: '32px',
          flex: 1,
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};
