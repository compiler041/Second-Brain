import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  FileText,
  MessageSquareText,
  Video,
  ArrowRight,
  Plus,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    {
      label: 'Tasks',
      value: '—',
      icon: CheckSquare,
      color: '#E07A5F',
      bg: 'rgba(224, 122, 95, 0.10)',
      path: '/tasks',
    },
    {
      label: 'Notes',
      value: '—',
      icon: FileText,
      color: '#81B29A',
      bg: 'rgba(129, 178, 154, 0.10)',
      path: '/notes',
    },
    {
      label: 'Tweets',
      value: '—',
      icon: MessageSquareText,
      color: '#6C8EBF',
      bg: 'rgba(108, 142, 191, 0.10)',
      path: '/tweets',
    },
    {
      label: 'Videos',
      value: '—',
      icon: Video,
      color: '#F2CC8F',
      bg: 'rgba(242, 204, 143, 0.10)',
      path: '/videos',
    },
  ];

  const quickActions = [
    { label: 'New Task', icon: CheckSquare, path: '/tasks', color: '#E07A5F' },
    { label: 'New Note', icon: FileText, path: '/notes', color: '#81B29A' },
    { label: 'Save Tweet', icon: MessageSquareText, path: '/tweets', color: '#6C8EBF' },
    { label: 'Save Video', icon: Video, path: '/videos', color: '#F2CC8F' },
  ];

  return (
    <div className="dashboard">
      {/* Greeting — clean and simple */}
      <div className="dashboard-greeting">
        <h1>
          {getGreeting()}, {user?.username || 'there'}
        </h1>
        <p>Here's what's happening in your second brain.</p>
      </div>

      {/* Stats — bento grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <button
            key={stat.label}
            className="stat-card"
            onClick={() => navigate(stat.path)}
          >
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              <stat.icon size={20} />
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
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="quick-action-btn"
              onClick={() => navigate(action.path)}
            >
              <Plus size={16} style={{ color: action.color }} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature overview — clean cards */}
      <div className="dashboard-section">
        <h2 className="section-title">Your Workspace</h2>
        <div className="feature-grid">
          <div className="feature-card" onClick={() => navigate('/tasks')}>
            <div className="feature-icon" style={{ background: 'rgba(224,122,95,0.10)', color: '#E07A5F' }}>
              <CheckSquare size={20} />
            </div>
            <div className="feature-body">
              <h3>Tasks</h3>
              <p>Create, organize, and track your tasks with priorities and due dates.</p>
            </div>
            <ArrowRight size={16} className="feature-arrow" />
          </div>

          <div className="feature-card" onClick={() => navigate('/notes')}>
            <div className="feature-icon" style={{ background: 'rgba(129,178,154,0.10)', color: '#81B29A' }}>
              <FileText size={20} />
            </div>
            <div className="feature-body">
              <h3>Notes</h3>
              <p>Write and organize your notes with public or private visibility.</p>
            </div>
            <ArrowRight size={16} className="feature-arrow" />
          </div>

          <div className="feature-card" onClick={() => navigate('/tweets')}>
            <div className="feature-icon" style={{ background: 'rgba(108,142,191,0.10)', color: '#6C8EBF' }}>
              <MessageSquareText size={20} />
            </div>
            <div className="feature-body">
              <h3>Tweets</h3>
              <p>Save and revisit your favorite tweets for quick reference.</p>
            </div>
            <ArrowRight size={16} className="feature-arrow" />
          </div>

          <div className="feature-card" onClick={() => navigate('/videos')}>
            <div className="feature-icon" style={{ background: 'rgba(242,204,143,0.10)', color: '#F2CC8F' }}>
              <Video size={20} />
            </div>
            <div className="feature-body">
              <h3>Videos</h3>
              <p>Bookmark YouTube videos and build your personal library.</p>
            </div>
            <ArrowRight size={16} className="feature-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
