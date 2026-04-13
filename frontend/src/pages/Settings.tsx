import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Shield, Eye, EyeOff, LogOut, Mail, Calendar, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [privacyDefault, setPrivacyDefault] = useState<'private' | 'public'>('private');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="settings-section">
        <h2 className="section-title">
          <User size={18} />
          Profile
        </h2>
        <div className="profile-card card">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-details">
            <h3>{user?.username}</h3>
            <div className="profile-meta">
              <span><Mail size={14} /> {user?.email}</span>
              <span><Calendar size={14} /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
            </div>
            <span className="badge badge-purple">{user?.role || 'user'}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <h2 className="section-title">
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          Appearance
        </h2>
        <div className="card">
          <div className="setting-row">
            <div className="setting-info">
              <h4>Theme</h4>
              <p>Switch between light and dark mode</p>
            </div>
            <div className="visibility-toggle">
              <button
                className={`vis-btn ${theme === 'light' ? 'vis-btn--active' : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                <Sun size={14} /> Light
              </button>
              <button
                className={`vis-btn ${theme === 'dark' ? 'vis-btn--active' : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                <Moon size={14} /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy settings */}
      <div className="settings-section">
        <h2 className="section-title">
          <Shield size={18} />
          Privacy
        </h2>
        <div className="card">
          <div className="setting-row">
            <div className="setting-info">
              <h4>Default Visibility</h4>
              <p>Set the default visibility for new content</p>
            </div>
            <div className="visibility-toggle">
              <button
                className={`vis-btn ${privacyDefault === 'private' ? 'vis-btn--active' : ''}`}
                onClick={() => setPrivacyDefault('private')}
              >
                <EyeOff size={14} /> Private
              </button>
              <button
                className={`vis-btn ${privacyDefault === 'public' ? 'vis-btn--active' : ''}`}
                onClick={() => setPrivacyDefault('public')}
              >
                <Eye size={14} /> Public
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-section">
        <h2 className="section-title danger-title">Danger Zone</h2>
        <div className="card danger-card">
          <div className="setting-row">
            <div className="setting-info">
              <h4>Sign Out</h4>
              <p>Sign out of your account on this device</p>
            </div>
            <button className="btn-danger" onClick={handleLogout}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
