import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  FileText,
  MessageSquareText,
  Video,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Tasks',
      value: '—',
      icon: CheckSquare,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      path: '/tasks',
    },
    {
      label: 'Notes',
      value: '—',
      icon: FileText,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      path: '/notes',
    },
    {
      label: 'Tweets',
      value: '—',
      icon: MessageSquareText,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      path: '/tweets',
    },
    {
      label: 'Videos',
      value: '—',
      icon: Video,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      path: '/videos',
    },
  ];

  const quickActions = [
    { label: 'New Task', icon: CheckSquare, path: '/tasks', color: '#6366f1' },
    { label: 'New Note', icon: FileText, path: '/notes', color: '#10b981' },
    { label: 'Save Tweet', icon: MessageSquareText, path: '/tweets', color: '#3b82f6' },
    { label: 'Save Video', icon: Video, path: '/videos', color: '#ef4444' },
  ];

  return (
    <div className="dashboard">
      {/* Hero section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Your Knowledge Hub</span>
          </div>
          <h1>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="gradient-text">{user?.username}</span>
          </h1>
          <p>Organize your thoughts, tasks, and discoveries — all in one place.</p>
        </div>
        <div className="hero-glow" />
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <button
            key={stat.label}
            className="stat-card card"
            onClick={() => navigate(stat.path)}
          >
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <ArrowRight size={16} className="stat-arrow" />
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            <TrendingUp size={20} />
            Quick Actions
          </h2>
        </div>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="quick-action-card"
              onClick={() => navigate(action.path)}
            >
              <div className="qa-icon" style={{ background: `${action.color}15`, color: action.color }}>
                <Plus size={20} />
              </div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="feature-grid">
        <div className="feature-card card">
          <div className="feature-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}>
            <CheckSquare size={24} />
          </div>
          <h3>Task Management</h3>
          <p>Create, organize, and track your tasks with priorities and due dates.</p>
          <button className="feature-link" onClick={() => navigate('/tasks')}>
            Go to Tasks <ArrowRight size={16} />
          </button>
        </div>

        <div className="feature-card card">
          <div className="feature-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
            <FileText size={24} />
          </div>
          <h3>Notes & Docs</h3>
          <p>Write and organize notes like Notion docs with public/private visibility.</p>
          <button className="feature-link" onClick={() => navigate('/notes')}>
            Go to Notes <ArrowRight size={16} />
          </button>
        </div>

        <div className="feature-card card">
          <div className="feature-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
            <MessageSquareText size={24} />
          </div>
          <h3>Tweet Bookmarks</h3>
          <p>Save and organize your favorite tweets for quick reference.</p>
          <button className="feature-link" onClick={() => navigate('/tweets')}>
            Go to Tweets <ArrowRight size={16} />
          </button>
        </div>

        <div className="feature-card card">
          <div className="feature-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            <Video size={24} />
          </div>
          <h3>Video Library</h3>
          <p>Bookmark YouTube videos and build your personal video library.</p>
          <button className="feature-link" onClick={() => navigate('/videos')}>
            Go to Videos <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
