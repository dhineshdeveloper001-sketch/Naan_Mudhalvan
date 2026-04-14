import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, GitBranch, CheckSquare, Settings,
  Search, Users, Activity, ChevronRight, Menu, X, Zap
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PersonaSelector } from './PersonaSelector';

const NAV_ITEMS = [
  { id: 'home',         name: 'Dashboard',           icon: LayoutDashboard },
  { id: 'visualizer',   name: 'Workflow Visualizer',  icon: GitBranch },
  { id: 'tasks',        name: 'Task Orchestration',   icon: CheckSquare },
  { id: 'employees',    name: 'Employees',            icon: Users },
  { id: 'integrations', name: 'Integration Hub',      icon: Activity },
  { id: 'admin',        name: 'Admin Console',        icon: Settings },
];

// Bottom nav shows 5 most important items
const BOTTOM_NAV = [
  { id: 'home',       icon: LayoutDashboard, label: 'Home' },
  { id: 'tasks',      icon: CheckSquare,     label: 'Tasks' },
  { id: 'employees',  icon: Users,           label: 'People' },
  { id: 'integrations',icon: Activity,       label: 'Hub' },
  { id: 'admin',      icon: Settings,        label: 'Admin' },
];

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { activeView, setActiveView, currentPersona } = useWorkflow();
  const isMobile = useIsMobile();

  const navigate = (id: string) => {
    setActiveView(id);
    if (isMobile && onClose) onClose();
  };

  return (
    <aside className="glass-panel" style={{
      width: '260px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      position: 'fixed',
      left: 0, top: 0,
      zIndex: 200,
      overflowY: 'auto',
    }}>
      {/* Logo + close (mobile) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <Zap size={18} color="white" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>GravityFlow</h2>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '0 12px', marginBottom: '8px' }}>NAVIGATION</p>
        {NAV_ITEMS.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', marginBottom: '2px', borderRadius: 'var(--radius-md)',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                transition: 'var(--transition-fast)', position: 'relative',
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              {active && (
                <div style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: '3px', background: 'var(--accent-primary)', borderRadius: '0 4px 4px 0',
                }} />
              )}
              <item.icon size={18} color={active ? 'var(--accent-primary)' : 'currentColor'} />
              <span style={{ fontWeight: active ? '600' : '400', fontSize: '14px' }}>{item.name}</span>
              {active && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </button>
          );
        })}
      </nav>

      {/* Persona Status */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
        <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.05em' }}>CURRENT ROLE</p>
          <p style={{ fontSize: '14px', fontWeight: '700' }}>{currentPersona}</p>
        </div>
      </div>
    </aside>
  );
};

const TopBar: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const { } = useWorkflow();
  const isMobile = useIsMobile();

  return (
    <header className="glass-panel" style={{
      height: 'var(--header-height)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 28px',
      position: 'sticky', top: 0, zIndex: 90,
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Hamburger - mobile only */}
        <button
          className="show-on-mobile"
          onClick={onMenuToggle}
          style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)' }}
        >
          <Menu size={20} />
        </button>

        {/* Search - hide on mobile */}
        {!isMobile && (
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Search workflows, tasks, users..."
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
                borderRadius: '24px', padding: '9px 16px 9px 38px',
                color: 'var(--text-primary)', width: '280px', fontSize: '13px', outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Persona Switcher */}
        <PersonaSelector />

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isMobile && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', fontWeight: '600' }}>Demo User</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PERSISTENT MODE</p>
            </div>
          )}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-info))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0,
          }}>
            D
          </div>
        </div>
      </div>
    </header>
  );
};

// ── Bottom Navigation (mobile) ─────────────────────────────────
const BottomNav: React.FC = () => {
  const { activeView, setActiveView } = useWorkflow();
  return (
    <nav className="bottom-nav" style={{ alignItems: 'center', justifyContent: 'space-around' }}>
      {BOTTOM_NAV.map(item => {
        const active = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              padding: '8px 12px', borderRadius: '10px', flex: 1,
              color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
              background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <item.icon size={20} />
            <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400' }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// ── Shell ──────────────────────────────────────────────────────
export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { activeView } = useWorkflow();

  // Close sidebar on navigation or desktop resize
  useEffect(() => { setSidebarOpen(false); }, [activeView]);
  useEffect(() => { if (!isMobile) setSidebarOpen(false); }, [isMobile]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Desktop sidebar (always visible) */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar drawer */}
      {isMobile && sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{ animation: 'fadeIn 0.2s ease' }}
          />
          {/* Drawer */}
          <div style={{ animation: 'slideIn 0.25s ease', position: 'fixed', zIndex: 201 }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        flex: 1, display: 'flex', flexDirection: 'column',
        minWidth: 0, minHeight: '100vh',
      }}>
        <TopBar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main style={{ padding: isMobile ? '16px' : '28px', flex: 1 }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && <BottomNav />}
    </div>
  );
};
