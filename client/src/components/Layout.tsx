import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  FileText,
  MessageSquareText,
  Video,
  Star,
  Clock,
  Settings,
  LogOut,
  Brain,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const navItems = [
  { to: '/', icon: CheckSquare, label: 'Tasks' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/tweets', icon: MessageSquareText, label: 'Tweets' },
  { to: '/videos', icon: Video, label: 'Videos' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Brain size={20} />
            </div>
            <span className="logo-text">Second Brain</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="back-to-landing" onClick={() => navigate('/landing')}>
            <ArrowLeft size={14} />
            <span>Back to landing</span>
          </button>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.username || 'User'}</span>
                <span className="user-email">{user?.email || ''}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
        </div>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
